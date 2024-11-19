import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Customer from '@/app/pages/customer/page';
import { useRouter } from 'next/navigation';

// Mock de next/navigation y de fetch
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('Customer - Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mockear fetch para simular respuesta de la API
    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        {
          _id: '1',
          nombre: 'Toyota Corolla',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          color: 'Blanco',
          placa: 'XYZ-123',
          precio: 25000,
          kilometrage: 15000,
          tipoCombustible: 'Gasolina',
          transmision: 'Automático',
          numeroPuertas: 4,
          estado: 'Disponible',
          UltimoChequeo: '2023-01-10',
          imagen: '/path/to/image',
        },
      ]),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the customer page with vehicles', async () => {
    render(<Customer />);

    expect(screen.getByText(/Catálogo de Vehículos/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Explora los vehículos disponibles para alquilar/i)
    ).toBeInTheDocument();

    // Esperar a que se cargue el vehículo
    await waitFor(() => {
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    });
  });

  it('filters vehicles by brand', async () => {
    render(<Customer />);

    // Esperar a que los vehículos se carguen
    await waitFor(() => {
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    });

    // Aplicar filtro de marca
    fireEvent.change(screen.getByRole('combobox', { name: /marca/i }), {
      target: { value: 'Toyota' },
    });

    await waitFor(() => {
      expect(screen.queryByText(/Toyota Corolla/i)).toBeInTheDocument();
    });
  });

  it('resets filters when "Todos" is clicked', async () => {
    render(<Customer />);

    await waitFor(() => {
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    });

    // Cambiar filtro y luego resetear
    fireEvent.change(screen.getByRole('combobox', { name: /marca/i }), {
      target: { value: 'Toyota' },
    });

    fireEvent.click(screen.getByText(/Borrar Filtros/i));

    await waitFor(() => {
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    });
  });

  it('logs out and redirects to the home page', async () => {
    render(<Customer />);

    // Simular el cierre de sesión
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    fireEvent.click(screen.getByText(/Cerrar Sesión/i));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });
});
