import { describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import { vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/vue';
import Login from '../app/routes/login'; // adjust this path to your login component
import { auth } from '../app/firebase'; // adjust to your authentication client
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useActionData } from 'react-router-dom';

// Mock Firebase's signInWithEmailAndPassword function
vi.mock('../app/auth.client', () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

// Mock Remix's useActionData and other relevant hooks
vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual('@remix-run/react');
  return {
    ...actual,
    useActionData: vi.fn(),
  };
});

describe('User Login', () => {
  beforeEach(() => {
    (useActionData as Mock).mockReturnValue(null); // Mock return value for useActionData
    render(Login);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form properly', () => {
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
  });
});