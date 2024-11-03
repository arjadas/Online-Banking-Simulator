import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach,describe, it, expect, vi, Mock } from 'vitest';
import PaySomeone from '~/routes/app.paySomeone'; 
import { useLoaderData, useActionData } from '@remix-run/react';

vi.mock('@remix-run/react', () => ({
 
  useLoaderData: vi.fn(),
 
  useActionData: vi.fn(),

}));

describe('PaySomeone Component', () => {

  const mockLoaderData = {

    userAccounts: [{ acc: '652', balance: 1000 }],

    userPrevContactsWithInfo: [

      { contact_acc: '932', contact_user: { first_name: 'sean', last_name: 'peter', uid: 'user-728' } },

    ],

  };

  beforeEach(() => {

    (useLoaderData as Mock).mockReturnValue(mockLoaderData);

    (useActionData as Mock).mockReturnValue({});

  });

  it('check whether UserPrevContactForm is rendered correctly when no previous contact is selected', () => {

    render(<PaySomeone />);

    expect(screen.getByText(/pay someone/i)).toBeInTheDocument();

    expect(screen.getByText(/sean peter/i)).toBeInTheDocument();
  });

  it('to check whether  PaySomeoneForm is rendered correctly when a contact is selected', () => {

    render(<PaySomeone />);

    fireEvent.click(screen.getByText(/sean peter/i));

    expect(screen.getByText(/account/i)).toBeInTheDocument();

  });

});
