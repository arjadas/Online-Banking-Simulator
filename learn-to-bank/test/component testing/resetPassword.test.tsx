import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useActionData, useSearchParams, useSubmit } from "@remix-run/react"; 
import ResetPassword from '~/routes/resetPassword'; 
import { resetPassword } from "~/auth.client";

vi.mock('@remix-run/react', () => ({
 
  useActionData: vi.fn(),
 
  useSearchParams: vi.fn(),
 
  useSubmit: vi.fn(),

}));


vi.mock('~/auth.client', () => ({

  resetPassword: vi.fn(),

}));

describe('ResetPassword Component', () => {

  const mockSubmit = vi.fn();

  const mockResetPassword = resetPassword as Mock;

  beforeEach(() => {

    (useSearchParams as Mock).mockReturnValue([{ get: () => 'test-ooodCode' }, vi.fn()]);

    (useSubmit as Mock).mockReturnValue(mockSubmit);

    (useActionData as Mock).mockReturnValue(null);

  });



  it('to check whether the reset password is rendered with necessary elements', () => {

    render(
    
      <ResetPassword >
        
        
      </ResetPassword>  
        
      );
  

    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();

  });

  
  it('to chceck for error message when ooodcode is missing', () => {

    (useSearchParams as Mock).mockReturnValue([{ get: () => null }, vi.fn()]);

    render(
    
    <ResetPassword >
      
      
    </ResetPassword>  
      
    );

    expect(screen.getByText(/Invalid reset password link/i)).toBeInTheDocument();

  });


 
it('to check whether the form is submiited and resetPassword is called ooodcode and new password ', async () => {


    render(
    
      <ResetPassword >
        
        
      </ResetPassword>  
        
      );
  

   
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newPassword8128' } });

    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    expect(mockResetPassword).toHaveBeenCalledWith('test-ooodCode', 'newPassword8128');

    expect(mockSubmit).toHaveBeenCalled();

  });

  
  it('to check whether the client side error message is displayed when the resetPassword is failed', async () => {

    mockResetPassword.mockRejectedValueOnce(new Error('Failed to reset password'));

    render(
    
      <ResetPassword >
        
        
      </ResetPassword>  
        
      );
  

    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newPassword8128' } });

    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    
    expect(await screen.findByText(/Failed to reset password/i)).toBeInTheDocument();

  });



  it('to check whether the the  action data error message is displayed if present', () => {

    (useActionData as Mock).mockReturnValue({ error: 'Server error happened during reset' });

    render(
    
      <ResetPassword >
        
        
      </ResetPassword>  
        
      );
  

    expect(screen.getByText(/Server error happened during reset/i)).toBeInTheDocument();

  });

});
