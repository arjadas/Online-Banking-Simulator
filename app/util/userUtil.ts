import { FontPreference, UserRole } from "@prisma/client";
import { openAccount } from "./accountUtil";
import { db } from "./db.server";

export async function createUser(uid: string, email: string, first_name: string, last_name: string) {
    try {
        const date = new Date();
        const user = await db.user.create({
            data: {
                uid,
                email,
                first_name: first_name,
                last_name: last_name,
                role: UserRole.student,
                font_preference: FontPreference.medium,
                creation_timestamp: date,
                last_login: date,
            },
        });

        // Open "Simple Saver" account
        await openAccount({
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            pay_id: email,
            short_description: "Simple Saver",
            long_description: "A simulated savings account.",
            balance: 100000,
            opened_timestamp: date,
        });

        // Open "Delightful Debit" account
        await openAccount({
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Delightful Debit",
            long_description: "Associated with your emulated debit card.",
            balance: 100000,
            opened_timestamp: date,
        });

        // Open "Clever Credit" account
        await openAccount({
            acc_name: `${first_name} ${last_name}`,
            uid: uid,
            short_description: "Clever Credit",
            long_description: "Associated with your emulated credit card.",
            balance: 100000,
            opened_timestamp: date,
        });

        return user;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create user");
    }
}