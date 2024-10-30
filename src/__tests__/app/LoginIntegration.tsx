import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/pages/auth/Login/page';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import LoginForm from '@/app/pages/auth/Login/LoginForm';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/authService');

describe('LoginPage - Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('logs in successfully and redirects to customer', async () => {
    (login as jest.Mock).mockResolvedValue({ success: true });

    render(<LoginPage />);

    // Llenar el formulario de inicio de sesión
    await userEvent.type(screen.getByPlaceholderText(/tucorreo@example.com/i), 'usuario@example.com');
    await userEvent.type(screen.getByPlaceholderText(/••••••••/i), 'password123');

    // Enviar formulario
    await userEvent.click(screen.getByText(/ingresar/i));

    // Esperar redirección
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('pages/customer');
    });
  });

  it('shows error message when login fails', async () => {
    // Forzar que la función login rechace la promesa
    (login as jest.Mock).mockRejectedValue(new Error('Credenciales incorrectas'));

    render(<LoginPage />);

    // Llenar el formulario de inicio de sesión
    await userEvent.type(screen.getByPlaceholderText(/tucorreo@example.com/i), 'usuario@example.com');
    await userEvent.type(screen.getByPlaceholderText(/••••••••/i), 'password123');

    // Enviar formulario
    await userEvent.click(screen.getByText(/ingresar/i));
    
    render(<LoginForm />);
    // Verificar que el mensaje de error aparece
    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument();
  });
});
