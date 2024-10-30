/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { Env } from '.';

let prisma: any = null;

export function getPrismaClient(env: Env): PrismaClient {
	if (!prisma) {
		const adapter = new PrismaD1(env.DB)
		prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'], })
	}

	return prisma;
}