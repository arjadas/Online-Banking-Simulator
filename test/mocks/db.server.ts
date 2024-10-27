import { vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Create a mock transaction function
const mockTransaction = async (operations: any[]) => {
    
    const results = [];
    for (const operation of operations) {
        if (typeof operation === 'function') {
            results.push(await operation(mockPrismaClient));
        } else {
            results.push(await operation);
        }
    }
    return results;
};

// Create mock Prisma client
const mockPrismaClient = {
    account: {
        findUnique: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
    transaction: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    recurringTransaction: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    $transaction: mockTransaction,
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $executeRaw: vi.fn(),
    $executeRawUnsafe: vi.fn(),
    $queryRaw: vi.fn(),
    $queryRawUnsafe: vi.fn(),
    $use: vi.fn(),
    _activeProvider: 'sqlite',
    _dmmf: {
        datamodel: {
            models: []
        }
    },
    $on: vi.fn(),
} as unknown as PrismaClient;

const createMockContext = () => ({
    cloudflare: {
        env: {
            DB: {
                prepare: vi.fn().mockReturnValue({
                    bind: vi.fn(),
                    first: vi.fn(),
                    run: vi.fn(),
                    all: vi.fn(),
                }),
                exec: vi.fn(),
            },
            DATABASE_URL: 'mock-db-url',
        },
    },
});

export const getPrismaClient = vi.fn(() => mockPrismaClient);
export const mockDb = mockPrismaClient;
export { createMockContext };