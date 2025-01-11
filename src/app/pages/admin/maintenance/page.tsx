"use client";


import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Maintenance {
  _id: string;
  fecha: string;
  descripcion: string;
}

const MaintenancePage = () => {
  const [vehiclePlaca, setVehiclePlaca] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [formData, setFormData] = useState({ fecha: "", descripcion: "" });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
  };

  // Fetch vehicle data from query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const vehiclePlacaParam = searchParams.get("vehiclePlaca");
    const vehicleIdParam = searchParams.get("vehicleId");

    if (vehiclePlacaParam) setVehiclePlaca(vehiclePlacaParam);
    if (vehicleIdParam) setVehicleId(vehicleIdParam);
  }, []);

  // Fetch existing maintenances for the vehicle
  useEffect(() => {
    const fetchMaintenances = async () => {
      if (!vehiclePlaca) return;

      try {
        const response = await fetch(
          `${API_URL}/cars/maintenance/${vehiclePlaca}`,
          {
            method: "GET",
            ...fetchConfig,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch maintenances");

        const data = await response.json();
        setMaintenances(data.mantenimientos);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching maintenances");
      }
    };

    fetchMaintenances();
  }, [vehiclePlaca]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vehiclePlaca) return;

    try {
      const url = isEditing
        ? `${API_URL}/cars/maintenance/${vehicleId}`
        : `${API_URL}/cars/maintenance/${vehiclePlaca}`;

      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: JSON.stringify(formData),
        ...fetchConfig,
      });

      if (!response.ok) throw new Error("Failed to save maintenance record");

      toast.success(
        isEditing ? "Maintenance updated!" : "Maintenance added!"
      );

      // Refresh the list of maintenances
      const updatedResponse = await fetch(
        `${API_URL}/cars/maintenance/${vehiclePlaca}`,
        {
          method: "GET",
          ...fetchConfig,
        }
      );

      if (!updatedResponse.ok)
        throw new Error("Failed to fetch updated maintenances");

      const updatedData = await updatedResponse.json();
      setMaintenances(updatedData.mantenimientos);

      setFormData({ fecha: "", descripcion: "" });
      setIsEditing(null);
    } catch (error) {
      console.error(error);
      toast.error("Error saving maintenance");
    }
  };

  const handleDelete = async (id: string) => {
    if (!vehiclePlaca) return;

    try {
      const response = await fetch(
        `${API_URL}/cars/maintenance/${vehiclePlaca}/${id}`,
        {
          method: "DELETE",
          ...fetchConfig,
        }
      );

      if (!response.ok) throw new Error("Failed to delete maintenance record");

      toast.success("Maintenance deleted!");
      setMaintenances((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Error deleting maintenance");
    }
  };

  const handleEdit = (maintenance: Maintenance) => {
    setFormData({
      fecha: maintenance.fecha.split("T")[0],
      descripcion: maintenance.descripcion,
    });
    setIsEditing(maintenance._id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Mantenimientos del Vehículo {vehiclePlaca}
      </h1>

      {/* Maintenance Form */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Editar Mantenimiento" : "Agregar Mantenimiento"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* Maintenance List */}
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maintenances.map((maintenance) => (
              <tr key={maintenance._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {maintenance.fecha.split("T")[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {maintenance.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(maintenance)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(maintenance._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenancePage;
