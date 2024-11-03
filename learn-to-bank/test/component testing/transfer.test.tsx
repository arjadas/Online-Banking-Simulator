import { render, screen, fireEvent } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import TransferBetweenAccounts from '~/routes/app.transfer'; 

import { useLoaderData, useActionData } from '@remix-run/react';

vi.mock('@remix-run/react', () => ({

  useLoaderData: vi.fn(),

  useActionData: vi.fn(),

}));

describe('TransferBetweenAccounts Component', () => {
  
  const mockAccounts = [
  
    { acc: 98470, short_description: 'Savings Account', balance: 100000 },
  
    { acc: 64099, short_description: 'Checking Account', balance: 50000 },
  
  ];

  beforeEach(() => {
  
    (useLoaderData as Mock).mockReturnValue({ userAccounts: mockAccounts });
  
    (useActionData as Mock).mockReturnValue(null);
  
  });

  it('to check whether transfer form fields are correctly rendered ', () => {
  
    render(<TransferBetweenAccounts/>) ;
 
    expect(screen.getByText(/Transfer Between Accounts/i)).toBeInTheDocument();

  
    expect(screen.getByText(/From/i)).toBeInTheDocument();

    expect(screen.getByText(/To/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Transfer Amount/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Enter description/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Transfer/i })).toBeInTheDocument();
  });

  it('to check whether updates account selection and amount input works correctly', () => {

    render(<TransferBetweenAccounts />);

    const fromSelect = screen.getAllByPlaceholderText('Select account')[0];

    fireEvent.change(fromSelect, { target: { value: '98470' } });

    expect(fromSelect).toHaveValue('98470');

 
    const toSelect = screen.getAllByPlaceholderText('Select account')[1];

    fireEvent.change(toSelect, { target: { value: '64099' } });

    expect(toSelect).toHaveValue('64099');

    
    const amountInput = screen.getByRole('textbox', { name: /Transfer Amount/i });

    fireEvent.change(amountInput, { target: { value: '184.00' } });

    expect(amountInput).toHaveValue('184.00');

  });

  it('to  show success message is shown after a successful transfer', () => {

    (useActionData as Mock).mockReturnValue({ success: true });

    render(<TransferBetweenAccounts />);

    expect(screen.getByText(/Transfer successful!/i)).toBeInTheDocument();

  });

  it('to displays an error message after a failed transfer', () => {
   
    (useActionData as Mock).mockReturnValue({ success: false, error: 'Insufficient funds' });
   
    render(<TransferBetweenAccounts />);

   
    expect(screen.getByText(/Transfer failed:/i)).toBeInTheDocument();
   
    expect(screen.getByText(/Insufficient funds/i)).toBeInTheDocument();
  
  });

  it('to render account options based on the loader data', () => {

    render(<TransferBetweenAccounts />);

    expect(screen.getByText('Savings Account')).toBeInTheDocument();
    
    expect(screen.getByText('Checking Account')).toBeInTheDocument();
  
  });

  it('to submit the form correctly when transfer button is clicked', () => {

    render(<TransferBetweenAccounts />);

    fireEvent.change(screen.getAllByPlaceholderText('Select account')[0], { target: { value: '98470' } });
  
    fireEvent.change(screen.getAllByPlaceholderText('Select account')[1], { target: { value: '64099' } });
  
    fireEvent.change(screen.getByPlaceholderText(/Enter description/i), { target: { value: 'Test transfer' } });
  
    fireEvent.change(screen.getByRole('textbox', { name: /Transfer Amount/i }), { target: { value: '184.00' } });

    fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));
    
  });

});
