import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/pages/auth/register/page';
import { register } from '@/services/authService';
import '@testing-library/jest-dom';

jest.mock('@/services/authService', () => ({
  register: jest.fn(),
}));

global.alert = jest.fn();

describe('RegisterPage - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the program name and register header', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/flexidrive/i)).toBeInTheDocument();
    expect(screen.getByText(/registro de usuario/i)).toBeInTheDocument();
  });

  it('submits form successfully and shows success alert', async () => {
    // Simula una respuesta exitosa
    (register as jest.Mock).mockResolvedValue({});
    
    render(<RegisterPage />);

    // Completa el formulario
    fireEvent.change(screen.getByPlaceholderText(/cédula/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByPlaceholderText(/dirección/i), { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/tucorreo@example.com/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });

    // Envía el formulario
    fireEvent.click(screen.getByText(/registrarse/i));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Registro completado con éxito.");
    });
  });

  it('displays error message when registration fails', async () => {
    // Simula una respuesta de error
    (register as jest.Mock).mockRejectedValue(new Error('Error en el registro'));
    
    render(<RegisterPage />);

    // Completa el formulario
    fireEvent.change(screen.getByPlaceholderText(/cédula/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByPlaceholderText(/dirección/i), { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/tucorreo@example.com/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });

    // Envía el formulario
    fireEvent.click(screen.getByText(/registrarse/i));

    await waitFor(() => {
      expect(screen.getByText(/hubo un error en el registro/i)).toBeInTheDocument();
    });
  });
});
