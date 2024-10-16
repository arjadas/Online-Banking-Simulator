import { Prisma } from '@prisma/client';
import { getPrismaClient } from '~/service/db.server';

export async function createNotification(context: any, data: Prisma.NotificationCreateInput) {
    const db = getPrismaClient(context);

    return await db.notification.create({
        data: data,
    });
}