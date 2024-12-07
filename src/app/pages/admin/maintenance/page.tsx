"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Maintenance {
  _id: string;
  fecha: string;
  descripcion: string;
}

const MaintenancePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehiclePlaca = searchParams.get("vehiclePlaca"); 
  const vehicleId = searchParams.get("vehicleId"); 
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [formData, setFormData] = useState({ fecha: "", descripcion: "" });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const fetchConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
  };

  // Fetch existing maintenances for the vehicle
  useEffect(() => {
    const fetchMaintenances = async () => {
      console.log("VehiculoPlaca:", vehiclePlaca); // Ver si llega la placa
      if (!vehiclePlaca) return;
  
      try {
        console.log("Iniciando fetch para:", `http://localhost:8080/cars/maintenance/${vehiclePlaca}`);
        const response = await fetch(
          `http://localhost:8080/cars/maintenance/${vehiclePlaca}`,
          {
            method: "GET",
            ...fetchConfig,
          }
        );
  
        console.log("Respuesta status:", response.status); // Ver el status de la respuesta
        if (!response.ok) throw new Error("Failed to fetch maintenances");
        
        const data = await response.json();
        console.log("Datos recibidos:", data); // Ver los datos que llegan
        
        setMaintenances(data.mantenimientos);
      } catch (error) {
        console.error("Error detallado:", error);
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
        ? `http://localhost:8080/cars/maintenance/${vehicleId}`
        : `http://localhost:8080/cars/maintenance/${vehiclePlaca}`;

      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: JSON.stringify(formData),
        ...fetchConfig,
      });

      if (!response.ok) throw new Error("Failed to save maintenance record");

      const message = isEditing ? "Maintenance updated!" : "Maintenance added!";
      toast.success(message);

      // Refresh the list of maintenances
      const updatedResponse = await fetch(
        `http://localhost:8080/cars/maintenance/${vehiclePlaca}`,
        {
          method: "GET",
          ...fetchConfig,
        }
      );

      // En handleSubmit, actualiza esta parte:
      if (!updatedResponse.ok)
        throw new Error("Failed to fetch updated maintenances");
      const updatedData = await updatedResponse.json();
      setMaintenances(updatedData.mantenimientos); // Acceder al array dentro del objeto

      // Reset the form and editing state
      setFormData({ fecha: "", descripcion: "" });
      setIsEditing(null);
    } catch (error) {
      console.error("Error saving maintenance:", error);
      toast.error("Error saving maintenance");
    }
  };

  const handleDelete = async (id: string) => {
    if (!vehiclePlaca) return;

    try {
      const response = await fetch(
        `http://localhost:8080/cars/maintenance/${vehiclePlaca}/${id}`,
        {
          method: "DELETE",
          ...fetchConfig,
        }
      );

      if (!response.ok) throw new Error("Failed to delete maintenance record");
      toast.success("Maintenance deleted!");

      // Update the list of maintenances
      setMaintenances((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Error deleting maintenance:", error);
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
