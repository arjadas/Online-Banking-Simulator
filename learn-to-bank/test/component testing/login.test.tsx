
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from 'vitest';
import Login from '~/routes/login'; 
import { login } from '~/auth.client';
import { createUserSession } from '~/auth.server';
import { useSubmit } from '@remix-run/react';

vi.mock('~/auth.client', () => ({
 
  login: vi.fn(),

}));

vi.mock('~/auth.server', () => ({
 
  createUserSession: vi.fn(),

}));

vi.mock('@remix-run/react', () => ({

  Form: ({ children }: any) => <form>{children}</form>,

  useSubmit: vi.fn(),

}));

describe('Login Component', () => {

  const mockLogin = login as Mock;

  const mockCreateUserSession = createUserSession as Mock;

  const mockSubmit = vi.fn();

  beforeEach(() => {

    (useSubmit as Mock).mockReturnValue(mockSubmit);

    vi.spyOn(global.localStorage, 'setItem');

    mockLogin.mockResolvedValue({ uid: 'user-637' });

  });

  afterEach(() => {

    vi.clearAllMocks();

  });



  it('checks whether login and createUserSession called  if the form is submitted succefully', async () => {

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'sample@example.com' } });
    
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password827' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
   
      expect(mockLogin).toHaveBeenCalledWith('sample@example.com', 'password827');
   
    });

   
    expect(mockSubmit).toHaveBeenCalledWith(
     
      expect.any(FormData),
     
      { method: 'post', action: '/login' }
    
    );

  
    expect(localStorage.setItem).toHaveBeenCalledWith('uid', 'user-637');
  
  });

  
  it('to check whether error message is rendered if the login fails', async () => {
    
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'mistake@example.com' } });
    
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'incorrectpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
     
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    
   
    });
  
  });

  it('to check whether loading state is rendered correctly after submission', async () => {
    
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'sample@example.com' } });
    
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password827' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();

    await waitFor(() => {
      
      expect(screen.getByRole('button', { name: /log in/i })).not.toBeDisabled();
    
    });
  
  });

});
 