import { action } from '../../app/routes/app.transfer';

import { mockDb, createMockContext } from '../mocks/db.server';

import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Transfer Action', () => {
  
  const mockContext = createMockContext();

  beforeEach(() => {
  
    vi.clearAllMocks();

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

 
  it('to check whether money is  successfully transfered between accounts', async () => {
 
    const fromAccount = { acc: 7, balance: 10000, short_description: 'Checking' };
 
    const toAccount = { acc: 9, balance: 5000, short_description: 'Savings' };
    
 
    mockDb.account.findUnique
 
    .mockImplementation(({ where }) => {
 
        if (where.acc === 7) return Promise.resolve(fromAccount);
      
        if (where.acc === 9) return Promise.resolve(toAccount);
 
        return Promise.resolve(null);
      });
    
    mockDb.account.update
     
      .mockResolvedValueOnce({ ...fromAccount, balance: 8300 })
      
      .mockResolvedValueOnce({ ...toAccount, balance: 5100 });
    
    mockDb.transaction.create.mockResolvedValue({
    
      id: 1,
    
      amount: 1000,
    
      sender_acc: 7,
    
      recipient_acc: 9,
    
    });

    const request = createMockRequest({
    
      fromAcc: '7',
    
      toAcc: '9',
    
      amount: '10.00',
    
      description: 'sample transfer'
    
    });

    
    const response = await action({ context: mockContext, request });
    
    const result = await response.json();

    
    expect(result.success).toBe(true);
    
    expect(mockDb.account.update).toHaveBeenCalledTimes(2);
    
    expect(mockDb.transaction.create).toHaveBeenCalledTimes(1);
  
  });

  it('need to fail fail when transferring to the same account', async () => {
  
    const account = { acc: 7, balance: 10000, short_description: 'Checking' };
    
    mockDb.account.findUnique
  
      .mockImplementation(({ where }) => {
  
    
      if (where.acc === 7) return Promise.resolve(account);
  
        return Promise.resolve(null);
        
      });

    const request = createMockRequest({
      
      fromAcc: '7',
      
      toAcc: '7',
      
      amount: '10.00',
      
      description: 'sample transfer'
    
    });

    const response = await action({ context: mockContext, request });
    
    const result = await response.json();

    expect(result.success).toBe(false);
    
    expect(result.error).toBe('Cannot transfer into the same account.');
    
    expect(mockDb.account.update).not.toHaveBeenCalled();
    
    expect(mockDb.transaction.create).not.toHaveBeenCalled();
  
  });

  it('to fail when funds are insufficient', async () => {
  
    const fromAccount = { acc: 7, balance: 7500, short_description: 'Checking' };
  
    const toAccount = { acc: 9, balance: 8000, short_description: 'Savings' };
    
    mockDb.account.findUnique
  
      .mockImplementation(({ where }) => {
  
        if (where.acc === 7) return Promise.resolve(fromAccount);
      
        if (where.acc === 9) return Promise.resolve(toAccount);
        return Promise.resolve(null);
      
      });

    const request = createMockRequest({
    
      fromAcc: '7',
    
      toAcc: '9',
    
      amount: '10.00',
    
      description: 'sample transfer'
   
    });

   
    const response = await action({ context: mockContext, request });
   
    const result = await response.json();

   
    expect(result.success).toBe(false);
   
    expect(result.error).toBe('Insufficient funds');
   
    expect(mockDb.account.update).not.toHaveBeenCalled();
   
    expect(mockDb.transaction.create).not.toHaveBeenCalled();
 
  });

  it('to check whether it  fail when account is not found', async () => {
 
    mockDb.account.findUnique.mockResolvedValue(null);

    const request = createMockRequest({
 
      fromAcc: '982',
 
      toAcc: '891',
 
      amount: '10.00',
 
      description: 'sample transfer'
 
    });

    const response = await action({ context: mockContext, request });
 
    const result = await response.json();

 
    expect(result.success).toBe(false);
 
    expect(result.error).toBe('One or both accounts not found');
 
    expect(mockDb.account.update).not.toHaveBeenCalled();
 
    expect(mockDb.transaction.create).not.toHaveBeenCalled();
 
  });

});