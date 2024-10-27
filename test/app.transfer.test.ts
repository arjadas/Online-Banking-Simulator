import { action } from '../app/routes/app.transfer';
import { mockDb, createMockContext } from './mocks/db.server';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Transfer Action', () => {
  const mockContext = createMockContext();

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset all mocks to their initial state
    mockDb.account.findUnique.mockReset();
    mockDb.account.update.mockReset();
    mockDb.transaction.create.mockReset();
  });

  const createMockRequest = (data: { fromAcc: string; toAcc: string; amount: string; description: string }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return new Request('http://localhost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
  };

  it('should successfully transfer money between accounts', async () => {
    const fromAccount = { acc: 1, balance: 10000, short_description: 'Checking' };
    const toAccount = { acc: 2, balance: 5000, short_description: 'Savings' };
    
    mockDb.account.findUnique
      .mockImplementation(({ where }) => {
        if (where.acc === 1) return Promise.resolve(fromAccount);
        if (where.acc === 2) return Promise.resolve(toAccount);
        return Promise.resolve(null);
      });
    
    mockDb.account.update
      .mockResolvedValueOnce({ ...fromAccount, balance: 9000 })
      .mockResolvedValueOnce({ ...toAccount, balance: 6000 });
    
    mockDb.transaction.create.mockResolvedValue({
      id: 1,
      amount: 1000,
      sender_acc: 1,
      recipient_acc: 2,
    });

    const request = createMockRequest({
      fromAcc: '1',
      toAcc: '2',
      amount: '10.00',
      description: 'Test transfer'
    });

    const response = await action({ context: mockContext, request });
    const result = await response.json();

    expect(result.success).toBe(true);
    expect(mockDb.account.update).toHaveBeenCalledTimes(2);
    expect(mockDb.transaction.create).toHaveBeenCalledTimes(1);
  });

  it('should fail when transferring to the same account', async () => {
    const account = { acc: 1, balance: 10000, short_description: 'Checking' };
    
    mockDb.account.findUnique
      .mockImplementation(({ where }) => {
        if (where.acc === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

    const request = createMockRequest({
      fromAcc: '1',
      toAcc: '1',
      amount: '10.00',
      description: 'Test transfer'
    });

    const response = await action({ context: mockContext, request });
    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot transfer into the same account.');
    expect(mockDb.account.update).not.toHaveBeenCalled();
    expect(mockDb.transaction.create).not.toHaveBeenCalled();
  });

  it('should fail when there are insufficient funds', async () => {
    const fromAccount = { acc: 1, balance: 500, short_description: 'Checking' };
    const toAccount = { acc: 2, balance: 5000, short_description: 'Savings' };
    
    mockDb.account.findUnique
      .mockImplementation(({ where }) => {
        if (where.acc === 1) return Promise.resolve(fromAccount);
        if (where.acc === 2) return Promise.resolve(toAccount);
        return Promise.resolve(null);
      });

    const request = createMockRequest({
      fromAcc: '1',
      toAcc: '2',
      amount: '10.00',
      description: 'Test transfer'
    });

    const response = await action({ context: mockContext, request });
    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Insufficient funds');
    expect(mockDb.account.update).not.toHaveBeenCalled();
    expect(mockDb.transaction.create).not.toHaveBeenCalled();
  });

  it('should fail when account is not found', async () => {
    mockDb.account.findUnique.mockResolvedValue(null);

    const request = createMockRequest({
      fromAcc: '999',
      toAcc: '888',
      amount: '10.00',
      description: 'Test transfer'
    });

    const response = await action({ context: mockContext, request });
    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.error).toBe('One or both accounts not found');
    expect(mockDb.account.update).not.toHaveBeenCalled();
    expect(mockDb.transaction.create).not.toHaveBeenCalled();
  });
});