// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Account, Transaction as AccountTransaction, Notification } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/auth.server";
import { db } from "~/util/db.server";

type MeUser = {
  uid: string;
  first_name: string;
  surname: string;
  email: string;
  notifications: Array<{
    notification_id: string;
    content: string;
    timestamp: Date;
  }>;
};

export const loader: LoaderFunction = async ({ request } : { request: Request } ) => {
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
    }),/*
    db.transaction.findMany({
      where: { sender_acc: user.uid, recipient_acc: user.uid },
      take: 10,
    }),*/
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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.first_name} {user.surname}!</p>
      <p>Email: {user.email}</p>
      
      <h2>Your Accounts</h2>
      <ul>
        {accounts.map((account: Account) => (
          <li key={account.acc}>
            {account.acc_name}: {account.short_description}
          </li>
        ))}
      </ul>

      <h2>Recent Transactions</h2>{/*
      <ul>
        {recentTransactions.map((transaction) => (
          <li key={transaction.transaction_id}>
            {transaction.amount} - {transaction.reference} ({new Date(transaction.timestamp).toLocaleDateString()})
          </li>
        ))}
      </ul>*/}

      <h2>Unread Notifications</h2>
      <ul>
        {user.notifications.map((notification: Notification) => (
          <li key={notification.notification_id}>
            {notification.content} ({new Date(notification.timestamp).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
