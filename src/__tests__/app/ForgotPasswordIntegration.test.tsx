// tests/integration/ForgotPasswordForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordForm from '@/app/pages/auth/forgot-password/ForgotPasswordForm';
import { requestPasswordReset } from '@/services/authService';
import '@testing-library/jest-dom';

jest.mock('@/services/authService', () => ({
  requestPasswordReset: jest.fn(),
}));

describe('ForgotPasswordForm - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input field and button', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByPlaceholderText(/tucorreo@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/recuperar ahora/i)).toBeInTheDocument();
  });

  it('shows success message when password reset is successful', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValue({});
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(/tucorreo@example.com/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/recuperar ahora/i));

    await waitFor(() => {
      expect(screen.getByText(/correo de recuperación enviado con éxito/i)).toBeInTheDocument();
    });
  });

  it('shows error message when password reset fails', async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValue(new Error('Error al enviar el correo'));
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(/tucorreo@example.com/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/recuperar ahora/i));

    await waitFor(() => {
      expect(screen.getByText(/error al enviar el correo de recuperación/i)).toBeInTheDocument();
    });
  });
});
