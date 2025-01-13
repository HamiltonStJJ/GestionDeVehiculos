"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Search, UserPlus, X } from "lucide-react";

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
  rol: string;
}

export default function EmployeeRentalPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [, setIsLoadingCustomers] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [brands, setBrands] = useState<string[]>([]);
const [years, setYears] = useState<number[]>([]);
const [colors, setColors] = useState<string[]>([]);
const [marcaFilter, setMarcaFilter] = useState<string>("");
const [anioFilter, setAnioFilter] = useState<number | null>(null);
const [colorFilter, setColorFilter] = useState<string>("");





   //    // Estados para el nuevo cliente
  const [newCustomer, setNewCustomer] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "temp123", // Contraseña temporal
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Obtener vehículos disponibles basado en fechas
 useEffect(() => {
  const fetchVehicles = async () => {
    if (!fechaInicio || !fechaFin) return;

    setIsLoadingVehicles(true);
    try {
      const response = await fetch(
        `${API_URL}/cars/estados?estado=Disponible&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar los vehículos.");
      }

      const data = await response.json();

      // Extraer valores únicos
      const uniqueBrands = Array.from(new Set(data.map((vehicle: Vehicle) => vehicle.marca)));
      const uniqueYears = Array.from(new Set<number>(data.map((vehicle: Vehicle) => vehicle.anio))).sort(
        (a, b) => b - a
      );
      const uniqueColors = Array.from(new Set(data.map((vehicle: Vehicle) => vehicle.color)));

      setVehicles(data); // Guardar vehículos
      setFilteredVehicles(data); // Establecer vehículos filtrados
      setBrands(uniqueBrands as string[]); // Guardar marcas únicas
      setYears(uniqueYears as number[]); // Guardar años únicos
      setColors(uniqueColors as string[]); // Guardar colores únicos
    } catch (error) {
      console.error("Error al cargar los vehículos:", error);
      toast.error("Error al cargar los vehículos.");
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  fetchVehicles();
}, [fechaInicio, fechaFin]);
  

   const handleConfirm = async () => {
    setIsLoading(true);
    try {
            await handleCreateRental({ preventDefault: () => {} } as React.FormEvent); // Llamar a la función de confirmación
    } finally {
      setIsLoading(false);
    }
  };

 

  // Obtener clientes
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al cargar los clientes.");
        }

        const data = await response.json();
        setCustomers(data.filter((c: Customer) => c.rol === "customer" || c.rol === "cliente"));
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        toast.error("Error al cargar los clientes.");
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

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
useEffect(() => {
  const applyFilters = () => {
    const filtered = vehicles.filter((vehicle) => {
      return (
        (searchTerm === "" || vehicle.nombre.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (marcaFilter === "" || vehicle.marca === marcaFilter) &&
        (anioFilter === null || vehicle.anio === anioFilter) &&
        (colorFilter === "" || vehicle.color.toLowerCase() === colorFilter.toLowerCase())
      );
    });

    setFilteredVehicles(filtered);
  };

  applyFilters();
}, [searchTerm, marcaFilter, anioFilter, colorFilter, vehicles]);



  // Calcular el total del alquiler
  const calculateTotal = () => {
    if (!fechaInicio || !fechaFin || !selectedVehicle) return 0;
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days * (selectedVehicle.tarifas[0]?.tarifa || 0);
  };
 

  // Crear alquiler
const handleCreateRental = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!selectedVehicle || !selectedCustomer || !fechaInicio || !fechaFin) {
    toast.error("Por favor, asegúrese de completar todos los campos.");
    return;
  }

  // Convertir las fechas al formato ISO 8601 con horas específicas
  const fechaInicioISO = new Date(fechaInicio);
  fechaInicioISO.setHours(0, 1, 0, 0); // Establecer a las 00:01
  const fechaFinISO = new Date(fechaFin);
  fechaFinISO.setHours(23, 59, 0, 0); // Establecer a las 23:59

  const fechaInicioISOFormatted = fechaInicioISO.toISOString();
  const fechaFinISOFormatted = fechaFinISO.toISOString();

  // Crear el objeto de datos para el alquiler
  const rentalData = {
    cliente: selectedCustomer._id,
    auto: selectedVehicle._id,
    fechaInicio: fechaInicioISOFormatted,
    fechaFin: fechaFinISOFormatted,
    tarifaAplicada: selectedVehicle.tarifas[0]?._id || "N/A",
  };

  try {
    const response = await fetch(`${API_URL}/rentals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rentalData),
      credentials: "include",
    });

    if (response.ok) {
      toast.success("Alquiler creado exitosamente, se ha enviado un correo al cliente para el pago inicial.");
      // Resetear formulario
      setSelectedVehicle(null);
      setSelectedCustomer(null);
      setFechaInicio("");
      setFechaFin("");
      setShowConfirmModal(false);
    } else {
      toast.error("Ya se encuentra alquilado dentro de las fechas seleccionadas.");
    }
  } catch (error) {
    console.error("Error al crear el alquiler:", error);
    toast.error("Error al crear el alquiler.");
  }
}; 

  // Renderizado condicional
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Alquileres</h1>

      {/* Paso 1: Selección de Fechas */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Seleccionar Fechas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fechaInicio" className="block mb-2">Fecha de Inicio</label>
            <input
              type="date"
              id="fechaInicio"
              className="p-2 border rounded w-full"
              value={fechaInicio}
              onChange={(e) => {
                const newFechaInicio = e.target.value;
                setFechaInicio(newFechaInicio);
                if (fechaFin && new Date(newFechaInicio) > new Date(fechaFin)) {
                  setFechaFin("");
                }
              }}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label htmlFor="fechaFin" className="block mb-2">Fecha de Fin</label>
            <input
              type="date"
              id="fechaFin"
              className="p-2 border rounded w-full"
              value={fechaFin}
              onChange={(e) => {
                const newFechaFin = e.target.value;
                if (new Date(newFechaFin) >= new Date(fechaInicio)) {
                  setFechaFin(newFechaFin);
                } else {
                  toast.error("La fecha de fin debe ser posterior a la fecha de inicio.");
                  setFechaFin("");
                }
              }}
              min={fechaInicio}
              disabled={!fechaInicio}
            />
          </div>
        </div>
      </div>

    {/* Paso 2: Filtros y Vehículos */}
    {fechaInicio && fechaFin && (
      <>
        {/* Filtros */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Filtrar Vehículos</h2>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <select
            value={marcaFilter}
            onChange={(e) => setMarcaFilter(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <select
            value={anioFilter !== null ? anioFilter : ""}
            onChange={(e) => setAnioFilter(e.target.value ? parseInt(e.target.value) : null)}
            className="p-2 border rounded w-full mb-2"
          >
            <option value="">Todos los años</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          >
            <option value="">Todos los colores</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de Vehículos */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Seleccionar Vehículo</h2>
          {isLoadingVehicles ? (
            <p>Cargando vehículos...</p>
          ) : filteredVehicles.length === 0 ? (
            <p>No hay vehículos disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedVehicle?._id === vehicle._id
                      ? "border-blue-500"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <img
                    src={vehicle.imagen}
                    alt={vehicle.nombre}
                    className="w-full h-48 object-cover mb-2"
                  />
                  <h3 className="font-semibold">{vehicle.nombre}</h3>
                  <p className="text-gray-600">{vehicle.marca} - {vehicle.modelo}</p>
                  <p className="text-green-600 font-semibold">
                    ${vehicle.tarifas[0]?.tarifa}/día
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )} 
      {/* Paso 3: Selección de Cliente */}
      {selectedVehicle && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Seleccionar Cliente</h2>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar cliente..."
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
                    selectedCustomer?._id === customer._id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <p className="font-semibold">{customer.nombre} {customer.apellido}</p>
                  <p className="text-sm text-gray-600">Cédula: {customer.cedula}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Paso 4: Confirmar y Crear Alquiler */}
      {selectedVehicle && selectedCustomer && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">5. Confirmar Alquiler</h2>
          <p className="text-xl font-bold">Total: ${calculateTotal()}</p>

              <button
                onClick={() => {
                  if (new Date(fechaFin) >= new Date(fechaInicio)) {
                    setShowConfirmModal(true);
                  } else {
                    alert(
                      "Verifica que las fechas seleccionadas sean válidas."
                    );
                  }
                }}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >

                Crear Alquiler
              </button>
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
                  <input type="text" className="w-full p-2 border rounded" value={newCustomer.cedula} onChange={(e) => setNewCustomer({ ...newCustomer, cedula: e.target.value })} required />
                </div>
                <div>
                  <label className="block mb-1">Nombre</label>
                  <input type="text" className="w-full p-2 border rounded" value={newCustomer.nombre} onChange={(e) => setNewCustomer({ ...newCustomer, nombre: e.target.value })} required />
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
                  <input type="email" className="w-full p-2 border rounded" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} required />
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
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
                <p className="text-gray-600">Cédula: {selectedCustomer?.cedula}</p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Detalles del Alquiler</h4>
                <p>Fecha de inicio: {new Date(fechaInicio).toLocaleDateString()}</p>
                <p>Fecha de fin: {new Date(fechaFin).toLocaleDateString()}</p>
                <p className="text-lg font-bold mt-2">Total: ${calculateTotal()}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                Cancelar
              </button>
              <button onClick={handleConfirm} className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
                              {isLoading ? (
                  <span className="loading loading-dots loading-mg" />
                ) : (
                  <>
                    Confirmar Alquiler
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    
    </div>
    
  );
}