import { PrismaD1 } from '@prisma/adapter-d1';
import { openAccount } from "./accountUtil";
import { getPrismaClient } from '~/util/db.server';

export async function createUser(context: any, uid: string, email: string, first_name: string, last_name: string) {
    try {
        const date = new Date();
        const adapter = new PrismaD1(context.cloudflare.env.DB);
        const db = getPrismaClient(context);
        const MONTHSTOEXPIRE = 13;
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
            balance: 100000,
            opened_timestamp: date,
        });

        // Open "Delightful Debit" account
        await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Delightful Debit",
            long_description: "Associated with your emulated debit card.",
            balance: 100000,
            opened_timestamp: date,
        });

        // Open "Clever Credit" account
        await openAccount(context, {
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Clever Credit",
            long_description: "Associated with your emulated credit card.",
            balance: 100000,
            opened_timestamp: date,
        });

        return user;
    } catch (error: any) {
        throw new Error(`Failed to create user ${error.message}`);
    }
}