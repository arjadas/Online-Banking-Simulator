
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import UserPrevContactForm from '../../app/components/UserPrevContactForm';
import { UserPrevContactResult } from '~/routes/app.paySomeone';

const mockContacts: UserPrevContactResult[] = [
  {
    user_prev_contact_id: 1,
    
    contact_user: {
      
      uid: '7',
      
      first_name: 'Ravi',
      
      last_name: 'Kumar',
    
    },
    
    contact_description: 'Family',
    
    contact_acc: 765415, 
    
    contact_acc_name: 'Ravi Kumar’s Account',
    
    contact_uid: 'contact-uid-7',
    
    contact_recipient_address: '162 City Road SouthBank',
  
  },
  
  {
    
    user_prev_contact_id: 2, 
    
    contact_user: {
      
      uid: '11',
      
      first_name: 'Lekshmi',
      
      last_name: 'Priya',
    
    },
    
    contact_description: 'Friend',
    
    contact_acc: 865412, 
    
    contact_acc_name: 'Lekshmi Priya’s Account',
    
    contact_uid: 'contact-uid-11',
    
    contact_recipient_address: '386 Bouverie street',
  
  },

];

const mockOnSubmit = vi.fn();

describe('UserPrevContactForm Component', () => {

  it('torenders contact list and New Contact button', () => {
   
    render(<UserPrevContactForm contacts={mockContacts} onSubmit={mockOnSubmit} />);
    
    
    mockContacts.forEach(contact => {
      
      const contactName = `${contact.contact_user!.first_name} ${contact.contact_user!.last_name}`;
      
      expect(screen.getByText(contactName)).toBeInTheDocument();
    
    });
    
    
    
    expect(screen.getByText('New Contact')).toBeInTheDocument();
  
  });

  it('to call onSubmit with contact data when the contact is clicked', () => {
    
    render(<UserPrevContactForm contacts={mockContacts} onSubmit={mockOnSubmit} />);

    
    const firstContactButton = screen.getByText('Ravi Kumar');
    
    fireEvent.click(firstContactButton);

   
    expect(mockOnSubmit).toHaveBeenCalledWith(mockContacts[0]);
  
  });

  it('to call onSubmit with null when New Contact button is clicked', () => {
    
    render(<UserPrevContactForm contacts={mockContacts} onSubmit={mockOnSubmit} />);

    
    const newContactButton = screen.getByText('New Contact');
    
    fireEvent.click(newContactButton);

   
    expect(mockOnSubmit).toHaveBeenCalledWith(null);
  
  });

});
