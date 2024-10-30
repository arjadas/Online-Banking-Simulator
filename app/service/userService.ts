import { PrismaD1 } from '@prisma/adapter-d1';
import { getPrismaClient } from '~/service/db.server';
import { openAccount } from "./accountService";
import { createMockUserPrevContacts } from './userPrevContactService';

export async function createUser(context: any, uid: string, email: string, first_name: string, last_name: string) {
    
    await createMockUserPrevContacts(context, uid);

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
        await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            pay_id: email,
            short_description: "Simple Saver",
            long_description: "A simulated savings account.",
            balance: 32560000,
            opened_timestamp: date,
        });

        // Open "Delightful Debit" account
        await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Delightful Debit",
            long_description: "Associated with your emulated debit card.",
            balance: 125255,
            opened_timestamp: date,
        });

        // Open "Clever Credit" account
        await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Clever Credit",
            long_description: "Associated with your emulated credit card.",
            balance: -95620,
            opened_timestamp: date,
        });

        return user;
    } catch (error: any) {
        throw new Error(`Failed to create user ${error.message}`);
    }
}