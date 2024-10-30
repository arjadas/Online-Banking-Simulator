import { PrismaD1 } from '@prisma/adapter-d1';
import { Prisma } from '@prisma/client';
import { create } from 'ts-node';
import { getPrismaClient } from '~/service/db.server';
import { createMockUserPrevContacts } from './userPrevContactService';

// Generate a random 9-digit number
function generateRandomAcc() {
    return Math.floor(100000000 + Math.random() * 900000000);
}

export async function getRecurringTransactions(context: any, uid: string) {
    const db = getPrismaClient(context);

    return await db.recurringTransaction.findMany({
        where: { sender_uid: uid },
        include: {
            recipient: {
                select: {
                    acc: true,
                    acc_name: true,
                    short_description: true
                }
            },
            sender: {
                select: {
                    acc: true,
                    acc_name: true,
                    short_description: true
                }
            }
        }
    });
}