"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, X } from "lucide-react";
import { toast } from "react-toastify";

interface Vehicle {
  _id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  placa: string;
  imagen: string;
  estado: string;
  tarifas: {
    _id: string;
    tarifa: number;
  }[];
}

interface Customer {
  _id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
}

export default function EmployeeRentalPage() {
  // Estados para vehículos
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filterBrand, setFilterBrand] = useState("Todas");

  // Estados para clientes
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  // Estados para el nuevo cliente
  const [newCustomer, setNewCustomer] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "temp123", // Contraseña temporal
  });

  // Estados para fechas y cálculos
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Cargar vehículos
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${API_URL}/cars`, {
          credentials: "include",
        });
        const data = await response.json();
        const availableVehicles = data.filter(
          (v: Vehicle) => v.estado !== "Eliminado" && v.estado !== "Alquilado"
        );
        setVehicles(availableVehicles);
        setFilteredVehicles(availableVehicles);
      } catch (error) {
        console.error("Error loading vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  // Cargar clientes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al cargar los usuarios");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data); // Para debugging

        const filteredCustomers = data.filter(
          (user: any) => user.rol === "customer" || user.rol === "cliente"
        );
        console.log("Clientes filtrados:", filteredCustomers); // Para debugging

        setCustomers(filteredCustomers);
      } catch (error) {
        console.error("Error loading customers:", error);
      }
    };
    fetchCustomers();
  }, []);
  // Filtrar vehículos
  const filterVehicles = (brand: string) => {
    setFilterBrand(brand);
    if (brand === "Todas") {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter((v) => v.marca === brand));
    }
  };

  // Calcular precio total
  const calculateTotal = () => {
    if (!fechaInicio || !fechaFin || !selectedVehicle) return 0;
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days * (selectedVehicle.tarifas[0]?.tarifa || 0);
  };

  // Crear nuevo cliente
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers([...customers, data]);
        setSelectedCustomer(data);
        setShowCustomerModal(false);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  // Crear alquiler
  const handleCreateRental = async () => {
    if (!selectedVehicle || !selectedCustomer || !fechaInicio || !fechaFin)
      return;

    const rentalData = {
      cliente: selectedCustomer._id,
      auto: selectedVehicle._id,
      fechaInicio,
      fechaFin,
      tarifaAplicada: selectedVehicle.tarifas[0]?._id,
      total: calculateTotal(),
    };

    try {
      const response = await fetch(`${API_URL}/rentals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rentalData),
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Alquiler creado exitosamente"); 
        // Resetear formulario
        setSelectedVehicle(null);
        setSelectedCustomer(null);
        setFechaInicio("");
        setFechaFin("");
        setShowConfirmModal(false);
      }
    } catch (error) {
        toast.error("Error al crear el alquiler");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Alquileres</h1>

      {/* Sección de Vehículos */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Seleccionar Vehículo</h2>
        <div className="mb-4">
          <select
            className="p-2 border rounded"
            value={filterBrand}
            onChange={(e) => filterVehicles(e.target.value)}
          >
            <option value="Todas">Todas las marcas</option>
            {Array.from(new Set(vehicles.map((v) => v.marca))).map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedVehicle?._id === vehicle._id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-gray-400"
              }`}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <img
                src={vehicle.imagen}
                alt={vehicle.nombre}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h3 className="font-semibold">{vehicle.nombre}</h3>
              <p className="text-gray-600">
                {vehicle.marca} - {vehicle.modelo}
              </p>
              <p className="text-green-600 font-semibold">
                ${vehicle.tarifas[0]?.tarifa}/día
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Cliente */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Seleccionar Cliente</h2>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar cliente por cédula o nombre..."
              className="pl-10 p-2 border rounded w-full"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowCustomerModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
          >
            <UserPlus size={20} />
            Nuevo Cliente
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto border rounded">
          {customers
            .filter(
              (c) =>
                c.cedula.includes(customerSearch) ||
                c.nombre.toLowerCase().includes(customerSearch.toLowerCase()) ||
                c.apellido.toLowerCase().includes(customerSearch.toLowerCase())
            )
            .map((customer) => (
              <div
                key={customer._id}
                className={`p-3 border-b cursor-pointer ${
                  selectedCustomer?._id === customer._id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <p className="font-semibold">
                  {customer.nombre} {customer.apellido}
                </p>
                <p className="text-sm text-gray-600">
                  Cédula: {customer.cedula}
                </p>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Sección de Fechas */}
      {selectedVehicle && selectedCustomer && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Seleccionar Fechas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Fecha de Inicio</label>
              <input
                type="date"
                className="p-2 border rounded w-full"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block mb-2">Fecha de Fin</label>
              <input
                type="date"
                className="p-2 border rounded w-full"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min={fechaInicio}
              />
            </div>
          </div>

          {fechaInicio && fechaFin && (
            <div className="mt-4">
              <p className="text-xl font-bold">Total: ${calculateTotal()}</p>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Crear Alquiler
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de Nuevo Cliente */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Nuevo Cliente</h3>
              <button onClick={() => setShowCustomerModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Cédula</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newCustomer.cedula}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, cedula: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Nombre</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newCustomer.nombre}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Apellido</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newCustomer.apellido}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        apellido: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Dirección</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newCustomer.direccion}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        direccion: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded"
                    value={newCustomer.telefono}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        telefono: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Confirmación de Alquiler */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Confirmar Alquiler</h3>
              <button onClick={() => setShowConfirmModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Vehículo</h4>
                <p>{selectedVehicle?.nombre}</p>
                <p className="text-gray-600">
                  {selectedVehicle?.marca} - {selectedVehicle?.modelo}
                </p>
                <p className="text-gray-600">Placa: {selectedVehicle?.placa}</p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Cliente</h4>
                <p>
                  {selectedCustomer?.nombre} {selectedCustomer?.apellido}
                </p>
                <p className="text-gray-600">
                  Cédula: {selectedCustomer?.cedula}
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Detalles del Alquiler</h4>
                <p>
                  Fecha de inicio: {new Date(fechaInicio).toLocaleDateString()}
                </p>
                <p>Fecha de fin: {new Date(fechaFin).toLocaleDateString()}</p>
                <p className="text-lg font-bold mt-2">
                  Total: ${calculateTotal()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRental}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Confirmar Alquiler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
