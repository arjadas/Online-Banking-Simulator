import React from 'react';
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { Text, Spacer, Grid, Card } from '@geist-ui/core';
import { requireUserSession } from "../auth.server";
import AccountCard from '../components/AccountCard';
import { Account } from '@prisma/client';
import { db } from "../util/db.server";

type MeUser = {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  notifications: Array<{
    notification_id: string;
    content: string;
    timestamp: Date;
  }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  // Ensure the user is authenticated
  const user = await requireUserSession(request);
  
  // Fetch the user details and related data from Prisma
  const [userData, userAccounts] = await Promise.all([
    db.user.findUnique({
      where: { uid: user.uid },
      include: {
        notifications: {
          where: { read: false },
          take: 5,
        },
      },
    }),
    db.account.findMany({
      where: { uid: user.uid },
    }),
  ]);

  if (!userData) {
    throw new Response("User not found", { status: 404 });
  }

  return json({
    me: {
      uid: userData.uid,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      notifications: userData.notifications,
    },
    userAccounts,
  });
};

export default function Dashboard() {
  const { me: user, userAccounts: accounts } = useLoaderData<{
    me: MeUser;
    userAccounts: Account[];
  }>();

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <>
      <Spacer h={2} />

      <Text small>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
      <Text h2>Hi {user.first_name}</Text>

      <Spacer h={1} />

      <Card>
        <Text small>Next scheduled payment is in <Text b>3 days</Text></Text>
      </Card>

      <Spacer h={2} />

      {accounts.map((account) => (
        <React.Fragment key={account.acc}>
          <AccountCard
            accountType={account.short_description}
            bsb={account.bsb}
            accountNumber={account.acc.toString()}
            balance={`$${account.balance.toFixed(2)}`}
          />
          <Spacer h={1} />
        </React.Fragment>
      ))}

      <Spacer h={2} />

      <Card width="100%">
        <Grid.Container gap={2} justify="space-between" alignItems="center">
          <Grid>
            <Text h3>Total</Text>
          </Grid>
          <Grid>
            <Text h3>${totalBalance.toFixed(2)}</Text>
          </Grid>
        </Grid.Container>
      </Card>
    </>
  );
}