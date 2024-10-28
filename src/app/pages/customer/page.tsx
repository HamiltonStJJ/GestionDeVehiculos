"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Vehicle {
  _id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  placa: string;
  precio: number;
  kilometrage: number;
  tipoCombustible: string;
  transmision: string;
  numeroPuertas: number;
  estado: string;
  UltimoChequeo: string;
  imagen: string;
}

const Customer: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [filterBrand, setFilterBrand] = useState<string>("Todas");
  const [filterPrice, setFilterPrice] = useState<number>(0);
  const [filterAvailability, setFilterAvailability] = useState<string>("Todos");
  const [filterYear, setFilterYear] = useState<number | "Todos">("Todos");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/cars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data);
        setFilteredVehicles(data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  }, []);

  const uniqueBrands = Array.from(new Set(vehicles.map((vehicle) => vehicle.marca)));
  const uniqueYears = Array.from(new Set(vehicles.map((vehicle) => vehicle.anio)));

  // Aplica los filtros automáticamente cuando cambian los valores
  useEffect(() => {
    let filtered = vehicles;

    if (filterBrand !== "Todas") {
      filtered = filtered.filter((vehicle) => vehicle.marca === filterBrand);
    }

    if (filterPrice > 0) {
      filtered = filtered.filter((vehicle) => vehicle.precio <= filterPrice);
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
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Catálogo de Vehículos
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Explora los vehículos disponibles para alquilar
      </p>

      {/* Filtros */}
      <div className="filters flex flex-wrap justify-center gap-4 mb-8">
        <select
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
          type="text"
          placeholder="Precio Máximo (ej. 20000)"
          value={filterPrice}
          onChange={(e) =>
            setFilterPrice(Number(e.target.value.replace(/\D/g, "")))
          }
          className="p-2 border rounded-lg text-gray-800 bg-white"
        />

        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="p-2 border rounded-lg text-gray-800 bg-white"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Alquilado">Alquilado</option>
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value === "Todos" ? "Todos" : Number(e.target.value))}
          className="p-2 border rounded-lg text-gray-800 bg-white"
        >
          <option value="Todos">Todos los años</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Botón de Restablecer Filtros */}
        <button
          onClick={resetFilters}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700transition duration-200"
        >
          Todos
        </button>
      </div>

      {/* Lista de vehículos filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
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
                ${vehicle.precio} al día
              </p>
              <button
                onClick={() => openModal(vehicle)}
                className="bg-black text-white w-full py-2 mt-4 rounded-lg hover:bg-[#201E43] transition duration-200"
              >
                Reservar Ahora
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-red-500 font-bold">
            No hay vehículos que coincidan con los filtros seleccionados.
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-600"
            >
              &times;
            </button>

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
                <strong>Año:</strong> {selectedVehicle.anio}
              </p>
              <p className="text-gray-700">
                <strong>Color:</strong> {selectedVehicle.color}
              </p>
              <p className="text-gray-700">
                <strong>Placa:</strong> {selectedVehicle.placa}
              </p>
              <p className="text-gray-700">
                <strong>Precio por día:</strong> ${selectedVehicle.precio}
              </p>
              <p className="text-gray-700">
                <strong>Kilometraje:</strong> {selectedVehicle.kilometrage} km
              </p>
              <p className="text-gray-700">
                <strong>Tipo de Combustible:</strong>{" "}
                {selectedVehicle.tipoCombustible}
              </p>
              <p className="text-gray-700">
                <strong>Transmisión:</strong> {selectedVehicle.transmision}
              </p>
              <p className="text-gray-700">
                <strong>Número de Puertas:</strong>{" "}
                {selectedVehicle.numeroPuertas}
              </p>
              <p className="text-gray-700">
                <strong>Estado:</strong> {selectedVehicle.estado}
              </p>
              <p className="text-gray-700">
                <strong>Último Chequeo:</strong>{" "}
                {new Date(selectedVehicle.UltimoChequeo).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
