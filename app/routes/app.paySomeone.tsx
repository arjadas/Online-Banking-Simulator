import { Card, Select, Tabs } from '@geist-ui/core';
import { Button, Input, Page, Text, Textarea } from '@geist-ui/react';
import { Account, UserPrevContact } from '@prisma/client';
import { ActionFunction, LoaderFunction, json } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import CurrencyInput from '~/components/CurrencyInput';
import { getPrismaClient } from '~/service/db.server';
import { getUserSession } from '../auth.server';
import "../styles/app.paySomeone.css";
import PaySomeoneForm from '~/components/PaySomeoneForm';
import UserPrevContactForm from '~/components/UserPrevContactForm';

export type UserPrevContactResult = {
    user_prev_contact_id: number;
    contact_acc: string;
    contact_acc_name: string;
    contact_uid: string;
    contact_recipient_address: string;
    contact_description: string | null;
    contact_user: {
        first_name: string;
        last_name: string;
        uid: string;
    } | null;
    contact_mock_user: {
        first_name: string;
        last_name: string;
        uid: string;
    } | null;
};
export const action: ActionFunction = async ({ context, request }: { context: any, request: Request }) => {
    const formData = await request.formData();
    const fromAcc = parseInt(formData.get('fromAcc') as string);
    const recipientAddress = formData.get('recipientAddress') as string;
    const amount = parseInt(formData.get('amount') as string);
    const reference = formData.get('reference') as string;
    const description = formData.get('description') as string;

    let recipient;
    try {
        recipient = JSON.parse(recipientAddress);
    } catch (error) {
        return json({ success: false, error: 'Json parsing error!' }, { status: 400 });
    }

    const user = await getUserSession(context, request);
    const db = getPrismaClient(context);

    try {
        //TODO
        if (!fromAcc) {
            throw new Error('Must indicate the account to transfer from!');
        }

        const fromAccount = await db.account.findFirst({
            where: { acc: fromAcc },
        });

        if (!fromAccount) {
            throw new Error('Sender account not found');
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
            throw new Error('Recipient account not found');
        }

        if (fromAcc == toAccount.acc) {
            throw new Error('Cannot transfer to the same account');
        }

        if (fromAccount.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Right now, Cloudflare D1 aims for speed and eventual consistency rather than ACID-compliance, 
        // so it doesn't support transactions now, but when it does, this code will support it.
        const result = await db.$transaction([
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

        return json({ success: true, ...result });
    } catch (error) {
        console.error('Transfer error:', error);
        return json({ success: false, error: (error as Error).message }, { status: 400 });
    }
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
    const user = await getUserSession(context, request);
    const db = getPrismaClient(context);

    const [userAccounts] = await Promise.all([
        db.account.findMany({
            where: { uid: user!.uid },
        }),
    ]);

    const [userPrevContacts] = await Promise.all([
        db.userPrevContact.findMany({
            where: { uid: user!.uid },
            select: {
                user_prev_contact_id: true,
                contact_acc: true,
                contact_acc_name: true,
                contact_uid: true,
                contact_description: true,
                contact_user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        uid: true,
                    }
                },
                contact_mock_user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        uid: true,
                    }
                },
            },
        }),
    ]);

    if (!userAccounts) {
        throw new Response("No Accounts Found! This is a catastrophic error since accounts should have been created on sign-up :/", { status: 404 });
    }

    return json({
        userAccounts, userPrevContacts
    });
};

const PaySomeone = () => {
    const { userAccounts, userPrevContacts } = useLoaderData<{ userAccounts: Account[], userPrevContacts: UserPrevContactResult[] }>();
    const [prevContact, setPrevContact] = useState<UserPrevContactResult | undefined | null>(undefined);

    const handleSubmit = (selectedContact: any) => {
        setPrevContact(selectedContact)
    };

    if (typeof prevContact === 'undefined') {
        return <UserPrevContactForm contacts={userPrevContacts} onSubmit={handleSubmit} />
    }

    return <PaySomeoneForm accounts={userAccounts as any} userPrevContact={prevContact} onBack={() => setPrevContact(undefined)} />
};

export default PaySomeone;