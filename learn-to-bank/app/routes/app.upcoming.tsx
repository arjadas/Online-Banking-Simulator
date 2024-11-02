/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Grid, Spacer, Text } from '@geist-ui/core';
import { Account, RecurringTransaction } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import React, { useCallback } from 'react';
import { getUserSession } from '~/auth.server';
import { RecurringTransactionCard } from '~/components/FuturePaymentCard';
import { UpcomingPaymentsList } from '~/components/UpcomingPaymentsList';
import { getRecurringTransactions } from '~/service/recurringTransactionService';
import { GeneratedTransaction } from '@parent/learn-to-bank-util/futureTransactionUtil';
import { splitLists } from '@parent/learn-to-bank-util/util';
import { getPrismaClient } from "../service/db.server";
import ResizableText from '~/components/ResizableText';

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

  const recurringTransactions = await getRecurringTransactions(context, user!.uid);
  const userAccounts = await db.account.findMany({
    where: { uid: user!.uid },
  })

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

  let [recurringPayments, oneOffPayments] = splitLists(recurringTransactions, (transaction) => {
    return !transaction.ends_on || new Date(transaction.starts_on).getTime() !== new Date(transaction.ends_on).getTime()
  });

  oneOffPayments = oneOffPayments.filter((transaction) => new Date(transaction.starts_on) > new Date())
  recurringPayments = recurringPayments.filter((transaction) => new Date(transaction.starts_on) <= new Date())

  const userAccountIds = userAccounts.map((account) => account.acc);

  const renderRecurringTransactionCard = (transaction: RecurringTransactionWithRecipient) => {
    return <RecurringTransactionCard
      key={transaction.recc_transaction_id}
      transaction={transaction}
      userAccountIds={userAccountIds}
    />
  };

  const renderUpcomingPaymentCard = useCallback(({ generatedTransaction, style }: { generatedTransaction: GeneratedTransaction, style: React.CSSProperties }) => {
    return <RecurringTransactionCard
      key={generatedTransaction.transaction.recc_transaction_id}
      transaction={generatedTransaction}
      userAccountIds={userAccountIds}
    />
  }, [userAccountIds]);

  return (
    <Grid.Container gap={2} direction="row" style={{ height: '125vh' }}>
      <Grid xs={12} style={{ height: '100%' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: "100%",
        }}>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', minHeight: 0, }}>
            <Card shadow padding={1} margin={1} style={{ height: '100%', overflowY: 'hidden' }}>
              <Card.Content style={{ height: '100%', paddingBottom: '10px' }}>
                <ResizableText h2>Recurring Payments</ResizableText>
                <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '10px' }}>
                  {(recurringPayments as any as RecurringTransactionWithRecipient[]).map(renderRecurringTransactionCard)}
                  <Spacer h={3} />
                </div>
              </Card.Content>
            </Card>
          </div>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Card shadow padding={1} margin={1} style={{ height: '100%', overflowY: 'hidden' }}>
              <Card.Content style={{ height: '100%' }}>
                <ResizableText h2>Future One-off Payments</ResizableText>
                <div style={{ height: '100%', overflowY: 'auto' }}>
                  {(oneOffPayments as any as RecurringTransactionWithRecipient[]).map(renderRecurringTransactionCard)}
                  <Spacer h={3} />
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </Grid>
      <Grid xs={12} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card shadow width="100%" padding={1} margin={1} style={{ height: '100%', overflowY: 'hidden' }}>
          <Card.Content style={{ height: '100%' }}>
            <ResizableText h2>Upcoming Payments</ResizableText>
            <div style={{ height: '100%', overflowY: 'hidden' }}>
              <UpcomingPaymentsList
                recurringTransactions={recurringTransactions as any as RecurringTransactionWithRecipient[]}
                userAccountIds={userAccountIds}
                renderUpcomingPaymentCard={renderUpcomingPaymentCard}
              />
            </div>
          </Card.Content>
        </Card>
      </Grid>
    </Grid.Container >
  );
}

/*
*/