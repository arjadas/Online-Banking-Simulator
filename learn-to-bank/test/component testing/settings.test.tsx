import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import Settings from '~/routes/app.settings'; 
import { useLoaderData, useActionData, useSubmit } from '@remix-run/react';
import { setTextScale } from '~/appSlice';

vi.mock('@remix-run/react', () => ({
 
  useLoaderData: vi.fn() as Mock,
 
  useActionData: vi.fn() as Mock,
 
  useSubmit: vi.fn() as Mock,

}));


const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({

  useDispatch: () => mockDispatch,

  useSelector: (fn: (state: any) => any) => fn({ app: { textScale: 15 } }),

}));

describe('Settings Component', () => {

  const mockUserData = {

    uid: 'user-782',

    first_name: 'Arja',

    last_name: 'Das',

    email: 'arja_das@example.com',

  };

  const mockActionData = { success: 'Settings Saved Successfully' };

  const mockSubmit = vi.fn();

  beforeEach(() => {

    (useLoaderData as Mock).mockReturnValue({ userData: mockUserData });

    (useActionData as Mock).mockReturnValue(mockActionData);

    (useSubmit as Mock).mockReturnValue(mockSubmit);

  });

 
  it('to chekc whether the settings page is rendered with user data and input fields', () => {

    render
    (
   
    <Settings>

    </Settings>
    
    );

    expect(screen.getByPlaceholderText('First Name')).toHaveValue(mockUserData.first_name);
  
    expect(screen.getByPlaceholderText('Last Name')).toHaveValue(mockUserData.last_name);
  
  });

  it('to submit the form to save the ettings', async () => {
   
    render  
    (
    
    <Settings>

    </Settings>
    
    );

    const saveButton = screen.getByRole('button', { name: /save settings/i });

    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: '18' } });

    fireEvent.click(saveButton);

    expect(mockDispatch).toHaveBeenCalledWith(setTextScale(18));

    await waitFor(() => {

      expect(mockSubmit).toHaveBeenCalled();

    });

  });

  it('to check whether reset password email is sent', () => {

    render    
    (
    
    <Settings>

    </Settings>
    
    );

    const resetButton = screen.getByRole('button', { name: /reset password via email/i });

    fireEvent.click(resetButton);

    expect(mockSubmit).toHaveBeenCalledWith(

      expect.any(FormData),

      { method: 'post' }

    );

  });

  it('to only enable delete button only after typing "DELETE"', () => {
  
    render    
    (
    
    <Settings>

    </Settings>
    
    );

    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));

    expect(screen.getByText(/type "delete" to enable delete button/i)).toBeInTheDocument();

    const deleteInput = screen.getByPlaceholderText('type here');

    fireEvent.change(deleteInput, { target: { value: 'DELETE' } });

    expect(screen.getByRole('button', { name: /delete account/i, hidden: true })).not.toBeDisabled();

  });

  it('to change the theme selection', () => {
 
    render
    (
    
    <Settings>

    </Settings>
    
    );

   const themeSelect = screen.getByRole('combobox');
  
   fireEvent.change(themeSelect, { target: { value: 'dark' } });

    expect(themeSelect).toHaveValue('dark');
  
  });

  it('to update preview text size based on slider change', () => {
   
    render
   (
    
    <Settings>

    </Settings>
    
    );

    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: 20 } });

    const previewText = screen.getByText('Preview');

    expect(previewText).toHaveStyle({ fontSize: '20px' });

  });

});
