"use client";

import React, { useState, useEffect } from "react";

interface Vehicle {
  id: number;
  name: string;
  type: string;
  price: number;
  available: boolean;
  image: string;
}

const vehiclesData: Vehicle[] = [
  {
    id: 1,
    name: "Carro A",
    type: "SUV",
    price: 20000,
    available: true,
    image:
      "https://www.kia.com/content/dam/kwcms/gt/en/images/discover-kia/voice-search/parts-80-1.jpg",
  },
  {
    id: 2,
    name: "Carro B",
    type: "Sedán",
    price: 15000,
    available: false,
    image:
      "https://th.bing.com/th/id/OIP.Tsv4QM-Gepti9zC3Fyk8fgHaEo?rs=1&pid=ImgDetMain",
  },
  {
    id: 3,
    name: "Carro A",
    type: "SUV",
    price: 20000,
    available: true,
    image:
      "https://www.kia.com/content/dam/kwcms/gt/en/images/discover-kia/voice-search/parts-80-1.jpg",
  },
  {
    id: 4,
    name: "Carro B",
    type: "Sedán",
    price: 15000,
    available: false,
    image:
      "https://th.bing.com/th/id/OIP.Tsv4QM-Gepti9zC3Fyk8fgHaEo?rs=1&pid=ImgDetMain",
  },
  {
    id: 5,
    name: "Carro A",
    type: "SUV",
    price: 20000,
    available: true,
    image:
      "https://www.kia.com/content/dam/kwcms/gt/en/images/discover-kia/voice-search/parts-80-1.jpg",
  },
  {
    id: 6,
    name: "Carro B",
    type: "Sedán",
    price: 15000,
    available: false,
    image:
      "https://th.bing.com/th/id/OIP.Tsv4QM-Gepti9zC3Fyk8fgHaEo?rs=1&pid=ImgDetMain",
  },
  // Agrega más vehículos...
];

const Customer: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData);
  const [filteredVehicles, setFilteredVehicles] =
    useState<Vehicle[]>(vehiclesData);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterPrice, setFilterPrice] = useState<number>(0);
  const [filterAvailability, setFilterAvailability] = useState<string>("All");

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

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center text-black-900 mb-6">
        Catálogo de Vehículos
      </h1>

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
            type="number"
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
      <div className="vehicles grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="vehicle-item bg-white p-4 rounded-lg shadow-md text-center"
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="vehicle-image w-full h-48 object-cover rounded-lg mb-4"
              />
              {/* Contenedor de texto con separación uniforme */}
              <div className="space-y-2">
                {" "}
                {/* Agrega separación vertical entre los textos */}
                <h2 className="text-lg font-bold">{vehicle.name}</h2>
                <p className="text-m font-sans">Tipo: {vehicle.type}</p>
                <p className="text-m font-sans">Precio: ${vehicle.price}</p>
                <p
                  className={`text-sm font-bold ${
                    vehicle.available ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {vehicle.available ? "Disponible" : "No Disponible"}
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
    </div>
  );
};

export default Customer;
