import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import Transactions from '~/routes/app.history'; 
import { useLoaderData } from '@remix-run/react';
import { generateTransactionsPDF } from '~/service/generateTransactionsPDF';


vi.mock('@remix-run/react', () => ({
 
  useLoaderData: vi.fn() as Mock,

}));

vi.mock('~/service/generateTransactionsPDF', () => ({

  generateTransactionsPDF: vi.fn(),

}));

describe('Transactions Component', () => {

  const mockLoaderData = {

    transactions: [

      {

        transaction_id: 1,

        amount: 2300,

        sender_acc: 98470,

        recipient_acc: 64099,

        timestamp: new Date().toISOString(),

        sender: { acc: 98470, acc_name: "Sender 1", short_description: "Account D" },

        recipient: { acc: 64099, acc_name: "Recipient 1", short_description: "Account F" },

        reference: "Reference1",

        description: "Desc 1",

      },
    
      {

        transaction_id: 2,

        amount: 1800,

        sender_acc: 64099,

        recipient_acc: 98470,

        timestamp: new Date().toISOString(),

        sender: { acc: 64099, acc_name: "Sender 2", short_description: "Account F" },

        recipient: { acc: 98470, acc_name: "Recipient 2", short_description: "Account D" },

        reference: "Reference2",

        description: "Desc 2",
      },

    ],

    accounts: [

      { acc: 98470, short_description: "Account D", bsb: 178788, opened_timestamp: new Date() },

      { acc: 64099, short_description: "Account F", bsb: 221828, opened_timestamp: new Date() },

    ],

  };

  beforeEach(() => {

    (useLoaderData as Mock).mockReturnValue(mockLoaderData);

  });


  it('to check whether total transactions, sent, and received amounts are rendered correctly', () => {

    render
    (
   
    <Transactions >

    </Transactions>
    
    );

   
    expect(screen.getByText(/Total Transactions:/)).toBeInTheDocument();
   
    expect(screen.getByText(/Total Sent:/)).toBeInTheDocument();
   
    expect(screen.getByText(/Total Received:/)).toBeInTheDocument();
  
  });

  
  it('to filter transactions based on account selection', () => {
  
    render
    
    (
    
    <Transactions >

    </Transactions>
    
    );

  
    const selectElement = screen.getByPlaceholderText('Filter by account');
  
    fireEvent.change(selectElement, { target: { value: '98470' } });

    expect(screen.getAllByText(/Account D/).length).toBeGreaterThan(0);

  });


  it('to searches transactions based keyword', () => {

    render
    
    (
    
    <Transactions >

    </Transactions>
   
    );



    const searchInput = screen.getByPlaceholderText('Search Transaction');

    fireEvent.change(searchInput, { target: { value: 'Reference1' } });


    expect(screen.getByText('Desc 1')).toBeInTheDocument();

    expect(screen.queryByText('Desc 2')).not.toBeInTheDocument();
  });


  it('to toggle transaction details', () => {

    render
    (
    
    <Transactions >

    </Transactions>
    
    );


  
    const viewDetailsButton = screen.getAllByRole('button', { name: /view details/i })[0];

    fireEvent.click(viewDetailsButton);

   
    expect(screen.getByText(/Sender Account:/)).toBeInTheDocument();

    expect(screen.getByText(/Recipient Account:/)).toBeInTheDocument();

    expect(screen.getByText(/Reference:/)).toBeInTheDocument();

    expect(screen.getByText(/Description:/)).toBeInTheDocument();

  });

  it('to check downloads PDF of filtered transactions works properly', async () => {

    render
    
    (
    
    <Transactions >

    </Transactions>
   
    );


    const downloadButton = screen.getByRole('button', { name: /download pdf statement for checking/i });

    fireEvent.click(downloadButton);


    await waitFor(() => expect(generateTransactionsPDF).toHaveBeenCalled());

  });

});
