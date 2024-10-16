import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

let prisma: any = null;

export interface Env {
    DB: D1Database
}

export function getPrismaClient(context: any): PrismaClient {
    if (!prisma) {
        const adapter = new PrismaD1(context.cloudflare.env.DB)
        prisma = new PrismaClient({ adapter })
    }

    return prisma!;
}