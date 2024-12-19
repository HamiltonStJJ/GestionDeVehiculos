import React from "react";
import { Search, RefreshCw, Calendar, Car, User } from "lucide-react";

// Define interface for the client details
interface Client {
  email?: string;
  cedula?: string;
  apellido?: string;
}

interface Vehicle {
  placa?: string;
}

interface Rental {
  _id: string;
  cliente?: Client;
  auto?: Vehicle;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface RentalsTableProps {
  rentals: Rental[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAuthorize: (id: string) => void;
  onDevolucion: (rental: { _id: string }) => void;
}

const RentalsTable: React.FC<RentalsTableProps> = ({
  rentals,
  searchTerm,
  onSearchChange,
  onAuthorize,
  onDevolucion,
}) => {
  const filteredRentals = rentals.filter(
    (rental) =>
      rental.cliente?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.auto?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.cliente?.cedula
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      rental.cliente?.apellido?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="relative">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Buscar por email, placa, cédula o apellido..."
            className="w-full p-4 pl-12 pr-10 border-2 border-gray-200 rounded-xl 
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                 transition-all duration-200 outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-4 text-gray-400" size={20} />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-4 p-1 hover:bg-gray-100 rounded-full
                 transition-colors duration-200"
            >
              <RefreshCw size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>
      {/* Enhanced Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="group px-6 py-4 text-left">
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <User size={16} />
                  <span>Información del Cliente</span>
                </div>
              </th>
              <th className="group px-6 py-4 text-left">
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Car size={16} />
                  <span>Vehículo</span>
                </div>
              </th>
              <th className="group px-6 py-4 text-left">
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Calendar size={16} />
                  <span>Fechas</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredRentals.map((rental) => (
              <tr
                key={rental._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {rental.cliente?.email || "N/A"}
                    </span>
                    <span className="text-sm text-gray-500">
                      Cédula: {rental.cliente?.cedula || "N/A"}
                    </span>
                    <span className="text-sm text-gray-500">
                      Apellido: {rental.cliente?.apellido || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {rental.auto?.placa || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm text-gray-900">
                    <span className="font-medium">Inicio:</span>
                    <span>
                      {new Date(rental.fechaInicio).toLocaleDateString()}
                    </span>
                    <span className="font-medium mt-1">Fin:</span>
                    <span>
                      {new Date(rental.fechaFin).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full
                    ${
                      rental.estado.toLowerCase() === "pendiente"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : rental.estado.toLowerCase() === "en curso"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {rental.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    {rental.estado === "pendiente" && (
                      <button
                        onClick={() => onAuthorize(rental._id)}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg
                                 hover:bg-green-200 transition-colors duration-200
                                 flex items-center space-x-1"
                      >
                        Autorizar
                      </button>
                    )}
                    {rental.estado === "en curso" && (
                      <button
                        onClick={() => onDevolucion(rental)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg
                                 hover:bg-blue-200 transition-colors duration-200
                                 flex items-center space-x-1"
                      >
                        Devolución
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron reservaciones que coincidan con la búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalsTable;
