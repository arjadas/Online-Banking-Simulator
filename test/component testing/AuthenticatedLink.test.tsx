import { render, screen, fireEvent } from '@testing-library/react';

import { AuthenticatedLink } from '../../app/components/AuthenticatedLink';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'; 

import { useAuth } from '../../app/components/AuthProvider';

import { useFetcher } from '@remix-run/react';



vi.mock('../../app/components/AuthProvider', () => ({
  
  useAuth: vi.fn(),

}));

vi.mock('@remix-run/react', () => ({
  
  useFetcher: vi.fn(),
  
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>, 

}));

describe('AuthenticatedLink', () => {
  
  const mockSubmit = vi.fn();

  beforeEach(() => {
    
    (
      useAuth as typeof useAuth &
      
      { mockReturnValue: (value: any) => void }
    
    ).mockReturnValue({ uid: 'sample-uid' });

    (
      useFetcher as typeof useFetcher &
      
      { mockReturnValue: (value: any) => void }
    
    ).mockReturnValue({
      
      submit: mockSubmit,
    
    });
  
  });


  afterEach(() => {
    
    vi.clearAllMocks();
  
  });

  it('to check whether the link is rendered correctly', () => {
    
    render(<AuthenticatedLink to="/test">Test Link</AuthenticatedLink>);
    
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  
  });

  it('to check whether call fetcher is called on mouse enter', () => {
    
    const { getByText } = render(<AuthenticatedLink to="/test">Test Link</AuthenticatedLink>);

   
    fireEvent.mouseEnter(getByText('Test Link'));

    expect(mockSubmit).toHaveBeenCalledWith(
      
      {
        
        method: 'get',
        
        action: '/test?_data=routes//test',
        
        headers: {
          
          // Cookie expires after  a wwek
          
          'Cookie': 'uid=sample-uid; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800',
        
        },
      
     
   
      }
   
      
    );
  
  });

});
