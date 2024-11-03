import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach,describe, it, expect, vi , Mock} from 'vitest';
import ForgotPassword from '~/routes/forgotPassword'; 
import { useActionData } from "@remix-run/react";

vi.mock("@remix-run/react", () => ({
  
  useActionData: vi.fn(),

}));

describe('ForgotPassword Component', () => {

  beforeEach(() => {

    (useActionData as Mock).mockReturnValue(null);

  });

  it('to check the forgot password form is rendered correctly', () => {
 
    render(<ForgotPassword />);

    expect(screen.getByRole('img')).toBeInTheDocument();

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Enter your Email/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();

    expect(screen.getByText(/Back to Sign in/i)).toBeInTheDocument();

  });

  it('to check whether the succes message is rendered correctly', () => {
    
    (useActionData as Mock).mockReturnValue({ success: 'Password reset email sent!' });
    
    render(<ForgotPassword />);

    expect(screen.getByText(/Password reset email sent!/i)).toBeInTheDocument();
    
    expect(screen.queryByText(/error/i)).toBeNull();

  });

  it('to check whether the failure message is rendered correctly', () => {
   
    (useActionData as Mock).mockReturnValue({ error: 'Failed to send reset email' });
   
    render(<ForgotPassword />);

    expect(screen.getByText(/Failed to send reset email/i)).toBeInTheDocument();
   
    expect(screen.queryByText(/success/i)).toBeNull(); 
 
  });

  it('to check whether the form is submitted when the rest button is clicked ', () => {
   
    render(<ForgotPassword />);

 
    fireEvent.change(screen.getByPlaceholderText(/Enter your Email/i), { target: { value: 'sample@example.com' } });
   
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

   
    expect(screen.getByPlaceholderText(/Enter your Email/i)).toHaveValue('sample@example.com');
 
  });

});
