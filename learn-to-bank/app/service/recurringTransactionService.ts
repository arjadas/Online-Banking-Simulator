import { Prisma } from '@prisma/client';
import { getPrismaClient } from '~/service/db.server';

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