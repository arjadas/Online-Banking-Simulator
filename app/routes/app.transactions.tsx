import React, { useState } from 'react';
import { useLoaderData } from "@remix-run/react";
import { Text, Spacer, Grid, Card, Select } from '@geist-ui/core';
import { Account, Transaction } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/node";
import { db } from "../util/db.server";
import { requireUserSession } from "../auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUserSession(request);

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

  // ability to filter transactions based on selected account
  const filteredTransactions = filteredAccount === 'all'
    ? transactions
    : transactions.filter(
      (tx) => tx.sender_acc === filteredAccount || tx.recipient_acc === filteredAccount
    );

  return (
    <>
      <Spacer h={2} />
      <Text h2>Your Transactions</Text>

      {/* filter dropdown */}
      <Select placeholder="Filter by account" onChange={val => setFilteredAccount(Number(val) || 'all')} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Select.Option value="all">All Accounts</Select.Option>
        {accounts.map((account) => (
          <Select.Option key={account.acc} value={account.acc.toString()}>
            {account.short_description} (BSB: {account.bsb})
          </Select.Option>
        ))}
      </Select>

      <Spacer h={2} />

      {/* transaction list */}
      {filteredTransactions.map((transaction) => (
        <Card key={transaction.transaction_id}>
          <Text small>Amount: ${transaction.amount}</Text>
          <Text small>From: {transaction.sender.short_description}</Text>
          <Text small>To: {transaction.recipient.short_description}</Text>
          <Text small>Reference: {transaction.reference}</Text>
          <Text small>Date: {new Date(transaction.timestamp).toLocaleDateString()}</Text>
        </Card>
      ))}

      <Spacer h={2} />
    </>
  );
}
