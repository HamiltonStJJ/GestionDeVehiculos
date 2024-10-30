import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from '@/app/pages/auth/forgot-password/page';
import '@testing-library/jest-dom';

describe('ForgotPasswordPage', () => {
  it('renders the program name and header', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/flexidrive/i)).toBeInTheDocument();
    expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument();
  });

  it('renders the link to go back to login', () => {
    render(<ForgotPasswordPage />);
    const link = screen.getByText(/volver a iniciar sesión/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});