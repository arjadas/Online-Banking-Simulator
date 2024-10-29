import { Account, UserPrevContact } from '@prisma/client';
import { ActionFunction, json, LoaderFunction } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from 'react';
import { getUserSession } from '~/auth.server';
import PaySomeoneForm from '~/components/PaySomeoneForm';
import UserPrevContactForm from '~/components/UserPrevContactForm';
import { createNotification, makeSendReceiveNotifications as makeSendReceiveNotifications } from '~/service/notificationService';
import { createUserPrevContact } from '~/service/userPrevContactService';
import { toFixedWithCommas } from '~/util';
import { getPrismaClient } from "../service/db.server";

export type UserPrevContactResult = {
  user_prev_contact_id: number;
  contact_acc: number;
  contact_acc_name: string;
  contact_uid: string;
  contact_recipient_address: string;
  contact_description: string | null;
  contact_user: {
    first_name: string;
    last_name: string;
    uid: string;
  } | null;
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  if (!user) return json({ error: 'Unauthenticated' }, { status: 401 });

  const [userAccounts, userPrevContacts] = await Promise.all([
    db.account.findMany({
      where: { uid: user!.uid },
    }),
    db.userPrevContact.findMany({
      where: { uid: user!.uid },
      select: {
        user_prev_contact_id: true,
        contact_acc: true,
        contact_acc_name: true,
        contact_description: true,
        contact_recipient_address: true,
      },
    }),
  ]);

  // Create a Map to store unique contacts based on contact_acc
  const uniqueContactsMap = new Map();
  const userPrevContactsWithInfo: UserPrevContactResult[] = [];

  for (const contact of userPrevContacts) {

    // Skip if we've already processed this contact_acc
    if (uniqueContactsMap.has(contact.contact_acc)) {
      continue;
    }

    if (!contact.contact_acc) {
      throw new Error("Contact acc not supplied.");
    }

    const contactAccount = await db.account.findUnique({
      where: { acc: contact.contact_acc },
    });

    if (!contactAccount) {
      throw new Error("Contact account not found.");
    }

    const contactUid = contactAccount.uid;
    const contactUser = await db.user.findUnique({
      where: { uid: contactUid },
      select: { first_name: true, last_name: true, uid: true },
    });

    const contactMockUser = await db.mockUser.findUnique({
      where: { uid: contactUid },
      select: { first_name: true, last_name: true, uid: true },
    });

    if (!contactUser && !contactMockUser) {
      throw new Error("Contact user not found.");
    }

    const contactInfo = {
      ...contact,
      contact_uid: contactUid,
      contact_user: contactUser ?? ((contactMockUser != null ? {
        first_name: contactMockUser.first_name ?? '',
        last_name: contactMockUser.last_name ?? '',
        uid: contactAccount.uid,
      } : null))!,
    };

    // Add to map and array only if it's a new unique contact
    uniqueContactsMap.set(contact.contact_acc, true);
    userPrevContactsWithInfo.push(contactInfo);
  }

  return json({
    userAccounts,
    userPrevContacts,
    userPrevContactsWithInfo,
  });
};

export const action: ActionFunction = async ({ context, request }: { context: any, request: Request }) => {
  const formData = await request.formData();
  const fromAcc = parseInt(formData.get('fromAcc') as string);
  const recipientAddress = formData.get('recipientAddress') as string;
  // Deleting the decimal point converts to cents: $99.99 -> 9999 cents
  const amount = parseInt((formData.get('amount') as string).replace('.', ''));
  const reference = formData.get('reference') as string;
  const description = formData.get('description') as string;
  const laterDateTime = formData.get('laterDateTime') as string;
  const frequency = formData.get('frequency') as string;
  const activeTab = formData.get('activeTab') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;

  let recipient;
  try {
    recipient = JSON.parse(recipientAddress);
  } catch (error) {
    return json({ success: false, error: 'Json parsing error!' }, { status: 400 });
  }

  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);
  const nowDate = new Date().getMilliseconds();

  if (!user) return json({ error: 'Unauthenticated' }, { status: 401 });

  try {
    if (activeTab == 'later' && !laterDateTime) {
      throw new Error('Must specify a date and time when transferring setting a future payment.');
    }

    if (activeTab == 'recurring') {
      if (!frequency) {
        throw new Error('Must specify a frequency when setting a recurring payment.');
      }

      if (!startDate) {
        throw new Error('Must specify a start date when setting a recurring payment.');
      }

      if (Date.parse(startDate) < nowDate) {
        throw new Error('The date this payment will start occurring must not be in the past.');
      }

      if (endDate && Date.parse(endDate) <= nowDate) {
        throw new Error('The date this payment will stop occurring must be in the future.');
      }
    }

    if (!fromAcc) {
      throw new Error('Must indicate the account to transfer from.');
    }

    const fromAccount = await db.account.findFirst({
      where: { acc: fromAcc },
    });

    if (!fromAccount) {
      throw new Error('Sender account not found.');
    }

    const toAccount = await db.account.findFirst({
      where: {
        OR: [
          { acc_name: recipient.accountName, acc: recipient.acc, bsb: recipient.bsb },
          { biller_code: recipient.billerCode, crn: recipient.crn, },
          { pay_id: recipient.payId, }
        ],
      },
    });

    if (!toAccount) {
      throw new Error('Recipient account not found.');
    }

    if (fromAcc == toAccount.acc) {
      throw new Error('Cannot transfer to the same account.');
    }

    if (!amount) {
      throw new Error('Amount must be specified.');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds.');
    }

    // Right now, Cloudflare D1 aims for speed and eventual consistency rather than ACID-compliance, 
    // so it doesn't support transactions now, but when it does, this code will support it.
    let result;

    if (activeTab == 'now') {
      result = await db.$transaction([
        db.account.update({
          where: { acc: fromAccount.acc },
          data: { balance: { decrement: amount } },
        }),
        db.account.update({
          where: { acc: toAccount.acc },
          data: { balance: { increment: amount } },
        }),
        db.transaction.create({
          data: {
            amount,
            sender_uid: user!.uid,
            recipient_uid: toAccount.uid,
            reference: reference,
            description,
            timestamp: new Date(),
            settled: true,
            type: 'pay-someone',
            recipient_address: recipientAddress,
            sender: { connect: { acc: fromAccount.acc } },
            recipient: { connect: { acc: toAccount.acc } },
          },
        }),
      ]);
    } else if (activeTab == 'later') {
      // instead of setting up another table we'll use the RecurringTransaction table for all 'future' payments
      result = await db.recurringTransaction.create({
        data: {
          amount: amount,
          sender_acc: fromAccount.acc,
          recipient_acc: toAccount.acc,
          sender_uid: user!.uid,
          recipient_uid: toAccount.uid,
          recipient_address: recipientAddress,
          reference: reference,
          description: description,
          frequency: '{}',
          starts_on: laterDateTime,
          ends_on: laterDateTime,
        }
      });
    } else if (activeTab == 'recurring') {
      result = await db.recurringTransaction.create({
        data: {
          amount: amount,
          sender_acc: fromAccount.acc,
          recipient_acc: toAccount.acc,
          sender_uid: user!.uid,
          recipient_uid: toAccount.uid,
          recipient_address: recipientAddress,
          reference: reference,
          description: description,
          frequency: frequency,
          starts_on: startDate,
          ends_on: endDate ? endDate : null,
        }
      });
    }

    const existingContact = await db.userPrevContact.findFirst({
      where: {
        uid: fromAccount.uid,
        contact_acc: toAccount.acc
      }
    });

    // Only create a new contact if one doesn't already exist
    if (!existingContact) {
      await createUserPrevContact(context, {
        uid: fromAccount.uid,
        contact_acc: toAccount.acc,
        contact_acc_name: toAccount.acc_name,
        contact_description: reference,  // Use reference as description for now
        contact_recipient_address: recipientAddress,
      });
    }

    if (activeTab == 'now') {
      makeSendReceiveNotifications(context, toAccount, fromAccount, amount);
    }

    return json({ success: true, ...result });
  } catch (error) {
    return json({ success: false, error: (error as Error).message }, { status: 400 });
  }
};

export default function PaySomeone() {
  const actionData: any = useActionData();
  const { userAccounts, userPrevContacts, userPrevContactsWithInfo, error } = useLoaderData<{
    userAccounts: Account[];
    userPrevContacts: UserPrevContact[];
    userPrevContactsWithInfo: UserPrevContactResult[];
    error?: string
  }>();

  const [prevContact, setPrevContact] = useState<UserPrevContactResult | undefined | null>(undefined);

  const handleSubmit = (selectedContact: any) => {
    setPrevContact(selectedContact)
  };

  if (typeof prevContact === 'undefined' && userPrevContacts) {
    return <UserPrevContactForm contacts={userPrevContactsWithInfo} onSubmit={handleSubmit} />
  }

  return <PaySomeoneForm accounts={userAccounts as any} userPrevContact={prevContact} onBack={() => setPrevContact(undefined)} actionData={actionData} />
}
