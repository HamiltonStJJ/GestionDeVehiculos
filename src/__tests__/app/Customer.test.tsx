import { render, screen, waitFor, act } from '@testing-library/react';
import Customer from '@/app/pages/customer/page';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock de fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        _id: '1',
        nombre: 'Toyota Corolla',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2022,
        color: 'Rojo',
        precio: 5000,
        estado: 'Disponible',
        imagen: 'https://www.toyota.com.ec/admin/sites/default/files/2022-07/corolla%20sedan-potencia.png',
      },
    ]),
  })
) as jest.Mock;

describe('Customer Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title and description', async () => {
    await act(async () => {
      render(<Customer />);
    });

    // Asegúrate de que el título y la descripción estén en el documento
    expect(screen.getByText(/Catálogo de Vehículos/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Explora los vehículos disponibles para alquilar/i)
    ).toBeInTheDocument();
  });

  it('fetches and displays vehicles', async () => {
    await act(async () => {
      render(<Customer />);
    });

    // Espera que los datos de vehículos se muestren correctamente
    await waitFor(() => {
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    });
  });
});
