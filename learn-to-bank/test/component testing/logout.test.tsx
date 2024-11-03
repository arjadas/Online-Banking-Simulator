
import { render } from '@testing-library/react';
import { useNavigate } from '@remix-run/react';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest'; 
import Logout from '~/routes/logout'; 
import { signOutUser } from '~/auth.client';

vi.mock('@remix-run/react', () => ({
  useNavigate: vi.fn(),
}));
vi.mock('~/auth.client', () => ({
  signOutUser: vi.fn(),
}));

describe('Logout Component', () => {
 
  const mockNavigate = vi.fn();
 
  const mockSignOutUser = signOutUser as Mock;

  beforeEach(() => {
   
    (useNavigate as Mock).mockReturnValue(mockNavigate);
   
    mockSignOutUser.mockResolvedValue(undefined);
   
    vi.spyOn(global.localStorage, 'getRidOfItem');
 
  });

  afterEach(() => {
 
    vi.clearAllMocks();
 
  });


  it('check whether the signOut user is called and uid is removed and it is navigated back to login', async () => {
 
    render(<Logout />);

    
    expect(mockSignOutUser).toHaveBeenCalled();

   
    expect(localStorage.removeItem).toHaveBeenCalledWith('uid');

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  
  });

}); 



