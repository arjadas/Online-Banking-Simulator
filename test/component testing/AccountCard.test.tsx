import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import { describe, it, expect, vi } from 'vitest'; 
import AccountCard from '../../app/components/AccountCard';
import { getBadgeColor } from '~/util';

describe('AccountCard Component', () => {
  const initialProps = {
    accountType: 'Credit Account',
    bsb: '123-456',
    accountNumber: '78901234',
    payID: 'payid@example.com',
    balance: '$1,234.56',
  };

  it('to check if the account type is displayed correctly', () => {
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    
    expect(screen.getByText(initialProps.accountType)).toBeInTheDocument();
 
  });

  it('to check if  BSB is dispalyed correctly', () => {
    
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    
    expect(screen.getByText(`BSB: ${initialProps.bsb}`)).toBeInTheDocument();
 
  });


  it('to check if accountNumber is displayed correctly', () => {
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    expect(screen.getByText(`Account Number: ${initialProps.accountNumber}`)).toBeInTheDocument();
 
  });


  it('to check if PayID is displayed correctly', () => {
    
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    
    expect(screen.getByText(`PayID: ${initialProps.payID}`)).toBeInTheDocument();
 
  });


  it('to check if balance is displayed correctly', () => {
    
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    expect(screen.getByText(initialProps.balance)).toBeInTheDocument();
 
  });

  
  it('to check the payid is not rendered if the PayID is not provided', () => {
    
    const { payID, ...propsNotIncludingPayID } = initialProps;
    
    render
    (
    
    <AccountCard {...propsNotIncludingPayID}> 
    
    </AccountCard>

    );

    expect(screen.queryByText(`PayID: ${payID}`)).toBeNull();
  
  
  
  });

  it('check correct icon is rendered for Debit Account', () => {
    
    const { container } = render(<AccountCard {...initialProps} accountType="Debit Account" />);
    
    
    expect(container.querySelector('svg[data-icon="emoji"]')).toBeInTheDocument();
  });


  it('Check whether the secondary branch is colored with the right color', () => {
    
    render(<AccountCard {...initialProps} />);
    
    const badge = screen.getByRole('status');
    
    expect(badge).toHaveStyle(`background-color: ${getBadgeColor(initialProps.accountType)}`);

  });


  it('check correct icon is rendered for Credit Account', () => {
    const { container } = render
    (
    <AccountCard {...initialProps} accountType="Credit Account" >

    </AccountCard>
    );

    expect(container.querySelector('svg[data-icon="credit-card"]')).toBeInTheDocument();
  });
  
  
  
  it('check correct icon is rendered for Saver Account', () => {
    const { container } = render
    (
    <AccountCard {...initialProps} accountType="Saver Account" >

    </AccountCard>
    );
    expect(container.querySelector('svg[data-icon="dollar-sign"]')).toBeInTheDocument();
  });

  it('Comparing Snapshots to ensure stable rendering of this component', () => {
    
    const { asFragment } = render
    (

    <AccountCard {...initialProps} >

    </AccountCard>
    
    );

    expect(asFragment()).toMatchSnapshot();
  });



});
