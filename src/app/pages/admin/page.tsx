"use client";
import { toast } from "react-toastify";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

import { useRouter } from "next/navigation";

import ImageUploader from "@/components/ImageUploader";

interface Tarifa {
  _id: string;
  tipoVehiculo: string;
  duracion: string;
  temporada: string;
  tarifa: number;
}

interface Mantenimiento {
  fecha: string;
  descripcion: string;
  _id: string;
}

interface Vehicle {
  _id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  imagen: string;
  placa: string;
  kilometraje: number;
  tipoCombustible: string;
  transmision: string;
  numeroAsientos: number;
  estado: string;
  UltimoChequeo: string;
  tarifas: Tarifa[];
  mantenimientos: Mantenimiento[];
}

interface FormData extends Omit<Vehicle, "_id" | "tarifas"> {
  tarifas: string[]; // Cambiado para aceptar array de IDs
  mantenimientos: Mantenimiento[];
}

const FormInput = ({
  label,
  name,
  type = "text",
  options = null,
  value,
  onChange,
  disabled = false,
  id,
}: {
  label: string;
  name: string;
  type?: string;
  options?: string[] | null;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  id?: string;
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
    if (type === "text" && name !== "imagen" && /[^a-zA-Z0-9\s-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  if (options) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">{label}</label>
        <select id={id} name={name} value={value} onChange={onChange} disabled={disabled} className="w-full border rounded p-2" required>
          <option value="">Seleccione {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <input id={id} type={type} name={name} value={value || ""} onChange={onChange} onKeyPress={handleKeyPress} disabled={disabled} className="w-full border rounded p-2" required />
    </div>
  );
};
const TarifaSelect = ({ tarifas, selectedTarifas, onChange }: { tarifas: Tarifa[]; selectedTarifas: string[]; onChange: (selectedIds: string[]) => void; id?: string }) => {
  const handleTarifaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    onChange(selectedOptions);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Tarifas</label>
      {/*<div><TarifaModal /></div>*/}
      <select
        id="tarifas"
        multiple
        className="w-full border rounded p-2"
        onChange={handleTarifaChange}
        value={selectedTarifas || []} // Aseguramos que siempre haya un array
      >
        {tarifas.map((tarifa) => (
          <option key={tarifa._id} value={tarifa._id}>
            {`${tarifa.tipoVehiculo} - ${tarifa.duracion} - ${tarifa.temporada} - $${tarifa.tarifa}`}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500">Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples tarifas</p>
    </div>
  );
};

//Modal
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto p-6 md:p-8">
        <button id="close-modal" className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none" onClick={onClose} aria-label="Close Modal">
          ✕
        </button>
        <div className="overflow-y-auto max-h-[90vh]">{children}</div>
      </div>
    </div>
  );
};

const VehiclePage = () => {
  // Datos predefinidos
const brandModels: { [key: string]: string[] } = {
  Volkswagen: ["Golf", "Jetta", "Polo", "Tiguan", "Passat"],
  Toyota: ["Corolla", "Camry", "Yaris", "RAV4", "Hilux"],
  Ford: ["Focus", "Fiesta", "Explorer", "Mustang", "Escape"],
  Chevrolet: ["Spark", "Cruze", "Malibu", "Tahoe", "Silverado"],
  Honda: ["Civic", "Accord", "Fit", "CR-V", "Pilot"],
  Nissan: ["Sentra", "Altima", "Versa", "Rogue", "Murano"],
  BMW: ["3 Series", "5 Series", "X1", "X3", "X5"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5"],
  Mercedes: ["C-Class", "E-Class", "GLA", "GLC", "GLE"],
  Hyundai: ["Elantra", "Tucson", "Santa Fe", "Kona", "Sonata"],
  Kia: ["Rio", "Seltos", "Sportage", "Sorento", "Telluride"],
};
const brands = [...Object.keys(brandModels)];
  const colors = ["Verde", "Blanco", "Negro", "Azul", "Rojo", "Plata"];
  const fuelTypes = ["Gasolina", "Diesel", "Híbrido", "Eléctrico"];
  const transmissions = ["Manual", "Automatica"];
  const statuses = ["Disponible", "Alquilado"];
  const router = useRouter();

  // Estados
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
   const [activeTab, setActiveTab] = useState<"activos" | "eliminados">("activos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [availableTarifas, setAvailableTarifas] = useState<Tarifa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
const [, setCustomBrand] = useState("");
const [availableModels, setAvailableModels] = useState<string[]>([]);
 const [searchTerm, setSearchTerm] = useState("");
const [,setCustomModel] = useState("");


  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const filteredVehicles = vehicles.filter((vehicle) =>
    activeTab === "activos"
      ? vehicle.estado !== "Eliminado"
      : vehicle.estado === "Eliminado"
  );

  // Filtrar por búsqueda
  const searchedVehicles = filteredVehicles.filter((vehicle) =>
    `${vehicle.placa} ${vehicle.marca} ${vehicle.modelo}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Cambiar pestaña activa
  const handleTabChange = (tab: "activos" | "eliminados") => {
    setActiveTab(tab);
  };
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    marca: "",
    modelo: "",
    anio: 2024,
    color: "",
    imagen: "",
    placa: "",
    kilometraje: 0,
    tipoCombustible: "",
    transmision: "",
    numeroAsientos: 4,
    estado: "Disponible",
    UltimoChequeo: new Date().toISOString().split("T")[0], // Formato yyyy-MM-dd
    tarifas: [],
    mantenimientos: [],
  });
  const fetchConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSelectedBrand("");
    setCustomBrand("");
    resetForm();

  };
  const handleBrandChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const brand = e.target.value;
  setSelectedBrand(brand);
  setCustomBrand("");
  setCustomModel("");

  if (brand === "Otro") {
    setAvailableModels([]);
    setFormData((prev) => ({ ...prev, marca: "", modelo: "" }));
  } else {
    setAvailableModels(brandModels[brand] || []);
    setFormData((prev) => ({ ...prev, marca: brand, modelo: "" }));
  }
};

const handleModelChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const model = e.target.value;
  setCustomModel("");

  if (model === "Otro") {
    setFormData((prev) => ({ ...prev, modelo: "" }));
  } else {
    setFormData((prev) => ({ ...prev, modelo: model }));
  }
};

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${API_URL}/cars/`, {
          method: "GET",
          ...fetchConfig,
        });
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch tarifas
  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const response = await fetch(`${API_URL}/rates/`, {
          method: "GET",
          ...fetchConfig,
        });
        if (!response.ok) throw new Error("Failed to fetch rates");
        const data = await response.json();
        setAvailableTarifas(data);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchTarifas();
  }, []);

  const handleTarifasChange = (selectedIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tarifas: selectedIds, // Solo guardamos los IDs
    }));
  };

  // Manejadores de eventos

const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    let parsedValue = value === "" ? 0 : Number(value);

    // Evitar valores negativos para campos específicos
    if (["anio", "kilometraje", "numeroAsientos"].includes(name) && parsedValue < 0) {
      parsedValue = 0; // Fuerza a 0 si el valor es negativo
    }

    return {
      ...prev,
      [name]: ["anio", "kilometraje", "numeroAsientos"].includes(name)
        ? parsedValue // Asegura que solo se usen valores numéricos no negativos
        : value, // Mantiene otros valores textuales
    };
  });
};
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(formData.imagen == ""){
      toast.error("Por favor, sube una imagen del vehículo.");
      return;
    }
    try {
      // Prepare the body data
      const bodyData = {
        ...formData,
        UltimoChequeo: new Date(formData.UltimoChequeo).toISOString(),
        tarifas: formData.tarifas,
        mantenimientos: formData.mantenimientos || [],
      };

      let response;

      if (editingId) {
        // Only send the update request if there are actual changes
        const existingVehicle = vehicles.find((vehicle) => vehicle._id === editingId);
        const hasChanges = JSON.stringify(existingVehicle) !== JSON.stringify({ ...existingVehicle, ...bodyData });

        if (!hasChanges) {
          toast.info("No changes detected.");
          setIsModalOpen(false); // Close modal since there's nothing to do
          return;
        }

        // PUT request to update the vehicle
        response = await fetch(`${API_URL}/cars/${formData.placa}`, {
          method: "PUT",
          ...fetchConfig,
          body: JSON.stringify(bodyData),
        });

        if (!response.ok) throw new Error("Failed to update vehicle");
        toast.success("Vehicle updated successfully!");
      } else {
        // POST request to create a new vehicle
        response = await fetch(`${API_URL}/cars/`, {
          method: "POST",
          ...fetchConfig,
          body: JSON.stringify(bodyData),
        });

        if (!response.ok) throw new Error("Failed to create 1 vehicle");
        toast.success("Vehicle created successfully!");
      }

      // Only refetch vehicles if the create/update was successful
      const updatedResponse = await fetch(`${API_URL}/cars/`, {
        method: "GET",
        ...fetchConfig,
      });

      if (!updatedResponse.ok) throw new Error("Failed to fetch updated vehicles");
      const updatedVehicles = await updatedResponse.json();
      setVehicles(updatedVehicles);

      // Reset state
      resetForm();
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast.error("Error al guardar el vehículo.");
      setIsModalOpen(false);
    }
  };
    const handleImageUpload = (url: string) => {
    // Actualiza el campo de imagen con la URL pública recibida
    setFormData((prevData) => ({
      ...prevData,
      imagen: url,
    }));
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle._id);
    setIsModalOpen(true);
    setFormData({
      nombre: vehicle.nombre,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      anio: vehicle.anio,
      color: vehicle.color,
      imagen: vehicle.imagen,
      placa: vehicle.placa,
      kilometraje: vehicle.kilometraje,
      tipoCombustible: vehicle.tipoCombustible,
      transmision: vehicle.transmision,
      numeroAsientos: vehicle.numeroAsientos,
      estado: vehicle.estado,
      UltimoChequeo: vehicle.UltimoChequeo.split("T")[0], // Formato yyyy-MM-dd
      tarifas: vehicle.tarifas.map((t) => t._id), // Extraer solo los IDs
      mantenimientos: vehicle.mantenimientos,
    });
    setSelectedBrand(vehicle.marca);
    setAvailableModels(brandModels[vehicle.marca] || []);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      marca: "",
      modelo: "",
      anio: 2024,
      color: "",
      imagen: "",
      placa: "",
      kilometraje: 0,
      tipoCombustible: "",
      transmision: "",
      numeroAsientos: 4,
      estado: "Disponible",
      UltimoChequeo: new Date().toISOString().split("T")[0], // For
      tarifas: [],
      mantenimientos: [],
    });
  };

 const handleDelete = async (placa: string) => {
  try {
    const response = await fetch(`${API_URL}/cars/${placa}`, {
      method: "PUT", // Cambiamos a PUT para actualizar en lugar de eliminar
      ...fetchConfig,
      body: JSON.stringify({ estado: "Eliminado" }), // Cambiamos el estado a "Eliminado"
    });
    if (!response.ok) throw new Error("Failed to update vehicle state to Eliminado");

    toast.success("Vehículo eliminado correctamente!");

    // Actualizamos el estado localmente
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.placa === placa ? { ...vehicle, estado: "Eliminado" } : vehicle
      )
    );
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    toast.error("Error al eliminar el vehículo.");
  }
};

const handleRestore = async (placa: string) => {
  try {
    const response = await fetch(`${API_URL}/cars/${placa}`, {
      method: "PUT",
      ...fetchConfig,
      body: JSON.stringify({ estado: "Disponible" }), // Cambiamos el estado a "Disponible"
    });
    if (!response.ok) throw new Error("Failed to update vehicle state to Disponible");

    toast.success("Vehículo restaurado correctamente!");

    // Actualizamos el estado localmente
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.placa === placa ? { ...vehicle, estado: "Disponible" } : vehicle
      )
    );
  } catch (error) {
    console.error("Error restoring vehicle:", error);
    toast.error("Error al restaurar el vehículo.");
  }
};
 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Vehículos</h1>
      {/* Formulario */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-semibold mb-4">{editingId !== null ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput id="nombre" label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
  {/* Campo Marca */}
  <FormInput
    id="marca"
    label="Marca"
    name="marca"
    options={brands}
    value={selectedBrand}
    onChange={handleBrandChange}
  />
  

  {/* Campo Modelo */}
  <FormInput
    id="modelo"
    label="Modelo"
    name="modelo"
    options={[...availableModels]}
    value={formData.modelo}
    onChange={handleModelChange}
    disabled={!selectedBrand || selectedBrand === "Otro"}
  />
 

  {/* Otros campos */}
         <FormInput id="anio" label="Año" name="anio" type="number" value={formData.anio} onChange={handleChange} />
          <FormInput id="color" label="Color" name="color" options={colors} value={formData.color} onChange={handleChange} />
          {/* Componente de subida de imágenes */}
      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">Subir Imagen</label>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>

          <FormInput id="placa" label="Placa" name="placa" value={formData.placa} onChange={handleChange} disabled={!!editingId} />
          <FormInput
            id="kilometraje"
            label="Kilometraje"
            name="kilometraje"
            type="number"
            value={formData.kilometraje.toString()} // Asegura que siempre sea una cadena para evitar errores
            onChange={handleChange}
          />

          <FormInput id="tipoCombustible" label="Tipo de Combustible" name="tipoCombustible" options={fuelTypes} value={formData.tipoCombustible} onChange={handleChange} />
          <FormInput id="transmision" label="Transmisión" name="transmision" options={transmissions} value={formData.transmision} onChange={handleChange} />
          <FormInput id="numeroAsientos" label="Número de Asientos" name="numeroAsientos" type="number" value={formData.numeroAsientos} onChange={handleChange} />
          <FormInput id="estado" label="Estado" name="estado" options={statuses} value={formData.estado} onChange={handleChange} />
          <FormInput id="UltimoChequeo" label="Último Chequeo" name="UltimoChequeo" type="date" value={formData.UltimoChequeo} onChange={handleChange} />
          {/*<div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Gestión de Tarifas</h2>
        {/*<TarifaModal 
      </div>*/}
          <div className="col-span-full">
            <TarifaSelect id="tarifas" tarifas={availableTarifas} selectedTarifas={Array.isArray(formData.tarifas) ? formData.tarifas : []} onChange={handleTarifasChange} />
          </div>

          <div className="col-span-full mt-4">
            <button id="submit-button" type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {editingId !== null ? "Actualizar" : "Agregar"} Vehículo
            </button>
          </div>
        </form>
      </Modal>

     {/* Pestañas */}
    <div className="flex justify-center mb-6">
      <button
        className={`px-4 py-2 rounded-t-lg ${
          activeTab === "activos"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => handleTabChange("activos")}
      >
        Vehículos Activos
      </button>
      <button
        className={`px-4 py-2 rounded-t-lg ml-2 ${
          activeTab === "eliminados"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => handleTabChange("eliminados")}
      >
        Vehículos Eliminados
      </button>
    </div>

    {/* Botón de Agregar Vehículo */}
    {activeTab === "activos" && (
      <button
        id="addVehicle"
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Agregar Vehículo
      </button>
    )}

    {/* Campo de búsqueda */}
    <div>
      <input
        type="text"
        placeholder="Buscar por placa, marca o modelo"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Tabla de Vehículos */}
    <div className="overflow-x-auto bg-white shadow-md rounded mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            {activeTab === "activos" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {searchedVehicles.map((vehicle, index) => (
            <tr key={vehicle._id || index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{vehicle.nombre}</div>
                <div className="text-sm text-gray-500">
                  {vehicle.marca} {vehicle.modelo}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Placa: {vehicle.placa}</div>
                <div className="text-sm text-gray-500">Km: {vehicle.kilometraje}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${vehicle.estado === "Disponible" ? "bg-green-100 text-green-800" : vehicle.estado === "Alquilado" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                >
                  {vehicle.estado}
                </span>
              </td>
              {activeTab === "activos" && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    id="edit-button"
                    onClick={() => handleEdit(vehicle)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    id="delete-button"
                    onClick={() => handleDelete(vehicle.placa)}
                    className="text-red-600 hover:text-red-900"
                    type="button"
                  >
                    Eliminar
                  </button>
                  <button
                    id="maintenance-button"
                    onClick={() => router.push(`/pages/admin/maintenance?vehiclePlaca=${vehicle.placa}&vehicleId=${vehicle._id}`)}
                    className="ml-2 text-yellow-600 hover:text-yellow-900"
                    type="button"
                  >
                    Mantenimiento
                  </button>
                </td>
              )}
              {activeTab === "eliminados" && (
  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    <button
      id="restore-button"
      onClick={() => handleRestore(vehicle.placa)}
      className="text-green-600 hover:text-green-900"
      type="button"
    >
      Restaurar
    </button>
  </td>
)}
            </tr>
          ))}
        </tbody>
      </table>
      {searchedVehicles.length === 0 && (
        <div className="text-center py-4 text-gray-500">No se encontraron resultados</div>
      )}
    </div>
  </div>
);
}
export default VehiclePage; 