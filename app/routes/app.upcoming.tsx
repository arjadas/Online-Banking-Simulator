/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Card, Grid, Text } from '@geist-ui/core';
import { Account, RecurringTransaction } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getUserSession } from '~/auth.server';
import { frequencyObjectToString } from '~/components/ReccuringTransactionModal';
import ResizableText from '~/components/ResizableText';
import { formatDate, getBadgeColor, getTransactionIcon, toFixedWithCommas } from '~/util/util';
import { getPrismaClient } from "../service/db.server";
import { GeneratedTransaction, getTransactionsForPeriodBulk } from '~/util/futureTransactionUtil';
import { addMonths, addYears } from 'date-fns';
import { UpcomingPaymentsList } from '~/components/UpcomingPaymentsList';

export type RecurringTransactionWithRecipient = RecurringTransaction & {
  recipient: {
    acc: number;
    acc_name: string;
    short_description: string;
  };
  sender: {
    acc: number;
    acc_name: string;
    short_description: string;
  };
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  if (!user) return json({ error: 'Unauthenticated' }, { status: 401 });

  const [recurringTransactions, userAccounts] = await Promise.all([
    db.recurringTransaction.findMany({
      where: { sender_uid: user!.uid },
      include: {
        recipient: {
          select: {
            acc: true,
            acc_name: true,
            short_description: true
          }
        },
        sender: {
          select: {
            acc: true,
            acc_name: true,
            short_description: true
          }
        }
      }
    }),
    db.account.findMany({
      where: { uid: user!.uid },
    }),
  ]);

  return json({
    recurringTransactions,
    userAccounts,
  });
};
export default function UpcomingPayments() {
  const { recurringTransactions, userAccounts } = useLoaderData<{
    recurringTransactions: RecurringTransactionWithRecipient[]
    userAccounts: Account[];
  }>();

  const recurringPayments = recurringTransactions.filter((transaction) => {
    return !transaction.ends_on || new Date(transaction.starts_on).getTime() !== new Date(transaction.ends_on).getTime()
  });

  const userAccountIds = userAccounts.map((account) => account.acc);

  const renderRecurringTransactionCard = (transaction: RecurringTransactionWithRecipient) => {
    const isExternalSender = !userAccountIds.includes(transaction.sender_acc);
    const isExternalRecipient = !userAccountIds.includes(transaction.recipient_acc);
    const senderDisplayName = transaction.sender.acc_name;
    const recipientDisplayName = transaction.recipient.acc_name;

    return (
      <Card key={transaction.recc_transaction_id} shadow style={{ marginBottom: '1rem' }} >
        <Grid.Container gap={2}>
          <Grid xs={3} alignItems="center" justify="center">
            {getTransactionIcon(userAccountIds, transaction.recipient_acc)}
          </Grid>
          <Grid xs={21} alignItems="center">
            <Grid.Container gap={1}>
              <Grid xs={24}>
                <ResizableText small>
                  From: <Badge type="secondary" style={{ backgroundColor: getBadgeColor(transaction.sender.short_description, isExternalSender) }}>
                    {isExternalSender ? senderDisplayName : transaction.sender.short_description}
                  </Badge>
                  &nbsp;To: <Badge type="secondary" style={{ backgroundColor: getBadgeColor(transaction.recipient.short_description, isExternalRecipient) }}>
                    {isExternalRecipient ? recipientDisplayName : transaction.recipient.short_description}
                  </Badge>
                </ResizableText>
              </Grid>
              <Grid xs={24}>
                <ResizableText small>Amount: ${toFixedWithCommas(transaction.amount / 100, 2)}</ResizableText>
              </Grid>
              <Grid xs={24}>
                <ResizableText small>Frequency: {frequencyObjectToString(JSON.parse(transaction.frequency))}</ResizableText>
              </Grid>
              <Grid xs={24}>
                <ResizableText small>Starts on: {formatDate(new Date(transaction.starts_on))}</ResizableText>
              </Grid>
              <Grid xs={24}>
                <ResizableText small>
                  Ends on: {transaction.ends_on ? formatDate(new Date(transaction.ends_on)) : 'Indefinite'}
                </ResizableText>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Card>
    );
  };

  const renderUpcomingPaymentCard = useCallback(({ generatedTransaction, style }: { generatedTransaction: GeneratedTransaction, style: React.CSSProperties }) => {
    const isExternalSender = !userAccountIds.includes(generatedTransaction.transaction.sender.acc);
    const isExternalRecipient = !userAccountIds.includes(generatedTransaction.transaction.recipient.acc);

    return (
      <div style={style}>
        <Card margin={1} shadow>
          <Grid.Container gap={2}>
            <Grid xs={2} alignItems="center" justify="flex-end">
              {getTransactionIcon(userAccountIds, generatedTransaction.transaction.recipient.acc)}
            </Grid>
            <Grid xs={22} alignItems="center">
              <Grid.Container gap={1}>
                <Grid xs={24}>
                  <ResizableText small>
                    From: <Badge type="secondary" style={{ backgroundColor: getBadgeColor(generatedTransaction.transaction.sender.short_description, isExternalSender) }}>
                      {isExternalSender ? generatedTransaction.transaction.sender.acc_name : generatedTransaction.transaction.sender.short_description}
                    </Badge>
                    &nbsp;To: <Badge type="secondary" style={{ backgroundColor: getBadgeColor(generatedTransaction.transaction.recipient.short_description, isExternalRecipient) }}>
                      {isExternalRecipient ? generatedTransaction.transaction.recipient.acc_name : generatedTransaction.transaction.recipient.short_description}
                    </Badge>
                  </ResizableText>
                </Grid>
                <Grid xs={24}>
                  <ResizableText small>Amount: ${toFixedWithCommas(generatedTransaction.transaction.amount / 100, 2)}</ResizableText>
                </Grid>
                <Grid xs={24}>
                  <ResizableText small>Date: {formatDate(new Date(generatedTransaction.generatedDate))}</ResizableText>
                </Grid>
              </Grid.Container>
            </Grid>
          </Grid.Container>
        </Card>
      </div>
    );
  }, [userAccountIds]);

  return (
    <Grid.Container gap={2} direction="row">
      <Grid xs={12}>
        <Card padding={1} width="100%">
          <Text h2>Recurring Transactions</Text>
          {(recurringPayments as any as RecurringTransactionWithRecipient[]).map(renderRecurringTransactionCard)}
        </Card>
      </Grid>
      <Grid xs={12}>
        <Card width="100%" padding={1}>
          <Text h2>Upcoming Payments</Text>
          <UpcomingPaymentsList
            recurringTransactions={recurringTransactions as any as RecurringTransactionWithRecipient[]}
            userAccountIds={userAccountIds}
            renderUpcomingPaymentCard={renderUpcomingPaymentCard}
          />
        </Card>
      </Grid>
    </Grid.Container>
  );
}