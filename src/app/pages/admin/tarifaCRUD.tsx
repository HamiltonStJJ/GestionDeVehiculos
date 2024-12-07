"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Tarifa {
  _id: string;
  tipoVehiculo: string;
  duracion: string;
  temporada: string;
  tarifa: number;
}

const TarifaModal = ({
  isOpen,
  onClose,
  onSave,
  tarifaToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tarifa: Partial<Tarifa>, isEditing: boolean) => void;
  tarifaToEdit: Tarifa | null;
}) => {
  const [formData, setFormData] = useState<Partial<Tarifa>>({
    tipoVehiculo: "",
    duracion: "",
    temporada: "",
    tarifa: 0,
  });

  useEffect(() => {
    if (tarifaToEdit) {
      setFormData(tarifaToEdit);
    } else {
      setFormData({
        tipoVehiculo: "",
        duracion: "",
        temporada: "",
        tarifa: 0,
      });
    }
  }, [tarifaToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tarifa" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData, !!tarifaToEdit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {tarifaToEdit ? "Editar Tarifa" : "Agregar Tarifa"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tipo de Vehículo</label>
            <input
              type="text"
              name="tipoVehiculo"
              value={formData.tipoVehiculo || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Duración</label>
            <select
              name="duracion"
              value={formData.duracion || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Seleccione duración</option>
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
              <option value="Mensual">Mensual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Temporada</label>
            <select
              name="temporada"
              value={formData.temporada || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Seleccione temporada</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Tarifa</label>
            <input
              type="number"
              name="tarifa"
              value={formData.tarifa || 0}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {tarifaToEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TarifaCRUD = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarifaToEdit, setTarifaToEdit] = useState<Tarifa | null>(null);

  const fetchConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
  };


  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const response = await fetch("http://localhost:8080/rates",{
          method: "GET",
          ...fetchConfig
        });
        if (!response.ok) throw new Error("Failed to fetch tarifas");
        const data = await response.json();
        setTarifas(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTarifas();
  }, []);


  const handleSave = async (tarifa: Partial<Tarifa>, isEditing: boolean) => {
    try {
      if (isEditing) {
        // PUT request to update tarifa
        const response = await fetch(
          `http://localhost:8080/rates/${tarifa._id}`,
          {
            method: "PUT",
            ...fetchConfig,
            body: JSON.stringify(tarifa),
          }
        );
        if (!response.ok) throw new Error("Failed to update tarifa");
        setTarifas((prev) =>
          prev.map((t) => (t._id === tarifa._id ? { ...t, ...tarifa } : t))
        );
      } else {
        // POST request to create tarifa
        const response = await fetch("http://localhost:8080/rates", {
          method: "POST",
          ...fetchConfig,
          body: JSON.stringify(tarifa),
        });
        if (!response.ok) throw new Error("Failed to create tarifa");
        const newTarifa = await response.json();
        setTarifas((prev) => [...prev, newTarifa]);
      }
      setIsModalOpen(false);
      setTarifaToEdit(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/rates/${id}`, {
        method: "DELETE",
        ...fetchConfig,
      });
      if (!response.ok) throw new Error("Failed to delete tarifa");
      setTarifas((prev) => prev.filter((tarifa) => tarifa._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Agregar Tarifa
      </button>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="px-4 py-2">Tipo Vehículo</th>
            <th className="px-4 py-2">Duración</th>
            <th className="px-4 py-2">Temporada</th>
            <th className="px-4 py-2">Tarifa</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tarifas.map((tarifa) => (
            <tr key={tarifa._id}>
              <td className="px-4 py-2">{tarifa.tipoVehiculo}</td>
              <td className="px-4 py-2">{tarifa.duracion}</td>
              <td className="px-4 py-2">{tarifa.temporada}</td>
              <td className="px-4 py-2">${tarifa.tarifa}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => {
                    setTarifaToEdit(tarifa);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(tarifa._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TarifaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        tarifaToEdit={tarifaToEdit}
      />
    </div>
  );
};

export default TarifaCRUD;
