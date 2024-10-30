/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Grid, Text } from '@geist-ui/core';
import { Account, RecurringTransaction } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import React, { useCallback } from 'react';
import { getUserSession } from '~/auth.server';
import { RecurringTransactionCard } from '~/components/FuturePaymentCard';
import { UpcomingPaymentsList } from '~/components/UpcomingPaymentsList';
import { getRecurringTransactions } from '~/service/recurringTransactionService';
import { GeneratedTransaction } from '~/util/futureTransactionUtil';
import { splitLists } from '~/util/util';
import { getPrismaClient } from "../service/db.server";

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
    return !transaction.ends_on || new Date(transaction.starts_on) !== new Date(transaction.ends_on)
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
    <Grid.Container gap={2} direction="row">
      <Grid xs={12} style={{ display: 'flex', flexDirection: 'column', }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: "100%",
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, }}>
            <Card padding={1} margin={1} width="100%" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Card.Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Text h2>Recurring Transactions</Text>
                <div style={{ flex: 1, overflowY: 'scroll' }}>
                  {(recurringPayments as any as RecurringTransactionWithRecipient[]).map(renderRecurringTransactionCard)}
                </div>
              </Card.Content>
            </Card>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Card padding={1} margin={1} width="100%" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Card.Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Text h2>Future One-off Transactions</Text>
                <UpcomingPaymentsList
                  recurringTransactions={oneOffPayments as any as RecurringTransactionWithRecipient[]}
                  userAccountIds={userAccountIds}
                  renderCard={renderRecurringTransactionCard}
                />
              </Card.Content>
            </Card>
          </div>
        </div>
      </Grid>
      <Grid xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
        <Card width="100%" padding={1} margin={1}>
          <Text h2>Upcoming Payments</Text>
          <UpcomingPaymentsList
            recurringTransactions={recurringTransactions as any as RecurringTransactionWithRecipient[]}
            userAccountIds={userAccountIds}
            renderGeneratedCard={renderUpcomingPaymentCard}
          />
        </Card>
      </Grid>
    </Grid.Container>
  );
}