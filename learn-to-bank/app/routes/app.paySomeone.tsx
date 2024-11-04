import { Account, UserPrevContact } from '@prisma/client';
import { ActionFunction, json, LoaderFunction } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blankRecipientAddress, setRecipientAddress, setTransactionFlow } from '../appSlice';
import { getUserSession } from '../auth.server';
import PaySomeoneForm from '../components/PaySomeoneForm';
import UserPrevContactForm from '../components/UserPrevContactForm';
import { getPrismaClient } from "../service/db.server";
import { TransactionService } from '../service/transactionsService';
import { RootState } from '../store';

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
  try {
    const formData = await request.formData();
    const user = await getUserSession(context, request);

    if (!user) {
      return json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const transactionService = new TransactionService(getPrismaClient(context));

    const result = await transactionService.createTransaction({
      type: 'external',
      fromAcc: parseInt(formData.get('fromAcc') as string),
      recipientAddress: formData.get('recipientAddress') as string,
      amount: parseInt((formData.get('amount') as string).replace('.', '')),
      reference: formData.get('reference') as string,
      description: formData.get('description') as string,
      temporalTab: formData.get('temporalTab') as 'now' | 'later' | 'recurring',
      laterDate: formData.get('laterDate') as string,
      frequency: formData.get('frequencyObject') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      userId: user.uid
    }, context);

    return json({ success: true, ...result });
  } catch (error) {
    return json({ success: false, error: (error as Error).message }, { status: 400 });
  }
};
export default function PaySomeone() {
  const actionData: any = useActionData();
  const dispatch = useDispatch();
  const { userAccounts, userPrevContacts, userPrevContactsWithInfo, error } = useLoaderData<{
    userAccounts: Account[];
    userPrevContacts: UserPrevContact[];
    userPrevContactsWithInfo: UserPrevContactResult[];
    error?: string
  }>();

  const { transactionFlow } = useSelector((state: RootState) => state.app);
  const [prevContact, setPrevContact] = useState<UserPrevContactResult | undefined | null>(undefined);

  const handleSubmit = (selectedContact: any) => {
    setPrevContact(selectedContact)
  };

  useEffect(() => {
    const tf = { ...transactionFlow, successful: actionData && actionData.success, enabled: true };

    if (prevContact !== undefined) {
      tf.userPrevContact = prevContact;
    } else {
      tf.recipientAddress = blankRecipientAddress;
    }

    if (JSON.stringify(tf) !== JSON.stringify(transactionFlow)) {
      dispatch(setTransactionFlow(tf));
    }

  }, [actionData, dispatch, prevContact, transactionFlow]);

  if (typeof prevContact === 'undefined' && userPrevContacts && (!actionData || !actionData.success)) {
    return <UserPrevContactForm contacts={userPrevContactsWithInfo} onSubmit={handleSubmit} />
  }

  return <PaySomeoneForm accounts={userAccounts as any} onBack={() => setPrevContact(undefined)} actionData={actionData} />
}
