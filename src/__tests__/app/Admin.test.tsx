import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehiclePage from '@/app/pages/admin/page';
import '@testing-library/jest-dom';

// Mock de fetch para simular llamadas a la API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          _id: '673d3e9d7ce9d49221c1bdee',
          nombre: 'Vocho',
          marca: 'Volkswagen',
          modelo: 'Vocho',
          anio: 2020,
          color: 'Verde',
          imagen:
            'https://www.metroecuador.com.ec/resizer/cQSIocGREY2DF0Pf4Y-xllfG2lc=/arc-photo-metroworldnews/arc2-prod/public/NVX3BL5URJG2RERN4HBBISBEWY.jpg',
          placa: 'ASC225',
          kilometraje: 9000,
          tipoCombustible: 'Gasolina',
          transmision: 'Manual',
          numeroAsientos: 4,
          estado: 'Disponible',
          UltimoChequeo: '2024-09-15T00:00:00.000Z',
          tarifas: [
            {
              _id: '673d46cbb8b2ff81417b8df9',
              tipoVehiculo: 'Sedán',
              duracion: 'Diario',
              temporada: 'Alta',
              tarifa: 70,
              __v: 0,
            },
          ],
          mantenimientos: [
            {
              fecha: '2024-09-15T00:00:00.000Z',
              descripcion: 'Cambio de aceite',
              _id: '673d44aed0aab14a0e5530f5',
            },
          ],
          __v: 3,
        },
      ]),
  })
) as jest.Mock;


describe('VehiclePage Component Tests', () => {
  it('renders the page title', () => {
    render(<VehiclePage />);
    expect(screen.getByText(/Gestión de Vehículos/i)).toBeInTheDocument();
  });

  it('shows empty state message when no vehicles are present', async () => {
    // Simula que no hay vehículos en la respuesta del fetch
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<VehiclePage />);

    await waitFor(() => {
      expect(screen.getByText(/No hay vehículos disponibles/i)).toBeInTheDocument();
    });
  });

  it('fetches and displays vehicles', async () => {
    render(<VehiclePage />);

    await waitFor(() => {
      expect(screen.getByText(/Vocho/i)).toBeInTheDocument();
      expect(screen.getByText(/Volkswagen/i)).toBeInTheDocument();
    });
  });

  it('renders the add vehicle button', () => {
    render(<VehiclePage />);
    const addButton = screen.getByText(/Agregar Vehículo/i);
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();
  });

  it('updates the form state when inputs change', () => {
    const { getByLabelText } = render(<VehiclePage />);
    const nombreInput = getByLabelText(/Nombre/i);

    fireEvent.change(nombreInput, { target: { value: 'Nuevo Vehículo' } });
    expect(nombreInput).toHaveValue('Nuevo Vehículo');
  });

  it('renders the delete button for each vehicle', async () => {
    render(<VehiclePage />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByText(/Eliminar/i);
      expect(deleteButtons.length).toBeGreaterThan(0); // Al menos un botón debe estar presente
    });
  });
});
  