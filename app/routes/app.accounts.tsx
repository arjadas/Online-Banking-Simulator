import { Card, Grid, Spacer, Text } from '@geist-ui/core';
import { Account } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import React from 'react';
import { getUserSession } from '~/auth.server';
import { createUser } from '~/service/userService';
import AccountCard from '../components/AccountCard';
import { getPrismaClient } from "../service/db.server";
import ResizableText from '~/components/ResizableText';

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

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  // Ensure the user is authenticated
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  if (!user) return json({ error: 'Unauthenticated' }, { status: 401 });

  // Fetch the user details and related data from Prisma
  // eslint-disable-next-line prefer-const
  const getMeUser = async () => {
    return await Promise.all([
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
  }

  let [userData, userAccounts] = await getMeUser();

  if (!userData) {
    console.error("User, not found! Creating new user..", user)
    await createUser(context, user.uid, user.email, "Plan", "B");
    [userData, userAccounts] = await getMeUser();
  }

  userData = userData!

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

  const totalBalance = accounts.reduce((sum: any, account: { balance: any; }) => sum + account.balance, 0);

  return (
    <>
      <Spacer h={2} />
      <Card padding={1} >
        <ResizableText small>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</ResizableText>
        <ResizableText h2>Hi {user.first_name}</ResizableText>
        <ResizableText small>Next scheduled payment is in <ResizableText b>3 days</ResizableText></ResizableText>
      </Card>

      <Spacer h={2} />

      {accounts.map((account: { acc: React.Key; short_description: string; bsb: { toString: () => string; }; balance: number; }) => (
        <React.Fragment key={account.acc}>
          <AccountCard
            accountType={account.short_description}
            bsb={account.bsb.toString()}
            accountNumber={account.acc.toString()}
            balance={`$${(account.balance / 100).toFixed(2)}`}
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
            <Text h3>${(totalBalance / 100).toFixed(2)}</Text>
          </Grid>
        </Grid.Container>
      </Card>
    </>
  );
}