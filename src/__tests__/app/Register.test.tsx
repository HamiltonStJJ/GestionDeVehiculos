import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/pages/auth/register/page';
import { register } from '@/services/authService';
import '@testing-library/jest-dom';

jest.mock('@/services/authService', () => ({
  register: jest.fn(),
}));

// Mock para window.alert
global.alert = jest.fn();

describe('RegisterPage & RegisterForm Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the program name and register header', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/flexidrive/i)).toBeInTheDocument();
    expect(screen.getByText(/registro de usuario/i)).toBeInTheDocument();
  });

  it('calls alert on successful registration', async () => {
    (register as jest.Mock).mockResolvedValue({});
    render(<RegisterPage />);

    // Simula el llenado del formulario
    fireEvent.change(screen.getByPlaceholderText(/cédula/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByPlaceholderText(/dirección/i), { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/tucorreo@example.com/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/registrarse/i));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Registro completado con éxito.");
    });
  });
  
  it('shows error message when registration fails', async () => {
    (register as jest.Mock).mockRejectedValue(new Error('Error en el registro'));
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/cédula/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByPlaceholderText(/dirección/i), { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/tucorreo@example.com/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByText(/registrarse/i));
    
    await waitFor(() => {
      expect(screen.getByText(/hubo un error en el registro/i)).toBeInTheDocument();
    });
  });
});
