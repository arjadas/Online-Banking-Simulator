import { PrismaD1 } from '@prisma/adapter-d1';
import { Prisma } from '@prisma/client';
import { create } from 'ts-node';
import { getPrismaClient } from '~/service/db.server';
import { createMockUserPrevContacts } from './userPrevContactService';

// Generate a random 9-digit number
function generateRandomAcc() {
    return Math.floor(100000000 + Math.random() * 900000000);
}

export async function openAccount(context: any, data: Prisma.AccountCreateInput) {
    let acc: number = 0;
    const adapter = new PrismaD1(context.cloudflare.env.DB);
    const db = getPrismaClient(context);
    let isUnique = false;

    while (!isUnique) {
        acc = generateRandomAcc();
        const existingAccount = await db.account.findUnique({
            where: { acc },
        });
        if (!existingAccount) {
            isUnique = true;
        }
    }

    return await db.account.create({
        data: {
            ...data,
            acc,
        },
    });
}