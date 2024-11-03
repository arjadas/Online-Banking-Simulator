
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ResizableText from '../../app/components/ResizableText';

const mockStore = configureStore([]);

describe('ResizableText Component', () => {

  
  it('to check whether it is rendered with default font size', () => {
   
    const initial_State = { app: { textScale: 14 } };
   
    const store = mockStore(initial_State);

    render(
     
     <Provider store={store}>
     
        <ResizableText>Sample Text for testing CODE RED</ResizableText>
     
      </Provider>
    
  );

    const text_Element = screen.getByText(/Sample Text/i);
  
    expect(text_Element).toHaveStyle('font-size: 14px'); 
 
  });

  
  it('to check whether h1 prop is rendered with adjusted font size', () => {
   
    const initial_State = { app: { textScale: 14 } };
   
   const store = mockStore(initial_State);

    render(
  
    <Provider store={store}>
    
        <ResizableText h1>Sample Text for testing CODE RED</ResizableText>
    
      </Provider>
    
    );

    const textElement = screen.getByText(/Sample Text/i);
    
    expect(textElement).toHaveStyle('font-size: 38px'); 
  
  });



  it('to check whether it is rendered with updated font size when textScale changes ', () => {
  
    const initial_State = { app: { textScale: 20 } };
  
    const store = mockStore(initial_State);

    render(
  
      <Provider store={store}>
      
        <ResizableText h2>Dynamic Text for testing CODE RED</ResizableText>
      
      </Provider>
    
    );

    const textElement = screen.getByText(/Dynamic Text/i);
    
    expect(textElement).toHaveStyle('font-size: 38px'); 
  
  });

});
