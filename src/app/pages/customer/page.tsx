"use client";

import React, { useState, useEffect } from "react";

interface Vehicle {
  id: number;
  name: string;
  type: string;
  price: number;
  available: boolean;
  image: string;
  description: string;
  technicalDetails: string; // Nueva propiedad para detalles técnicos
  conditions: string; // Nueva propiedad para condiciones
}

const vehiclesData: Vehicle[] = [
  {
    id: 1,
    name: "Carro A",
    type: "SUV",
    price: 20000,
    available: true,
    image: "https://www.kia.com/content/dam/kwcms/gt/en/images/discover-kia/voice-search/parts-80-1.jpg",
    description: "Un SUV cómodo y espacioso ideal para familias.",
    technicalDetails: "Motor V6, 300 HP, 0-100 en 6.5s", // Detalles técnicos de ejemplo
    conditions: "Se requiere depósito y tarjeta de crédito al recoger el vehículo.", // Condiciones de ejemplo
  },
  {
    id: 2,
    name: "Carro B",
    type: "Sedán",
    price: 15000,
    available: false,
    image: "https://th.bing.com/th/id/OIP.Tsv4QM-Gepti9zC3Fyk8fgHaEo?rs=1&pid=ImgDetMain",
    description: "Económico y de gran rendimiento de combustible.",
    technicalDetails: "Motor I4, 150 HP, 0-100 en 9.0s", // Detalles técnicos de ejemplo
    conditions: "No se permiten mascotas en el vehículo.", // Condiciones de ejemplo
  },
  // Agrega más vehículos con descripciones adicionales...
];

const Customer: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehiclesData);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterPrice, setFilterPrice] = useState<number>(0);
  const [filterAvailability, setFilterAvailability] = useState<string>("All");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    applyFilters();
  }, [filterType, filterPrice, filterAvailability]);

  const applyFilters = () => {
    let filtered = vehicles;

    if (filterType !== "All") {
      filtered = filtered.filter((vehicle) => vehicle.type === filterType);
    }

    if (filterPrice > 0) {
      filtered = filtered.filter((vehicle) => vehicle.price <= filterPrice);
    }

    if (filterAvailability === "Available") {
      filtered = filtered.filter((vehicle) => vehicle.available);
    }

    setFilteredVehicles(filtered);
  };

  const openModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center text-black-900 mb-6">Catálogo de Vehículos</h1>

      {/* Filtros */}
      <div className="filters flex justify-around mb-6 p-4 bg-white rounded-lg shadow-md">
        <div>
          <label className="mr-2 font-bold">Tipo de Vehículo:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="All">Todos</option>
            <option value="SUV">SUV</option>
            <option value="Sedán">Sedán</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-bold">Precio Máximo:</label>
          <input
            type="string"
            value={filterPrice}
            onChange={(e) => setFilterPrice(Number(e.target.value))}
            className="p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="mr-2 font-bold">Disponibilidad:</label>
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="All">Todos</option>
            <option value="Available">Disponible</option>
          </select>
        </div>
      </div>

      {/* Lista de vehículos filtrados */}
      <div className="vehicles grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="vehicle-item relative bg-white p-4 rounded-lg shadow-md text-center"
            >
              {/* Pestaña "Más info" */}
              <button
                onClick={() => openModal(vehicle)}
                className="absolute top-0 right-0 m-2 bg-blue-500 text-white py-1 px-2 rounded-bl-lg shadow-lg hover:bg-blue-600"
              >
                Más info
              </button>

              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="vehicle-image w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-2">
                <h2 className="text-lg font-bold">{vehicle.name}</h2>
                <p className="text-m font-sans">Tipo: {vehicle.type}</p>
                <p className="text-m font-sans">Precio: ${vehicle.price}</p>
                <p
                  className={`text-sm font-bold ${
                    vehicle.available ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {vehicle.available ? "Disponible" : "Alquilado"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-vehicles text-center text-red-500 font-bold">
            No hay vehículos que coincidan con los filtros seleccionados.
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            {/* Botón "X" para cerrar el modal */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-red-600"
            >
              &times;
            </button>

             {/* Contenedor para centrar el nombre */}
  <div className="flex justify-center mb-4">
    <h2 className="text-2xl font-bold">{selectedVehicle.name}</h2>
  </div>

          
  
  {/* Contenedor para centrar la imagen */}
  <div className="flex justify-center mb-4">
    <img
      src={selectedVehicle.image}
      alt={selectedVehicle.name}
      className="w-96 h-56 object-cover rounded-lg"
    />
  </div>
  
            <hr className="my-2" />

            {/* Sección de Detalles Técnicos */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Detalles Técnicos</h3>
              <p className="mb-2"><strong>Tipo:</strong> {selectedVehicle.type}</p>
              <p className="mb-2"><strong>Precio:</strong> ${selectedVehicle.price}</p>
              <p className="mb-2"><strong>Disponibilidad:</strong> {selectedVehicle.available ? "Disponible" : "Alquilado"}</p>
              <p className="mb-2"><strong>Descripción:</strong> {selectedVehicle.description}</p>
              <p className="mb-2"><strong>Detalles técnicos:</strong> {selectedVehicle.technicalDetails}</p>
            </div>
            <hr className="my-4" />

            {/* Sección de Condiciones */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Condiciones</h3>
              <p>{selectedVehicle.conditions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
