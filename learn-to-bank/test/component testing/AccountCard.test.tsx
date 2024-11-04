
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import { describe, it, expect, vi } from 'vitest'; 
import { AccountCard } from '../../../learn-to-bank/app/components/AccountCard';
import { getBadgeColor } from '../../../learn-to-bank-util/utils/util';
import React from 'react';

/** 
 * random prop values for various tests 
 */


describe('AccountCard Component', () => {
 
  const initialProps = {
    
    accountType: 'Saver Account',
    
    bsb: 752913,
    
    accountNumber: 86651430,
    
    payID: 'ssusan@example.com',
    
    balance: '$4194.86',
  
  };


/**
 * 
 * This test ensures that the correct account type is rendered
 * 
 */


  it('to check if the account type is displayed correctly', () => {
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    
    expect(screen.getByText(initialProps.accountType)).toBeInTheDocument();
 
  });

/**
 * 
 * This test ensures that the correct BSB is rendered
 * 
 */


  it('to check if  BSB is displayed correctly', () => {
    
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    
    expect(screen.getByText(`BSB: ${initialProps.bsb}`)).toBeInTheDocument();
 
  });


  /**
 * 
 * This test ensures that the correct account Number is rendered
 * 
 */


  it('to check if accountNumber is displayed correctly', () => {
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
   
    
     // checking whether the text returned by screen.getBYtext is in the component using toBeInTheDocument
     

    expect(screen.getByText(`Account Number: ${initialProps.accountNumber}`)).toBeInTheDocument();
 
  });


  /**
 * 
 * This test ensures that the correct PayID is rendered
 * 
 */


  it('to check if PayID is displayed correctly', () => {
    
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );
    
    // checking whether the text returned by screen.getBYtext is in the component using toBeInTheDocument

    expect(screen.getByText(`PayID: ${initialProps.payID}`)).toBeInTheDocument();
 
  });

/**
 * 
 * This test ensures that the correct balance is rendered
 * 
 */



  it('to check if balance is displayed correctly', () => {
    
    
    render
    (
    <AccountCard {...initialProps}>
      
    </AccountCard>
    
    );

    // checking whether the text returned by screen.getBYtext is in the component using toBeInTheDocument
    
    expect(screen.getByText(initialProps.balance)).toBeInTheDocument();
 
  });


  /**
 * 
 * This test ensures that the payid is not rendered if it is not provided
 * 
 */


  
  it('to check the payid is not rendered if the PayID is not provided', () => {
    
    const { payID, ...propsNotIncludingPayID } = initialProps;
    
    render
    (
    
    <AccountCard {...propsNotIncludingPayID}> 
    
    </AccountCard>

    );

    // to check that the text returned by querytext is not rendered in the component
  
    expect(screen.queryByText(`PayID: ${payID}`)).toBeNull();
  
  
  
  });

/**
 * 
 * This test ensures that correct icon is rendered for debit account
 * 
 */



  it('check correct icon is rendered for Debit Account', () => {
    
    const { container } = render(<AccountCard {...initialProps} accountType="Debit Account" />);
    
    
    expect(container.querySelector('svg[data-icon="emoji"]')).toBeInTheDocument();
  });


/**
 * 
 * This test ensures that correct color is rendered based on account type
 * 
 */


  it('Check whether the correct color is rendered based on account type', () => {
    
    render(<AccountCard {...initialProps} />);
    
    const badge = screen.getByRole('status');
    
    expect(badge).toHaveStyle(`background-color: ${getBadgeColor(initialProps.accountType)}`);

  });


  /**
 * 
 * This test ensures that correct icon is rendered for credit account
 * 
 */


  it('check correct icon is rendered for Credit Account', () => {
    const { container } = render
    (
    <AccountCard {...initialProps} accountType="Credit Account" >

    </AccountCard>
    );

    expect(container.querySelector('svg[data-icon="credit-card"]')).toBeInTheDocument();
  });
  
  
    /**
 * 
 * This test ensures that correct icon is rendered for saver account
 * 
 */

  it('check correct icon is rendered for Saver Account', () => {
    const { container } = render
    (
    <AccountCard {...initialProps} accountType="Saver Account" >

    </AccountCard>
    );
    expect(container.querySelector('svg[data-icon="dollar-sign"]')).toBeInTheDocument();
  });

  /**
 * 
 * This test is to check whether the rendering is stable
 * 
 */

  it('Comparing Snapshots to ensure stable rendering of this component', () => {
    
    const { asFragment } = render
    (

    <AccountCard {...initialProps} >

    </AccountCard>
    
    );

    expect(asFragment()).toMatchSnapshot();
  });



});
