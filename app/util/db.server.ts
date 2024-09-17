import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'

let db: PrismaClient;

declare global {
    // eslint-disable-next-line no-var
    var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV == 'production') {
    // @ts-ignore
    db = new PrismaClient().$extends(withAccelerate())
    db.$connect();
} else {
    if (!global.__db) {
        global.__db = new PrismaClient();
        global.__db.$connect();
    }
    db = global.__db;
}

export { db };