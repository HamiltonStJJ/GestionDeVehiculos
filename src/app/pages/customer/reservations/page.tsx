"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/services/apiClient";
import { Rental } from "./Rental";

export default function Reservations() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [showInProgress, setShowInProgress] = useState(false);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData._id;
        console.log("User ID:", userId);
        if (!userId) {
          throw new Error("User ID is missing");
        }

        const response = await apiRequest(`/rentals/cliente/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        if (Array.isArray(response)) {
          setRentals(response);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };

    fetchRentals();
  }, []);

  const filteredRentals = showInProgress ? rentals.filter((rental) => rental.estado === "En Curso") : rentals;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reservaciones</h1>
      <div className="flex items-center mb-4">
        <label className="label cursor-pointer">
          <span className="label-text mr-2">En curso</span>
          <input type="checkbox" className="toggle toggle-primary" checked={showInProgress} onChange={() => setShowInProgress(!showInProgress)} />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRentals.length > 0 ? (
          filteredRentals.map((rental) => (
            <div key={rental._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img src={rental.auto.imagen} alt={rental.auto.nombre} width={500} height={300} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{rental.auto.nombre}</h2>
                <p>Marca: {rental.auto.marca}</p>
                <p>Modelo: {rental.auto.modelo}</p>
                <p>Año: {rental.auto.anio}</p>
                <p>Color: {rental.auto.color}</p>
                <p>Placa: {rental.auto.placa}</p>
                <p>Fecha de inicio: {new Date(rental.fechaInicio).toLocaleDateString()}</p>
                <p>Fecha de fin: {new Date(rental.fechaFin).toLocaleDateString()}</p>
                <p>Fecha de devolución: {rental.fechaDevolucion ? new Date(rental.fechaDevolucion).toLocaleDateString() : "N/A"}</p>
                <p>Estado: {rental.estado}</p>
                <p>Penalización por Tiempo: ${rental.penalizacion}</p>
                <p>Penalización por daños: ${rental.penalizacionPorDanios}</p>
                <p>Total: ${rental.total + rental.penalizacionPorDanios}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay reservaciones disponibles.</p>
        )}
      </div>
    </div>
  );
}
