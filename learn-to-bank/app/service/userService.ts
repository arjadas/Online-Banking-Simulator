import { PrismaD1 } from '@prisma/adapter-d1';
import { getPrismaClient } from '~/service/db.server';
import { openAccount } from "./accountService";
import { createMockUserPrevContacts } from './userPrevContactService';
import { frequencyObjectToString, generateRandomFrequencyObject } from '@parent/learn-to-bank-util/utils/futureTransactionUtil';
import { addDays } from 'date-fns';

export async function createUser(context: any, uid: string, email: string, first_name: string, last_name: string) {

    const mockPrevContacts = await createMockUserPrevContacts(context, uid);

    try {
        const date = new Date();
        const db = getPrismaClient(context);
        const user = await db.user.create({
            data: {
                uid,
                email,
                first_name: first_name,
                last_name: last_name,
                role: 'student',
                font_preference: null,
                creation_timestamp: date,
                last_login: date,
            },
        });

        // Open "Simple Saver" account
        const simpleSaver = await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            pay_id: email,
            short_description: "Simple Saver",
            long_description: "A simulated savings account.",
            balance: 32560000,
            opened_timestamp: date,
        });

        // Open "Delightful Debit" account
        const delightfulDebit = await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Delightful Debit",
            long_description: "Associated with your emulated debit card.",
            balance: 125255,
            opened_timestamp: date,
        });

        // Open "Clever Credit" account
        const cleverCredit = await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Clever Credit",
            long_description: "Associated with your emulated credit card.",
            balance: -95620,
            opened_timestamp: date,
        });

        const accounts = [simpleSaver, delightfulDebit, cleverCredit];

        mockPrevContacts.forEach(async (mockPrevContact, index) =>  {
            await db.recurringTransaction.create({
                data: {
                    amount: Math.floor(Math.random() * 10000),
                    sender_acc: accounts[index % accounts.length].acc,
                    recipient_acc: mockPrevContact.contact_acc,
                    sender_uid: uid,
                    recipient_uid: mockPrevContact.uid,
                    recipient_address: mockPrevContact.contact_recipient_address,
                    reference: mockPrevContact.contact_description,
                    description: mockPrevContact.contact_description,
                    frequency: JSON.stringify(generateRandomFrequencyObject()),
                    starts_on: new Date().toISOString(),
                    ends_on: null,
                }
            });

            const futureDate = addDays(new Date(), Math.floor(Math.random() * 100)).toISOString();

            await db.recurringTransaction.create({
                data: {
                    amount: Math.floor(Math.random() * 10000),
                    sender_acc: accounts[(index + 1) % accounts.length].acc,
                    recipient_acc: mockPrevContact.contact_acc,
                    sender_uid: uid,
                    recipient_uid: mockPrevContact.uid,
                    recipient_address: mockPrevContact.contact_recipient_address,
                    reference: mockPrevContact.contact_description,
                    description: mockPrevContact.contact_description,
                    frequency: '{}',
                    starts_on: futureDate,
                    ends_on: futureDate,
                }
            });
        });

        return user;
    } catch (error: any) {
        throw new Error(`Failed to create user ${error.message}`);
    }
}