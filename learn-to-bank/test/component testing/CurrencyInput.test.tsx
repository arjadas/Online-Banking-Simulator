
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';

import { describe, it, expect, vi } from 'vitest';

import CurrencyInput from '../../app/components/CurrencyInput';

describe('CurrencyInput Component', () => {


  it('to check whether it is renderd without carshing', () => {
   
    render(<CurrencyInput amount="0" onAmountChange={() => {}} />);
   
    const input = screen.getByRole('textbox');
   
    expect(input).toBeInTheDocument();
  
  });

 
  it('to check whether the intial value is displayed correctly', () => {
  
    render(<CurrencyInput amount="1100" onAmountChange={() => {}} />);
  
    const input = screen.getByRole('textbox');
  
    expect(input).toHaveValue('1100');
  
  });

  
  it('to check whether onAmount is called when change happens', () => {
  
    const handleChange = vi.fn();
  
    render(<CurrencyInput amount="100" onAmountChange={handleChange} />);
  
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '200' } });
  
    expect(handleChange).toHaveBeenCalledWith('200');
  
  });

  
  it('to check the formating of the amount to currency is done correctly', () => {
  
    render(<CurrencyInput amount="952.28" onAmountChange={() => {}} />);
  
    const input = screen.getByRole('textbox');
  
    expect(input).toHaveValue('$952.28'); 
  
  });

});
