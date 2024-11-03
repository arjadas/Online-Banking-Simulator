
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from 'vitest';
import Signup from '~/routes/signup'; 
import { signup } from '~/auth.client';
import { useSubmit } from '@remix-run/react';

vi.mock('~/auth.client', () => ({
 
  signup: vi.fn(),

}));

vi.mock('@remix-run/react', () => ({

  Form: ({ children }: any) => <form>{children}</form>,

  useSubmit: vi.fn(),

}));

describe('Signup Component', () => {

  const mockSubmit = vi.fn();

  const mockSignup = signup as Mock;

  beforeEach(() => {

    (useSubmit as Mock).mockReturnValue(mockSubmit);

    mockSignup.mockResolvedValue({ uid: 'user-812' });

  });

  afterEach(() => {

    vi.clearAllMocks();

  });

  it('to submit the form and call signup and useSubmit', async () => {

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Aden' } });
   
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Diamond' } });
   
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'aden@example.com' } });
   
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password992' } });
   
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password992' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
     
      expect(mockSignup).toHaveBeenCalledWith('aden@example.com', 'password992');
     
      expect(mockSubmit).toHaveBeenCalled();
    
    });
  
  });

  
  it('to display error message when passwords do not match', async () => {
  
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password992' } });
  
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password919' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/password does not match/i)).toBeInTheDocument();
  
    expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
  
  });

 
  it('to check whether shows loading state when submitting', async () => {
  
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Aden' } });
  
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Diamond' } });
  
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'aden@example.com' } });
  
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password992' } });
  
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password992' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));


   
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();

    await waitFor(() => {
   
      expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
   
    });
  
  });

});
