const { createExecutionContext } = await import('cloudflare:test');
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from '../app/routes/app.transfer';

describe('Transfer Action', () => {
    let mockDb: any;
    let mockContext: any;
    let mockRequest: Request;
    let mockUserSession: any;

    beforeEach(() => {
        // Reset mocks before each test
        mockDb = {
            account: {
                findUnique: vi.fn(),
                update: vi.fn(),
            },
            transaction: {
                create: vi.fn(),
            },
            $transaction: async (operations: any[]) => {
                for (const operation of operations) {
                    await operation;
                }
                return operations;
            },
        };

        mockContext = {
            env: {},
            executionContext: createExecutionContext(),
        };

        // Mock getUserSession
        mockUserSession = {
            uid: 'test-user-id',
        };

        vi.mock('~/service/db.server', () => ({
            getPrismaClient: () => mockDb,
        }));

        vi.mock('../auth.server', () => ({
            getUserSession: () => mockUserSession,
        }));
    });

    const createActionArgs = (request: Request): any => ({
        context: mockContext,
        request,
        params: {},
    });

    it('should successfully transfer money between accounts', async () => {
        // Setup test data
        const fromAccount = {
            acc: 123,
            balance: 10000, // $100.00
            short_description: 'Checking',
        };
        const toAccount = {
            acc: 456,
            balance: 5000, // $50.00
            short_description: 'Savings',
        };
        const transferAmount = '50.00'; // $50.00

        // Mock DB responses
        mockDb.account.findUnique
            .mockResolvedValueOnce(fromAccount)
            .mockResolvedValueOnce(toAccount);

        mockDb.account.update
            .mockResolvedValueOnce({ ...fromAccount, balance: 5000 })
            .mockResolvedValueOnce({ ...toAccount, balance: 10000 });

        mockDb.transaction.create.mockResolvedValueOnce({
            id: 'test-transaction',
            amount: 5000,
        });

        // Create form data
        const formData = new FormData();
        formData.append('fromAcc', '123');
        formData.append('toAcc', '456');
        formData.append('amount', transferAmount);
        formData.append('description', 'Test transfer');

        mockRequest = new Request('http://localhost', {
            method: 'POST',
            body: formData,
        });

        // Execute action with proper ActionFunctionArgs
        const result = await action(createActionArgs(mockRequest)) as Response;
        const responseData = await result.json() as any;

        // Verify success
        expect(responseData.success).toBe(true);

        // Verify DB calls
        expect(mockDb.account.findUnique).toHaveBeenCalledTimes(2);
        expect(mockDb.account.update).toHaveBeenCalledTimes(2);
        expect(mockDb.transaction.create).toHaveBeenCalledTimes(1);

        // Verify transaction details
        const createTransactionCall = mockDb.transaction.create.mock.calls[0][0];
        expect(createTransactionCall.data.amount).toBe(5000);
        expect(createTransactionCall.data.sender_acc).toBe(123);
        expect(createTransactionCall.data.recipient_acc).toBe(456);
    });

    it('should fail when transferring to the same account', async () => {
        const account = {
            acc: 123,
            balance: 10000,
            short_description: 'Checking',
        };

        mockDb.account.findUnique.mockResolvedValue(account);

        const formData = new FormData();
        formData.append('fromAcc', '123');
        formData.append('toAcc', '123');
        formData.append('amount', '50.00');
        formData.append('description', 'Test transfer');

        mockRequest = new Request('http://localhost', {
            method: 'POST',
            body: formData,
        });

        const result = await action(createActionArgs(mockRequest)) as Response;
        const responseData = await result.json() as any;

        expect(responseData.success).toBe(false);
        expect(responseData.error).toBe('Cannot transfer into the same account.');
    });

    it('should fail when there are insufficient funds', async () => {
        const fromAccount = {
            acc: 123,
            balance: 2000, // $20.00
            short_description: 'Checking',
        };
        const toAccount = {
            acc: 456,
            balance: 5000,
            short_description: 'Savings',
        };

        mockDb.account.findUnique
            .mockResolvedValueOnce(fromAccount)
            .mockResolvedValueOnce(toAccount);

        const formData = new FormData();
        formData.append('fromAcc', '123');
        formData.append('toAcc', '456');
        formData.append('amount', '50.00'); // Trying to transfer $50.00
        formData.append('description', 'Test transfer');

        mockRequest = new Request('http://localhost', {
            method: 'POST',
            body: formData,
        });

        const result = await action(createActionArgs(mockRequest)) as Response;
        const responseData = await result.json() as any;

        expect(responseData.success).toBe(false);
        expect(responseData.error).toBe('Insufficient funds');
    });

    it('should fail when account is not found', async () => {
        mockDb.account.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);

        const formData = new FormData();
        formData.append('fromAcc', '123');
        formData.append('toAcc', '456');
        formData.append('amount', '50.00');
        formData.append('description', 'Test transfer');

        mockRequest = new Request('http://localhost', {
            method: 'POST',
            body: formData,
        });

        const result = await action(createActionArgs(mockRequest)) as Response;
        const responseData = await result.json() as any;

        expect(responseData.success).toBe(false);
        expect(responseData.error).toBe('One or both accounts not found');
    });
});