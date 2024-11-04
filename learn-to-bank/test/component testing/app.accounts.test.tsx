
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { describe, it, expect, vi, Mock, beforeEach, afterEach } from 'vitest';

import Dashboard from '../../app/routes/app.home'; 

import { useLoaderData, useFetcher } from '@remix-run/react';

import { formatDate } from '../../../learn-to-bank-util/utils/util';

vi.mock('@remix-run/react', () => ({
 
  useLoaderData: vi.fn(),
 
  useFetcher: vi.fn(),
}));

vi.mock('~/components/AccountCard', () => ({

  __esModule: true,

  default: ({ accountType, balance }: { accountType: string; balance: string }) => (
    
    <div data-testid="accountCard">
      
      <span>{accountType}</span>
      
      <span>{balance}</span>
    
    </div>
  
  ),

}));

vi.mock('~/util', () => ({
  
  formatDate: vi.fn(),
  
  toFixedWithCommas: (value: number) => value.toFixed(2),

}));

describe('Dashboard Component', () => {
  
  const mockLoaderData = {
    
    me: {
      
      uid: 'user-289',
      
      first_name: 'illia',
      
      last_name: 'jose',
      
      email: 'illia.jose@example.com',
      
      notifications: [
        
        {
          
          notification_id: '1',
          
          content: 'Notification 1',
          
          timestamp: new Date('2023-04-23T14:19:023Z'),
        
        },
        
        {
          
          notification_id: '2',
          
          content: 'Notification 2',
          
          timestamp: new Date('2023-04-024T16:20:163'),
        
        },
      ]
      ,
    },
    
    userAccounts: [
      
      { acc: 1, short_description: 'Checking', bsb: 763, balance: 7000, pay_id: null },
      
      { acc: 2, short_description: 'Savings', bsb: 281, balance: 18000, pay_id: null },
    ],
  
  };

  const mockFetcher = { submit: vi.fn() };

  beforeEach(() => {
   
    (useLoaderData as Mock).mockReturnValue(mockLoaderData);
   
    (useFetcher as Mock).mockReturnValue(mockFetcher);
   
    (formatDate as Mock).mockReturnValue('April 23, 2023');
  
  });

 
  afterEach(() => {
    
    vi.clearAllMocks();
  
  });

  it('renders user greeting and account information', () => {
    
    render
    
    (
    
      <Dashboard >
      
      </Dashboard>
      
    );


    expect(screen.getByText(/hi illia/i)).toBeInTheDocument();

    expect(screen.getByText(/\$320.00/)).toBeInTheDocument(); 

   // to check whether rendered element has 2 components
    
   expect(screen.getAllByTestId('accountCard')).toHaveLength(2);
 
  });

  
  it('to check whether the notofications are rendered and the modal is opened when clicked on view', async () => {
    
    render(<Dashboard />);

   
    const viewButton = screen.getByRole('button', { name: /view/i });
    
    // to check how the component repsonds when the view button is clicked

    fireEvent.click(viewButton);

    
    expect(screen.getByText(/notification 1/i)).toBeInTheDocument();
    
    expect(screen.getByText(/notification 2/i)).toBeInTheDocument();

  });


  it('to check whether the notification is marked as read and the modal is closed on clicking the close button', async () => {
    render(<Dashboard />);

   // here view is case insenesitive
    
    const viewButton = screen.getByRole('button', { name: /view/i });
    
    
    fireEvent.click(viewButton);

    
    // here close is case insenesitive  

    const closeButton = screen.getByRole('button', { name: /close/i });
    
   
    fireEvent.click(closeButton);

    
    await waitFor(() => {
      
      expect(mockFetcher.submit).toHaveBeenCalledWith(
       
        { action: 'markItAsRead' },
       
        { method: 'post', action: '/api/notifications' }
      
      );
   
      
    });
  
    
  });

});
