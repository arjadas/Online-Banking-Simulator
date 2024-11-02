import { Prisma } from '@prisma/client';
import { getPrismaClient } from '~/service/db.server';
import { toFixedWithCommas } from '@parent/learn-to-bank-util/utils/util';

export async function createNotification(context: any, data: Prisma.NotificationCreateInput) {
    const db = getPrismaClient(context);

    return await db.notification.create({
        data: data,
    });
}

export async function makeSendReceiveNotifications(context: any, toAccount: any, fromAccount: any, amount: number) {
    const now = new Date();

    try {
        // Create a notification for the recipient
        await createNotification(context, {
            notification_id: now.toUTCString() + toAccount.uid,
            timestamp: now,
            type: 'new-receipt',
            content: `Received $${toFixedWithCommas(amount / 100, 2)} from ${fromAccount.acc_name}`,
            read: false,
            user: {
                connect: {
                    uid: toAccount.uid,
                }
            },
        })
    } catch (e) {
        // mock user
    }

    // Create a notification for the logged-in user
    await createNotification(context, {
        notification_id: now.toUTCString() + fromAccount.uid + "1", // just in case they are the same account
        timestamp: now,
        type: 'transfer-success',
        content: `Successfully transferred $${toFixedWithCommas(amount / 100, 2)} to ${toAccount.acc_name}`,
        read: false,
        user: {
            connect: {
                uid: fromAccount.uid,
            }
        },
    })
} 