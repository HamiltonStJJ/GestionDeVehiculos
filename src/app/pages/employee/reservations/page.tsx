"use client";
import { ConfirmationModal, DevolutionModal } from './RentalsModal';
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

const ReservationsPage = () => {
  interface Rental {
    _id: string;
    cliente?: {
      email?: string;
    };
    auto?: {
      placa?: string;
    };
    fechaInicio: string;
    fechaFin: string;
    estado: string;
  }

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rentalToAuthorize, setRentalToAuthorize] = useState<string | null>(
    null
  );
  const [devolucionDetails, setDevolucionDetails] = useState<any>(null);
  const [isDevolucionModalOpen, setIsDevolucionModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<{ _id: string } | null>(
    null
  );
  const [piezasRevisadas, setPiezasRevisadas] = useState([
    { pieza: "Motor", estado: "Correcto" },
    { pieza: "Parabrisas", estado: "Correcto" },
    { pieza: "Llantas", estado: "Correcto" },
    { pieza: "Frenos", estado: "Correcto" },
    { pieza: "Carrocería", estado: "Correcto" },
  ]);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await fetch("http://localhost:8080/rentals", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const normalizedData = data.map((rental: Rental) => ({
          ...rental,
          estado: rental.estado.toLowerCase(),
        }));
        setRentals(normalizedData);
      }
    } catch (error) {
      toast.error("Error al cargar las reservaciones");
    }
  };

  const handleAutorizar = async (rentalId: string) => {
    setRentalToAuthorize(rentalId);
    setShowConfirmModal(true);
  };

  const confirmAutorizar = async () => {
    if (!rentalToAuthorize) return;

    try {
      const response = await fetch(
        `http://localhost:8080/rentals/autorizar/${rentalToAuthorize}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        toast.success("Reservación autorizada exitosamente");
        fetchRentals();
      } else {
        toast.error("Error al autorizar la reservación");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
    setShowConfirmModal(false);
    setRentalToAuthorize(null);
  };

  const handleDevolucion = async () => {
    if (!selectedRental) return;

    try {
      const response = await fetch(
        `http://localhost:8080/rentals/devolucion/${selectedRental._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            piezasRevisadas: piezasRevisadas,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setDevolucionDetails(data);
        toast.success("Devolución procesada exitosamente");
        fetchRentals();
      } else {
        toast.error("Error al procesar la devolución");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  const handlePiezaEstadoChange = (index: number, estado: string) => {
    const newPiezas = [...piezasRevisadas];
    newPiezas[index] = { ...newPiezas[index], estado };
    setPiezasRevisadas(newPiezas);
  };

  const filteredRentals = rentals.filter(
    (rental) =>
      rental.cliente?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.auto?.placa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Reservaciones</h1>

      {/* Barra de búsqueda */}
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por email del cliente o placa del vehículo..."
            className="w-full p-3 pl-10 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tabla de reservaciones */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRentals.map((rental) => (
              <tr key={rental._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {rental.cliente?.email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {rental.auto?.placa || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(rental.fechaInicio).toLocaleDateString()} -
                    {new Date(rental.fechaFin).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      rental.estado.toLowerCase() === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : rental.estado.toLowerCase() === "en curso"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {rental.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {rental.estado === "pendiente" && (
                    <button
                      onClick={() => handleAutorizar(rental._id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Autorizar
                    </button>
                  )}
                  {rental.estado === "en curso" && (
                    <button
                      onClick={() => {
                        setSelectedRental(rental);
                        setIsDevolucionModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Devolución
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Devolución */}
      {isDevolucionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Proceso de Devolución</h2>
            <p className="mb-4">Revise el estado de las siguientes piezas:</p>

            <div className="space-y-4">
              {piezasRevisadas.map((pieza, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{pieza.pieza}</span>
                  <select
                    value={pieza.estado}
                    onChange={(e) =>
                      handlePiezaEstadoChange(index, e.target.value)
                    }
                    className="border rounded p-2"
                  >
                    <option value="Correcto">Correcto</option>
                    <option value="Dañado">Dañado</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsDevolucionModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDevolucion}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmar Devolución
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAutorizar}
      />

      <DevolutionModal
        details={devolucionDetails}
        onClose={() => {
          setDevolucionDetails(null);
          setIsDevolucionModalOpen(false);
        }}
      />
    </div>
  );
};

export default ReservationsPage;
