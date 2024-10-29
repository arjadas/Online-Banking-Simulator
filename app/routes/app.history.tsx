import { Badge, Button, Card, Grid, Input, Select, Spacer } from '@geist-ui/core';
import { ArrowDownCircle, Search } from '@geist-ui/icons';
import { PrismaD1 } from '@prisma/adapter-d1';
import { Account, Transaction } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from 'react';
import ResizableText from '~/components/ResizableText';
import { getPrismaClient } from '~/service/db.server';
import { generateTransactionsPDF } from '~/service/generateTransactionsPDF';
import { formatDate, formatSearchDate, getBadgeColor, getTransactionIcon, toFixedWithCommas } from '~/util/util';
import { getUserSession } from "../auth.server";

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await getUserSession(context, request);
  const adapter = new PrismaD1(context.cloudflare.env.DB);
  const db = getPrismaClient(context);

  const [transactions, accounts] = await Promise.all([
    db.transaction.findMany({
      where: {
        OR: [
          { sender_uid: user!.uid },
          { recipient_uid: user!.uid }
        ],
      },
      include: {
        sender: true,
        recipient: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    }),
    db.account.findMany({
      where: { uid: user!.uid },
    }),
  ]);

  return json({ transactions, accounts });
};

export default function Transactions() {
  const { transactions, accounts } = useLoaderData<{
    transactions: (Transaction & { sender: Account; recipient: Account })[];
    accounts: Account[];
  }>();

  const [filteredAccount, setFilteredAccount] = useState<number | 'all'>('all');
  const [expandedTransactions, setExpandedTransactions] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  const userAccountIds = accounts.map((account) => account.acc);

  // Filter transactions based on selected account or search query
  const filteredTransactions = transactions.filter((tx) => {
    const accountMatches = filteredAccount === 'all' || tx.sender_acc === filteredAccount || tx.recipient_acc === filteredAccount;
    const queryMatches = !searchQuery ||
      tx.sender.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender.acc_name.toLowerCase().includes(searchQuery.toLowerCase()) || // Match sender username
      tx.recipient.acc_name.toLowerCase().includes(searchQuery.toLowerCase()) || // Match recipient username
      formatSearchDate(new Date(tx.timestamp)).includes(searchQuery); // Match DD/MM/YYYY format for search
    return accountMatches && queryMatches;
  });

  const handleDownloadPDF = async () => {
    try {
      const transactionData = filteredTransactions.map(tx => {
        const isExternalSender = !userAccountIds.includes(tx.sender_acc);
        const isExternalRecipient = !userAccountIds.includes(tx.recipient_acc);
        const senderDisplayName = tx.sender.acc_name;
        const recipientDisplayName = tx.recipient.acc_name;

        return {
          ...tx,
          sender: isExternalSender ? senderDisplayName : tx.sender.short_description,
          recipient: isExternalRecipient ? recipientDisplayName : tx.recipient.short_description,
          description: tx.description || "No Description Provided",
        };
      });
      await generateTransactionsPDF(transactionData);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  };

  const toggleTransactionDetails = (transactionId: number) => {
    setExpandedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  const totalSent = filteredTransactions.reduce((acc, tx) => acc + (userAccountIds.includes(tx.sender_acc) ? tx.amount / 100 : 0), 0);
  const totalReceived = filteredTransactions.reduce((acc, tx) => acc + (userAccountIds.includes(tx.recipient_acc) ? tx.amount / 100 : 0), 0);

  return (
    <>
      <Spacer h={2} />
      <Card shadow width="100%" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <ResizableText h2 style={{ marginBottom: '30px' }}>Transaction History</ResizableText>

        {/* Total Transactions Summary */}
        <Grid.Container gap={2} justify="center" alignItems="center" style={{ marginBottom: '20px' }}>
          <ResizableText>
            <ResizableText small style={{ fontWeight: 'bold' }}>Total Transactions:&nbsp;</ResizableText> {filteredTransactions.length} |
            <ResizableText small style={{ fontWeight: 'bold', marginLeft: '10px' }}>Total Sent:&nbsp;</ResizableText> ${toFixedWithCommas(totalSent, 2)} |
            <ResizableText small style={{ fontWeight: 'bold', marginLeft: '10px' }}>Total Received:&nbsp;</ResizableText> ${toFixedWithCommas(totalReceived, 2)}
          </ResizableText>
        </Grid.Container>

        {/* Filter, Search, and Download PDF Section */}
        <Grid.Container gap={2} alignItems="center" justify="space-between" style={{ alignItems: 'center' }}>
          <Grid xs={6}>
            <Select
              placeholder="Filter by account"
              width="100%"
              height="35px"
              style={{ height: '35px' }}
              onChange={val => setFilteredAccount(Number(val) || 'all')} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              <Select.Option value="all">All Accounts</Select.Option>
              {accounts.map((account) => {
                const parsedAccount = {
                  ...account,
                  opened_timestamp: new Date(account.opened_timestamp),
                };
                return (
                  <Select.Option key={parsedAccount.acc} value={parsedAccount.acc.toString()}>
                    {parsedAccount.short_description} (BSB: {parsedAccount.bsb})
                  </Select.Option>
                );
              })}
            </Select>
          </Grid>

          <Grid xs={10} style={{ display: 'flex', justifyContent: 'center' }}>
            <Input
              icon={<Search />}
              placeholder="Search Transaction"
              width="100%"
              height="35px"
              marginTop='10px'
              style={{ height: '35px', textAlign: 'center' }}
              onChange={e => setSearchQuery(e.target.value)}
              clearable onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
          </Grid>

          <Grid xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="secondary"
              ghost
              auto
              scale={0.7}
              height="30px"
              marginTop='3px'
              style={{ height: '30px' }}
              onClick={handleDownloadPDF} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              <strong>Download PDF Statement</strong> &nbsp;
              <ArrowDownCircle size={18} style={{ marginLeft: '8px' }} />
            </Button>
          </Grid>
        </Grid.Container>
      </Card>

      <Spacer h={2} />

      <Card>
        {/* Transaction List with details */}
        {filteredTransactions.map((transaction) => {
          const isExternalSender = !userAccountIds.includes(transaction.sender_acc);
          const isExternalRecipient = !userAccountIds.includes(transaction.recipient_acc);

          const senderDisplayName = transaction.sender.acc_name;
          const recipientDisplayName = transaction.recipient.acc_name;

          return (
            <>
              <Card key={transaction.transaction_id} width="100%">
                <Grid.Container gap={2}>
                  <Grid xs={1} alignItems="center" justify="flex-end">
                    {getTransactionIcon(userAccountIds, transaction.sender_acc)}
                  </Grid>
                  <Grid xs={2} alignItems="center" justify='center' alignContent='center'>
                    <ResizableText h3 style={{ margin: "0px 0px 0px 20px" }}>${toFixedWithCommas(transaction.amount / 100, 2)}</ResizableText>
                  </Grid>
                  <Grid xs={15} alignItems="center">
                    <ResizableText small style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                      {/* Icon and "From" */}
                      &nbsp;&nbsp;From:&nbsp;
                      <Badge type="secondary" style={{ backgroundColor: getBadgeColor(transaction.sender.short_description, isExternalSender) }}>
                        {isExternalSender ? senderDisplayName : transaction.sender.short_description}
                      </Badge>
                      &nbsp;&nbsp;To:&nbsp;
                      <Badge type="secondary" style={{ backgroundColor: getBadgeColor(transaction.recipient.short_description, isExternalRecipient) }}>
                        {isExternalRecipient ? recipientDisplayName : transaction.recipient.short_description}
                      </Badge>
                      &nbsp;&nbsp;&nbsp;&nbsp;On {formatDate(new Date(transaction.timestamp))}
                    </ResizableText>
                  </Grid>
                  <Grid xs={6} alignItems="center" justify="flex-end">
                    <Button shadow type="secondary" auto onClick={() => toggleTransactionDetails(transaction.transaction_id)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      {expandedTransactions.has(transaction.transaction_id) ? 'Hide Details' : 'View Details'}
                    </Button>
                  </Grid>
                </Grid.Container>

                {expandedTransactions.has(transaction.transaction_id) && (
                  <>
                    <Spacer />
                    <Grid.Container gap={1} margin={1} alignItems="flex-start">
                      <Grid xs={24} md={6}>
                        <ResizableText small><strong>Sender Account:</strong>&nbsp;</ResizableText>
                        <ResizableText small>{transaction.sender_acc}</ResizableText>
                      </Grid>
                      <Grid xs={24} md={6}>
                        <ResizableText small><strong>Recipient Account:</strong>&nbsp;</ResizableText>
                        <ResizableText small>{transaction.recipient_acc}</ResizableText>
                      </Grid>
                      <Grid xs={24} md={6}>
                        <ResizableText small><strong>Reference:</strong>&nbsp;</ResizableText>
                        <ResizableText small>{transaction.reference}</ResizableText>
                      </Grid>
                      <Grid xs={24} md={6}>
                        <ResizableText small><strong>Description:</strong>&nbsp;</ResizableText>
                        <ResizableText small>{transaction.description || "No Description Provided"}</ResizableText>
                      </Grid>
                    </Grid.Container>
                  </>
                )}
              </Card>

              <Spacer h={1} />
            </>
          );
        })}
      </Card>
      <Spacer h={2} />
    </>
  );
}