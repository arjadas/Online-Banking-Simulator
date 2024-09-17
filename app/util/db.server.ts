import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'

let db: any = null;

export function getPrismaClient(context: any): PrismaClient {
    const db_url = context.cloudflare.env.VITE_DATABASE_URL;

    if (!db) {
        if (db_url) {
            db = new PrismaClient({
                datasources: {
                    db: {
                        url: db_url,
                    },
                },
            }).$extends(withAccelerate());
        } else {
            db = new PrismaClient().$extends(withAccelerate());
        }
    }

    db.$connect();

    return db!;
}