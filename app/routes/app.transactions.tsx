import { Button, Card, Collapse, Grid, Input, Select, Spacer } from '@geist-ui/core';
import { ArrowDownCircle, Search, Shuffle, User } from '@geist-ui/icons';
import { PrismaD1 } from '@prisma/adapter-d1';
import { Account, Transaction } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from 'react';
import ResizableText from '~/components/ResizableText';
import { getPrismaClient } from '~/util/db.server';
import { getUserSession } from "../auth.server";
import { generateTransactionsPDF } from '~/util/generateTransactionsPDF';

// Function to format the date as "Day, 23rd Sep (Today)" for display
const formatDate = (transactionDate: Date) => {
  const now = new Date();
  const differenceInDays = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  };

  let formattedDate = new Intl.DateTimeFormat('en-US', options).format(transactionDate);

  if (differenceInDays === 0) {
    formattedDate += " (Today)";
  } else if (differenceInDays === 1) {
    formattedDate += " (Yesterday)";
  } else {
    formattedDate += ` (${differenceInDays} days ago)`;
  }

  return formattedDate;
};

// Function to convert a date into "DD/MM/YYYY" for search comparison
const formatSearchDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
  const year = date.getFullYear();

  return `${day}/${month}/${year}`; // Australian date format
};

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
      formatSearchDate(new Date(tx.timestamp)).includes(searchQuery); // Match DD/MM/YYYY format for search
    return accountMatches && queryMatches;
  });

  const handleDownloadPDF = () => {
    
    const transactionData = filteredTransactions.map(tx => ({
      ...tx,
      sender: tx.sender.short_description,
      recipient: tx.recipient.short_description,
      description: tx.description || "No Description Provided",
    }));
    generateTransactionsPDF(transactionData);
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

  // Determine the correct icon based on whether the transaction is internal or external
  const getTransactionIcon = (recipientAcc: number) => {
    return userAccountIds.includes(recipientAcc)
      ? <Shuffle size={18} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
      : <User size={18} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />;
  };

  return (
    <>
      <Spacer h={2} />
      <Card width="100%" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <ResizableText h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
          Transaction History
        </ResizableText>

        {/* Filter dropdown */}
        <Select placeholder="Filter by account" onChange={val => setFilteredAccount(Number(val) || 'all')} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Select.Option value="all">All Accounts</Select.Option>
          {// @ts-ignore 
            accounts.map((account: Account) => (
              <Select.Option key={account.acc} value={account.acc.toString()}>
                {account.short_description} (BSB: {account.bsb})
              </Select.Option>
            ))}
        </Select>

        <Spacer h={2} />

        {/* Search Bar and Download PDF Button */}
        <Grid.Container justify="space-between" alignItems="center">
          <Grid>
            <Button type="secondary" ghost auto scale={0.7} onClick={handleDownloadPDF} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <strong>Download PDF Statement</strong> &nbsp;
              <ArrowDownCircle size={18} style={{ marginLeft: '8px' }} />
            </Button>
          </Grid>
          <Grid>
            <Input
              icon={<Search />}
              placeholder="Search Transaction"
              type="secondary"
              scale={0.7}
              onChange={e => setSearchQuery(e.target.value)}
              clearable onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
          </Grid>
        </Grid.Container>
      </Card>

      <Spacer h={2} />

      {/* Transaction List with details */}
      {filteredTransactions.map((transaction) => (
        <Card key={transaction.transaction_id} width="100%">
          <Grid.Container gap={2}>
            <Grid xs={18} alignItems="center">
              {/* Adding spaces between each attribute */}
              <ResizableText small style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                {/* Icon before "From" */}
                {getTransactionIcon(transaction.recipient_acc)}
                &nbsp;&nbsp;<strong>From:</strong> {transaction.sender.short_description} &nbsp;&nbsp;
                <strong>To:</strong> {transaction.recipient.short_description} &nbsp;&nbsp;
                <strong>Amount:</strong> ${transaction.amount.toFixed(2)} &nbsp;&nbsp;
                <strong>Date:</strong> {formatDate(new Date(transaction.timestamp))}
              </ResizableText>
            </Grid>
            <Grid xs={6} alignItems="center" justify="flex-end">
              <Button shadow type="secondary" auto onClick={() => toggleTransactionDetails(transaction.transaction_id)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {expandedTransactions.has(transaction.transaction_id) ? 'Hide Details' : 'View Details'}
              </Button>
            </Grid>
          </Grid.Container>

          {expandedTransactions.has(transaction.transaction_id) && (
            <Collapse title="Transaction Details" initialVisible>
              <Grid.Container gap={1} alignItems="flex-start">
                {/* Boundaries for text overflow handling */}
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
            </Collapse>
          )}
        </Card>
      ))}

      <Spacer h={2} />
    </>
  );
}
