
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import PaySomeoneForm from '../../app/components/PaySomeoneForm';


const defaultProps = {
  accounts: [
    {
      acc: 892478,

      bsb: 982374,

      acc_name: 'Main Account',

      uid: 'user-7',

      balance: 10000,

      pay_id: null,

      biller_code: null,

      crn: null,

      short_description: 'Primary checking account',

      long_description: 'Main checking account for daily expenses',

      opened_timestamp: new Date('2020-04-18'),
    }
  ],
  actionData: {},
  onBack: vi.fn(),
};

describe('PaySomeoneForm Component', () => {

  it('checking whether all the fields are rendered correctly ', () => {
   
    render(<PaySomeoneForm {...defaultProps} />);
   
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
   
    expect(screen.getByLabelText(/Recipient/i)).toBeInTheDocument();
   
    expect(screen.getByLabelText(/Amount/i)).toHaveValue('');
   
    expect(screen.getByLabelText(/Recipient/i)).toHaveValue('');
  
  });

 
  it('checks whether it allows user to input payment details', () => {
    
    render(<PaySomeoneForm {...defaultProps} />);
    
    const amount_Input = screen.getByLabelText(/Amount/i);
    
    const recipient_Input = screen.getByLabelText(/Recipient/i);

    fireEvent.change(amount_Input, { target: { value: '150' } });

    fireEvent.change(recipient_Input, { target: { value: 'Rajeev Sukumar' } });

    expect(amount_Input).toHaveValue('150');
   
    expect(recipient_Input).toHaveValue('Rajeev Sukumar');
  
  });

  
  it(' to  check whther validation error is displayed if the amount is invalid', () => {
    
    render(<PaySomeoneForm {...defaultProps} />);
    
    const amountInput = screen.getByLabelText(/Amount/i);
   
    fireEvent.change(amountInput, { target: { value: '-50' } });
    
    const errorMessage = screen.getByText(/Invalid amount/i); 
  
    expect(errorMessage).toBeInTheDocument();

  });

 
 
  
 it('to check whether the submit button is disabled for invalid input', () => {
   
    render(<PaySomeoneForm {...defaultProps} />);
    
    const amountInput = screen.getByLabelText(/Amount/i);
   
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(amountInput, { target: { value: '-50' } });
   
    expect(submitButton).toBeDisabled();
  
  });



  it('to check whether the form is submitted if valid data is entered', () => {
    
    render(<PaySomeoneForm {...defaultProps} />);

    const amount_Input = screen.getByLabelText(/Amount/i);
   
    const recipient_Input = screen.getByLabelText(/Recipient/i);
   
    const submit_Button = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(amount_Input, { target: { value: '100' } });
   
    fireEvent.change(recipient_Input, { target: { value: 'John Doe' } });
    
    //  to make the form submitted if the submit button is clicked
    
    fireEvent.click(submit_Button);


    expect(screen.getByText(/Submission is successful/i)).toBeInTheDocument();
  });

 
 
  
  it('to check whether the fields are reseted when the reset button is clicked', () => {
   
    render(<PaySomeoneForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/Amount/i);
   
    const recipientInput = screen.getByLabelText(/Recipient/i);
   
    const resetButton = screen.getByRole('button', { name: /reset/i });

    fireEvent.change(amountInput, { target: { value: '100' } });
    
    fireEvent.change(recipientInput, { target: { value: 'John Doe' } });
    
    fireEvent.click(resetButton);

    expect(amountInput).toHaveValue('');
   
    expect(recipientInput).toHaveValue('');
  
  });



  it('to check whether the note field is rendered when the add note button is clicked', () => {
   
    render(<PaySomeoneForm {...defaultProps} />);

    const addNoteButton = screen.getByRole('button', { name: /add note/i });
   
    fireEvent.click(addNoteButton);

    const noteInput = screen.getByLabelText(/Note/i);
  
    expect(noteInput).toBeInTheDocument();
  
    fireEvent.change(noteInput, { target: { value: 'This is a note' } });
  
    expect(noteInput).toHaveValue('This is a note');
  
  });

});
