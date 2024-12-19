"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import VehicleSkeleton from "@/components/VehicleSkeleton";
import Sidebar from "@/components/SideBar";
import { toast } from "react-toastify";

interface Vehicle {
  _id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  placa: string;
  kilometrage: number;
  tipoCombustible: string;
  transmision: string;
  numeroPuertas: number;
  estado: string;
  UltimoChequeo: string;
  imagen: string;
  tarifas: {
    _id: string;
    tarifa: number;
  }[]; // Cambiado para reflejar el formato del array de tarifas
}


const Customer: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [filterBrand, setFilterBrand] = useState<string>("Todas");
  const [filterPrice, setFilterPrice] = useState<number>(0);
  const [filterAvailability, setFilterAvailability] = useState<string>("Todos");
  const [filterYear, setFilterYear] = useState<number | "Todos">("Todos");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const calcularTotal = () => {
    if (!fechaInicio || !fechaFin) return 0;

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Calcula la diferencia en días e incluye ambos días
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el último día

    return days > 0 ? days * (selectedVehicle?.tarifas[0]?.tarifa || 0) : 0;
  };

  

  const handleReservation = async (
    event: React.FormEvent,
    vehicle: Vehicle
  ) => {
    event.preventDefault();
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;

    if (!userData || !fechaInicio || !fechaFin) return;

    const reservationData = {
      cliente: userData._id,
      auto: vehicle._id,
      fechaInicio,
      fechaFin,
      tarifaAplicada: vehicle.tarifas[0]?._id|| "N/A",
      total: calcularTotal(),
    };

    try {
      const response = await fetch(`${API_URL}/rentals/cliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Reserva realizada con éxito."); 
        closeModal();
      } else {
        toast.error("Seleccione una fecha diferente.");
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert("Error de conexión.");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/cars`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data
          .filter((vehicle: Vehicle) => vehicle.estado !== "Eliminado")
          .map((vehicle: Vehicle) => ({
            ...vehicle,
            precio: vehicle.tarifas[0]?.tarifa || 0, // Toma el precio de la primera tarifa, o 0 si no hay tarifas
          }));

        setVehicles(filteredData);
        setFilteredVehicles(filteredData);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const uniqueBrands = Array.from(
    new Set(vehicles.map((vehicle) => vehicle.marca))
  );
  const uniqueYears = Array.from(
    new Set(vehicles.map((vehicle) => vehicle.anio))
  );

  useEffect(() => {
    let filtered = vehicles;

    if (filterBrand !== "Todas") {
      filtered = filtered.filter((vehicle) => vehicle.marca === filterBrand);
    }

    if (filterPrice > 0) {
      filtered = filtered.filter(
        (vehicle) => vehicle.tarifas[0]?.tarifa <= filterPrice
      );
    }

    if (filterAvailability === "Disponible") {
      filtered = filtered.filter((vehicle) => vehicle.estado === "Disponible");
    }

    if (filterYear !== "Todos") {
      filtered = filtered.filter((vehicle) => vehicle.anio === filterYear);
    }

    setFilteredVehicles(filtered);
  }, [filterBrand, filterPrice, filterAvailability, filterYear, vehicles]);

  const resetFilters = () => {
    setFilterBrand("Todas");
    setFilterPrice(0);
    setFilterAvailability("Todos");
    setFilterYear("Todos");
  };

  const openModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setIsSidebarOpen(false);
    setFechaInicio("");
    setFechaFin("");
    setShowConfirmModal(false);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Catálogo de Vehículos
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Explora los vehículos disponibles para alquilar
      </p>

      {/* Filtros */}
      <div className="filters flex flex-wrap justify-center gap-4 mb-8">
        <label htmlFor="filterBrand" className="sr-only">
          Marca
        </label>
        <select
          id="filterBrand"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="p-2 border rounded-lg text-gray-800 bg-white"
        >
          <option value="Todas">Todas las marcas</option>
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <input
          id="price-input"
          type="text"
          placeholder="Precio Máximo (ej. 20000)"
          value={filterPrice}
          onChange={(e) =>
            setFilterPrice(Number(e.target.value.replace(/\D/g, "")))
          }
          className="p-2 border rounded-lg text-gray-800 bg-white"
        />

        <select
          id="status-cmbx"
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="p-2 border rounded-lg text-gray-800 bg-white"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Alquilado">Alquilado</option>
        </select>

        <select
          id="year-cmbx"
          value={filterYear}
          onChange={(e) =>
            setFilterYear(
              e.target.value === "Todos" ? "Todos" : Number(e.target.value)
            )
          }
          className="p-2 border rounded-lg text-gray-800 bg-white"
        >
          <option value="Todos">Todos los años</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          id="clear-btn"
          onClick={resetFilters}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          Borrar Filtros
        </button>
      </div>

      {/* Lista de vehículos filtrados */}
      {isLoading ? (
        <VehicleSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white p-4 rounded-lg shadow-md text-center relative hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-lg font-bold text-gray-800">
                  {vehicle.nombre}
                </h2>
                <p className="text-sm text-gray-600">{vehicle.marca}</p>
                <img
                  src={vehicle.imagen}
                  alt={vehicle.nombre}
                  className="w-full h-40 object-cover rounded-lg my-4"
                />
                <p className="text-xl font-bold text-gray-900">
                  ${vehicle.tarifas[0]?.tarifa || 0} al día
                </p>
                <button
                  id="reservar-btn"
                  onClick={() => openModal(vehicle)}
                  className="bg-black text-white w-full py-2 mt-4 rounded-lg hover:bg-[#201E43] transition duration-200"
                >
                  Reservar Ahora
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-red-500 font-bold">
              No hay vehículos que coincidan con los filtros seleccionados.
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            {/* Botón para cerrar el modal */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-600"
            >
              &times;
            </button>

            {/* Detalles del vehículo */}
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              {selectedVehicle.nombre}
            </h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedVehicle.imagen}
                alt={selectedVehicle.nombre}
                className="w-96 h-56 object-cover rounded-lg"
              />
            </div>

            <div className="text-left mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Detalles</h3>
              <p className="text-gray-700">
                <strong>Marca:</strong> {selectedVehicle.marca}
              </p>
              <p className="text-gray-700">
                <strong>Modelo:</strong> {selectedVehicle.modelo}
              </p>
              <p className="text-gray-700">
                <strong>Modelo:</strong> {selectedVehicle.color}
              </p>
              <p className="text-gray-700">
                <strong>Precio por día:</strong> $
                {selectedVehicle.tarifas[0]?.tarifa || 0}
              </p>
            </div>

            {/* Botón para desplegar la sección de fechas */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              {isSidebarOpen ? "Ocultar Fechas" : "Seleccionar Fechas"}
            </button>

            {/* Sección de selección de fechas */}
            {isSidebarOpen && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Selecciona las fechas de tu reserva
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="fechaInicio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Establece la fecha mínima como hoy
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="fechaFin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-800">
                    Total: ${calcularTotal()} USD
                  </p>
                </div>

                {/* Botón para confirmar la reserva */}
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Confirmar Reserva
                </button>
              </div>
            )}

            {/* Modal de confirmación */}
            {showConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
                    Confirmar Reserva
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Estás a punto de reservar el vehículo{" "}
                    <strong>{selectedVehicle.nombre}</strong> del{" "}
                    <strong>{fechaInicio}</strong> al{" "}
                    <strong>{fechaFin}</strong>. El total será{" "}
                    <strong>${calcularTotal()}</strong>.
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={(event) =>
                        handleReservation(event, selectedVehicle!)
                      }
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Customer;
