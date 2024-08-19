import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from './login';
import '@testing-library/jest-dom';
const mockStore = configureStore([]);
const mockNavigate = vi.fn();


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  let store:any;

  beforeEach(() => {
    store = mockStore({
      auth: { role: null },
    });

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fakeToken', role: 'Admin' }),
      })
    ) as jest.Mock;
  });

  it('renders the login form correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    screen.debug();

    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
    const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password');
  });


  it('displays error messages for invalid form input', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      const emailError = screen.getByText(/Password must be at least 6 characters long/i);
      const passwordError = screen.getByText(/Invalid email address/i);
  
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });
  
});
