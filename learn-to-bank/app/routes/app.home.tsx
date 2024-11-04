/* eslint-disable import/no-unresolved */
import { Button, Card, Grid, Modal, Spacer } from '@geist-ui/core';
import { getNextPaymentDate } from '@parent/learn-to-bank-util/utils/futureTransactionUtil';
import { formatDate, getRelativeDateInfo, toFixedWithCommas } from '@parent/learn-to-bank-util/utils/util';
import { Account } from '@prisma/client';
import { json, LoaderFunction, redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetTransactionFlow, setTextScale } from '../appSlice';
import { getUserSession } from '../auth.server';
import { AccountCard } from '../components/AccountCard';
import ResizableText from '../components/ResizableText';
import { RecurringTransactionWithRecipient } from '../routes/app.upcoming';
import { getPrismaClient } from "../service/db.server";
import { getRecurringTransactions } from '../service/recurringTransactionService';
import { createUser } from '../service/userService';

type MeUser = {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  font_preference?: string;
  notifications: Array<{
    notification_id: string;
    content: string;
    timestamp: Date;
  }>;
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {

  try {
    // Ensure the user is authenticated
    const user = await getUserSession(context, request);
    const db = getPrismaClient(context);

    // if (!user) return json({ error: 'Unauthenticated' }, { status: 401 });
    if (!user) return redirect("/login");  // Direct redirect

    // Fetch the user details and related data from Prisma
    const getMeUser = async () => {
      return await Promise.all([
        db.user.findUnique({
          where: { uid: user.uid },
          include: {
            notifications: {
              where: { read: false },
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
    const recurringTransactions = await getRecurringTransactions(context, user!.uid);

    return json({
      me: {
        uid: userData.uid,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        notifications: userData.notifications,
        font_preference: userData.font_preference,
      },
      recurringTransactions,
      userAccounts,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "SessionExpiredError") {
      throw json(
        { message: "Your session has expired. Please login again." },
        { status: 440 }
      );
    }
    throw error;
  }
};

export default function Dashboard() {
  const { me: user, userAccounts: accounts, recurringTransactions, error } = useLoaderData<{
    me: MeUser;
    userAccounts: Account[];
    recurringTransactions: RecurringTransactionWithRecipient[];
    error?: string
  }>();

  const [viewingNotifications, setViewingNotifications] = React.useState(false);
  const [localNotifications, setLocalNotifications] = React.useState(user.notifications);
  const fetcher = useFetcher();
  const dispatch = useDispatch();
  const nextPaymentDate = getNextPaymentDate(recurringTransactions as any as RecurringTransactionWithRecipient[]);

  const handleModalClose = () => {
    setViewingNotifications(false);
    if (localNotifications.length > 0) {
      fetcher.submit(
        { action: "markAsRead" },
        { method: "post", action: "/api/notifications" }
      );
      setTimeout(() => setLocalNotifications([]), 500);
    }
  };

  useEffect(() => {
    if (user.font_preference) {
      dispatch(setTextScale(Number(user.font_preference)));
    }
    dispatch(resetTransactionFlow())
  });

  console.error(error)
  const totalBalance = accounts.reduce((sum: any, account: { balance: any; }) => sum + account.balance, 0);

  return (
    <>
      <Spacer h={2} />
      <Card padding={1} >
        <ResizableText small>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</ResizableText>
        <ResizableText h1>Hi {user.first_name}</ResizableText>
        {nextPaymentDate && <ResizableText small>Next scheduled payment is <ResizableText b>{getRelativeDateInfo(nextPaymentDate).toLowerCase()}</ResizableText></ResizableText>}.
        <Spacer h={0.5} />
        <ResizableText small  >You have <ResizableText b>{localNotifications.length} unread notification
          {localNotifications.length == 1 ? "" : "s"}.<br /></ResizableText></ResizableText>
        {(localNotifications.length > 0) && <Button style={{ marginTop: 10 }} onClick={() => setViewingNotifications(true)} auto scale={6 / 5} type="secondary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>View</Button>}
      </Card>

      <Spacer h={2} />

      {accounts.map((account: any) => (
        <React.Fragment key={account.acc}>
          <AccountCard
            accountType={account.short_description}
            bsb={account.bsb}
            accountNumber={account.acc}
            balance={`$${toFixedWithCommas(account.balance / 100, 2)}`}
            payID={account.pay_id}
          />
          <Spacer h={1} />
        </React.Fragment>
      ))}

      <Spacer h={2} />

      <Card width="100%">
        <Grid.Container gap={2} justify="space-between" alignItems="center">
          <Grid>
            <ResizableText h2>Total</ResizableText>
          </Grid>
          <Grid>
            <ResizableText h2>${toFixedWithCommas(totalBalance / 100, 2)}</ResizableText>
          </Grid>
        </Grid.Container>
      </Card>

      <Modal visible={viewingNotifications} onClose={handleModalClose}>
        <Modal.Title>Notifications</Modal.Title>
        <Modal.Content>
          {localNotifications.map((notification, index) => (
            <React.Fragment key={notification.notification_id}>
              <Card shadow>
                <ResizableText b>{notification.content}<br /></ResizableText>
                <ResizableText small>{formatDate(new Date(notification.timestamp))}</ResizableText>
              </Card>
              {index < localNotifications.length - 1 && <Spacer h={1} />}
            </React.Fragment>
          ))}
        </Modal.Content>
        <Modal.Action passive onClick={handleModalClose} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Close</Modal.Action>
      </Modal>
    </>
  );
}