import { Card, Grid, Spacer, Text } from '@geist-ui/core';
import { Account } from '@prisma/client';
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import React from 'react';
import { getPrismaClient } from '~/util/db.server';
import { createUser } from '~/util/userUtil';
import AccountCard from '../components/AccountCard';
import ResizableText from '../components/ResizableText';
import { requireUserSession } from '~/auth.server';

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
  try {
    const user = await requireUserSession(request);
    const db = getPrismaClient(context);

    if (!user) {
      throw new Response("Unauthsdorized", { status: 401 });
    } else {
      console.log("User found!", user);
    }

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
    console.log("Prisma query successful");

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
  } catch (error) {
    console.error(error);
    return json({ error: 'Failed to fetch users' }, { status: 500 });
  }
};

export default function Dashboard() {
  const loaderData = useLoaderData<{
    me: MeUser;
    userAccounts: Account[];
  } | null>();

  if (loaderData) {
    const { me: user, userAccounts: accounts } = loaderData;

    const totalBalance = accounts.reduce((sum: any, account: { balance: any; }) => sum + account.balance, 0);

    return (
      <>
        <Card padding={1}>
          <ResizableText style={{ color: 'black' }} small>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</ResizableText>
          <ResizableText style={{ color: 'black' }} h2>Hi {user.first_name}</ResizableText>
          <ResizableText small>Next scheduled payment is in <ResizableText b>3 days</ResizableText></ResizableText>
        </Card>

        <Spacer h={2} />

        {accounts.map((account: { acc: React.Key; short_description: string; bsb: { toString: () => string; }; balance: number; }) => (
          <React.Fragment key={account.acc}>
            <AccountCard
              accountType={account.short_description}
              bsb={account.bsb.toString()}
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
              <ResizableText h3>Total</ResizableText >
            </Grid>
            <Grid>
              <ResizableText h3>${totalBalance.toFixed(2)}</ResizableText>
            </Grid>
          </Grid.Container>
        </Card>
      </>
    );
  }
}