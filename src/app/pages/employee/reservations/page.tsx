"use client";
import { ConfirmationModal, DevolutionModal } from "./RentalsModal";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import RentalsTable from "./RentalsTable";

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
  const [rentalToAuthorize, setRentalToAuthorize] = useState<string | null>(null);
  const [devolucionDetails, setDevolucionDetails] = useState<any>(null);
  const [isDevolucionModalOpen, setIsDevolucionModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<{ _id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await handleDevolucion(); // Llamar a la función de confirmación
    } finally {
      setIsLoading(false);
    }
  };


  const fetchRentals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rentals`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rentals/autorizar/${rentalToAuthorize}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (response.ok) {
        toast.success("Correo de confirmación enviado al cliente");
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rentals/devolucion/${selectedRental._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          piezasRevisadas: piezasRevisadas,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const rentalDetails = data.rentalDetails;
        setDevolucionDetails(rentalDetails);
        toast.success("Devolución procesada exitosamente. Se envió un correo al cliente con el enlace de pago.");
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

  const filteredRentals = rentals.filter((rental) => rental.cliente?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || rental.auto?.placa?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Reservaciones</h1>

      <RentalsTable
        rentals={rentals}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAuthorize={handleAutorizar}
        onDevolucion={(rental) => {
          setSelectedRental(rental);
          setIsDevolucionModalOpen(true);
        }}
      />
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
                  <select value={pieza.estado} onChange={(e) => handlePiezaEstadoChange(index, e.target.value)} className="border rounded p-2">
                    <option value="Correcto">Correcto</option>
                    <option value="Dañado">Dañado</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setIsDevolucionModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancelar
              </button>
           <button
  onClick={handleConfirm}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center w-48"
>
  {isLoading ? (
    <span className="loading loading-dots loading-mg" />
  ) : (
    "Confirmar Devolución"
  )}
</button>

           </div>
          </div>
        </div>
      )}
      <ConfirmationModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={confirmAutorizar} />

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
