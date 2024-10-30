import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/pages/auth/Login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  it('renders the login', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    });

    render(<LoginPage />);
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
  });
});
