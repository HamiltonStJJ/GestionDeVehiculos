import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/pages/auth/Login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
    
  };
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders the program name', () => {
    render(<LoginPage />);
    expect(screen.getByText(/flexidrive/i)).toBeInTheDocument();
  });

  it('renders the register and forgot password links with correct href', () => {
    render(<LoginPage />);
    expect(screen.getByText(/registrarse/i)).toHaveAttribute('href', 'pages/auth/register');
    expect(screen.getByText(/¿Olvidaste tu contraseña?/i)).toHaveAttribute('href', 'pages/auth/forgot-password');
  });

  it('renders the login form component', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/tucorreo@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  }); 
});
