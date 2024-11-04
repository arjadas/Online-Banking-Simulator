
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';

import { describe, it, expect, vi } from 'vitest';

import { AuthProvider, AuthContext } from '../../app/components/AuthProvider';

describe('AuthProvider Component', () => {

  it('to check whether the Authprovider is rendered and the context is provided or not', () => {
    
    render(
    
    <AuthProvider uid="sample-uid">
    
        <AuthContext.Consumer>
    
          {context => (
    
            <div data-testid="authenticateContext">
             
              {context ? 'Context Provided' : 'No Context'}
            
            </div>
          
          )}
        
        </AuthContext.Consumer>
      
      </AuthProvider>
    
  );
    
    
    const contextElement = screen.getByTestId('authenticateContext');
    
    expect(contextElement).toHaveTextContent('Context Provided');
  
  });

  
  it('to provide a default authenication state', () => {
  
    render(
  
      <AuthProvider uid={null}>
      
        <AuthContext.Consumer>
      
          {context => (
      
            <div data-testid="authenticateState">
            
              {context?.uid ? 'Authenticated' : 'Not Authenticated'}
            
            </div>
          
          )}
        
        </AuthContext.Consumer>
      
      </AuthProvider>
    
    );

    const authState = screen.getByTestId('authenticateState');
    
    expect(authState).toHaveTextContent('Not Authenticated');
  
  });

  it('to update contact when uid is set', () => {
  
    render(
  
      <AuthProvider uid={null}>
        
        <AuthContext.Consumer>
          
          {context => (
            
            <div>
              
              <button onClick={() => context?.setuid('new-uid')} data-testid="login-button">Login</button>
              
              <div data-testid="authenticateState">
                
                {context?.uid ? 'Authenticated' : 'Not Authenticated'}
              
              </div>
            
            </div>
          
          )}
        
        </AuthContext.Consumer>
      
      </AuthProvider>
    
    );

    const loginButton = screen.getByTestId('login-button');
    
    const authState = screen.getByTestId('authenticateState');

  
    expect(authState).toHaveTextContent('Not Authenticated');
     
  
    fireEvent.click(loginButton);
    
   
    expect(authState).toHaveTextContent('Authenticated');
  
  });

});
