
import { render, screen, fireEvent } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach ,Mock} from 'vitest';

import MyCards from '../../app/routes/app.cards'; 

import { useLoaderData } from '@remix-run/react';

import { RootState } from '../../app/store';
import React from 'react';

vi.mock('@remix-run/react', () => ({
  
  useLoaderData: vi.fn(),

}));

vi.mock('react-redux', () => ({
  
  useSelector: (fn: (state: RootState) => any) => fn({
    
    app: {
      textScale: 15,
      isDarkTheme: false,
      transactionFlow: {
        fromAcc: null,
        toAcc: null,
        userPrevContact: null,
        enabled: false,
        successful: false,
        recipientAddress: {
          accountName: '',
          acc: 0,
          bsb: 0,
          billerCode: 0,
          crn: 0,
          payId: ''
        },
      }
    },
  
  }),

}));


const mockLoaderData = {
  
  creditCardData: {
    
    card_number: '8611282828318181',
    
    cardholder_name: 'Rajeev Sukumar',
    
    expiry_date: '07/28',
    
    csc: '929',
  
  },
  
  debitCardData: {
    
    card_number: '9120812984738110',
    
    cardholder_name: 'deepa Rajeev',
    
    expiry_date: '09/29',
    
    csc: '652',
  
  },
  
  accBalance: {
    
    credit: 100000,
    
    debit: 42000,
  
  },

};
  
  vi.mock('@remix-run/react', () => ({
    
    useLoaderData: vi.fn() as Mock, 
  
  }));
  
  describe('MyCards Component', () => {
    
    beforeEach(() => {
      
      (useLoaderData as Mock).mockReturnValue(mockLoaderData);
    
    });
  
  it('to check whether the debit and credit card information is rendered', () => {
    
    render(<MyCards />);

   
    expect(screen.getByText('8611282828318181')).toBeInTheDocument();
    
    expect(screen.getByText('9120812984738110')).toBeInTheDocument();

   
    expect(screen.getByText('Rajeev Sukumar')).toBeInTheDocument();
   
    expect(screen.getByText('Deepa Rajeev')).toBeInTheDocument();

    
    expect(screen.getByText('$100.00 available')).toBeInTheDocument();
   
    expect(screen.getByText('$50.00 available')).toBeInTheDocument();
  
  });

  it('to toggle show and hide details of csc and expiry date ', () => {
  
    render(<MyCards />);

   
    expect(screen.getByText('EXPIRY **/**')).toBeInTheDocument();
  
    expect(screen.getByText('CSC ***')).toBeInTheDocument();

    const showButton = screen.getAllByRole('button', { name: /show/i })[0];
  
    fireEvent.click(showButton);


    expect(screen.getByText('EXPIRY 07/28')).toBeInTheDocument();
  
    expect(screen.getByText('CSC 929')).toBeInTheDocument();

   
    const hideButton = screen.getAllByRole('button', { name: /hide/i })[0];
  
    fireEvent.click(hideButton);


    expect(screen.getByText('EXPIRY **/**')).toBeInTheDocument();
  
    expect(screen.getByText('CSC ***')).toBeInTheDocument();
  
  });

  it('to check whether it is navigated properly to next card', () => {
  
    render(<MyCards />);

   
    expect(screen.getByText('8611282828318181')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /›/i });
    
    fireEvent.click(nextButton);

   
    expect(screen.queryByText('8611282828318181')).not.toBeInTheDocument();
    
    expect(screen.getByText('9120812984738110')).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /‹/i });
    
    fireEvent.click(prevButton);

    expect(screen.getByText('8611282828318181')).toBeInTheDocument();
  
  });

  it('whether the card switches when clicked on the dots', () => {
  
    render(<MyCards />);

    
    const dots = screen.getAllByRole('button', { hidden: true });
  
    fireEvent.click(dots[1]);

 
    expect(screen.queryByText('8611282828318181')).not.toBeInTheDocument();
  
    expect(screen.getByText('9120812984738110')).toBeInTheDocument();

  });

});
