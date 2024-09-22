import React, { useState } from 'react';
import { useLoaderData } from "@remix-run/react";
import { Text, Spacer, Grid, Card, Select, Button, Collapse, Input } from '@geist-ui/core';
import { Account, Transaction } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { getPrismaClient } from "../util/db.server";
import { requireUserSession } from "../auth.server";

// Function to format the date into "Day, Month Date (X days ago)"
const formatDate = (transactionDate: Date) => {
  const now = new Date();
  const differenceInDays = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
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

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await requireUserSession(request);
  const db = getPrismaClient(context);

  const [transactions, accounts] = await Promise.all([
    db.transaction.findMany({
      where: {
        OR: [
          { sender_uid: user.uid },
          { recipient_uid: user.uid }
        ],
      },
      include: {
        sender: true,
        recipient: true,
      },
    }),
    db.account.findMany({
      where: { uid: user.uid },
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
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter transactions based on selected account or search query
  const filteredTransactions = transactions.filter((tx) => {
    const accountMatches = filteredAccount === 'all' || tx.sender_acc === filteredAccount || tx.recipient_acc === filteredAccount;
    const queryMatches = !searchQuery || 
      tx.sender.short_description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tx.recipient.short_description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      new Date(tx.timestamp).toLocaleDateString().includes(searchQuery);
    return accountMatches && queryMatches;
  });

  const handleDownloadPDF = () => {
    // Code to handle PDF download (you can integrate a backend route for this functionality)
  };

  const toggleTransactionDetails = (transactionId: string) => {
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

  return (
    <>
      <Spacer h={2} />
      <Text h2>Transaction History</Text>

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
          <Button auto onClick={handleDownloadPDF}>Download PDF Statement</Button>
        </Grid>
        <Grid>
          <Input 
            placeholder="Search Transaction" 
            width="300px" 
            onChange={e => setSearchQuery(e.target.value)} 
            clearable
          />
        </Grid>
      </Grid.Container>

      <Spacer h={2} />

      {/* Transaction List with details */}
      {filteredTransactions.map((transaction) => (
        <Card key={transaction.transaction_id} width="100%">
          <Grid.Container gap={2}>
            <Grid xs={18}>
              {/* Adding spaces between each attribute */}
              <Text small>
                From: {transaction.sender.short_description} &nbsp;&nbsp;
                To: {transaction.recipient.short_description} &nbsp;&nbsp;
                Amount: ${transaction.amount} &nbsp;&nbsp;
                Date: {formatDate(new Date(transaction.timestamp))}
              </Text>
            </Grid>
            <Grid xs={6} alignItems="center" justify="flex-end">
              <Button auto size="small" onClick={() => toggleTransactionDetails(transaction.transaction_id)}>
                {expandedTransactions.has(transaction.transaction_id) ? 'Hide Details' : 'View Details'}
              </Button>
            </Grid>
          </Grid.Container>

          {expandedTransactions.has(transaction.transaction_id) && (
            <Collapse title="Transaction Details" initialVisible>
              <Grid.Container gap={1} alignItems="flex-start">
                {/* Boundaries for text overflow handling */}
                <Grid xs={24} md={6}>
                  <Text small>Sender Account:&nbsp;</Text>
                  <Text small>{transaction.sender_acc}</Text>
                </Grid>
                <Grid xs={24} md={6}>
                  <Text small>Recipient Account:&nbsp;</Text>
                  <Text small>{transaction.recipient_acc}</Text>
                </Grid>
                <Grid xs={24} md={6}>
                  <Text small>Reference:&nbsp;</Text>
                  <Text small>{transaction.reference}</Text>
                </Grid>
                <Grid xs={24} md={6}>
                  {/* Handling description */}
                  <Text small>Description:&nbsp;</Text>
                  <Text small>{transaction.description || "No Description Provided"}</Text>
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