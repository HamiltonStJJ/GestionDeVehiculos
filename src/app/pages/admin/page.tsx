'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'

interface Tarifa {
  _id: string
  tipoVehiculo: string
  duracion: string
  temporada: string
  tarifa: number
}

interface Mantenimiento {
  fecha: string
  descripcion: string
  _id: string
}

interface Vehicle {
  _id: string
  nombre: string
  marca: string
  modelo: string
  anio: number
  color: string
  imagen: string
  placa: string
  kilometraje: number
  tipoCombustible: string
  transmision: string
  numeroPuertas: number
  numeroAsientos: number
  estado: string
  UltimoChequeo: string
  tarifas: Tarifa[]
  mantenimientos: Mantenimiento[]
}

interface FormData extends Omit<Vehicle, '_id'> {
  tarifas: Tarifa[] // Cambiado para aceptar array de Tarifa
  mantenimientos: Mantenimiento[]
}

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  options = null,
  value,
  onChange
}: {
  label: string
  name: string
  type?: string
  options?: string[] | null
  value: string | number
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}) => {
  if (options) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Seleccione {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2"
        required
      />
    </div>
  )
}

const VehiclePage = () => {
  const API_URL = process.env.API_URL;
  // Datos predefinidos
  const brands = ["Volkswagen", "Toyota", "Ford", "Chevrolet", "Honda", "Nissan"]
  const colors = ["Verde", "Blanco", "Negro", "Azul", "Rojo", "Plata"]
  const fuelTypes = ["Gasolina", "Diesel", "Híbrido", "Eléctrico"]
  const transmissions = ["Manual", "Automática"]
  const statuses = ["Disponible", "Alquilado", "En mantenimiento"]

  

  // Estados
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    marca: '',
    modelo: '',
    anio: 2024,
    color: '',
    imagen: '',
    placa: '',
    kilometraje: 0,
    tipoCombustible: '',
    transmision: '',
    numeroPuertas: 4,
    numeroAsientos: 4,
    estado: 'Disponible',
    UltimoChequeo: new Date().toISOString(),
    tarifas: [], // Inicializado como array vacío
    mantenimientos: [] // Inicializado como array vacío
  })

  const fetchConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
  }

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      console.log("API_URL", API_URL)
      try {
        const response = await fetch(`http://localhost:8080/cars/`, {
          method: "GET",
          ...fetchConfig
        })
        if (!response.ok) throw new Error('Failed to fetch vehicles')
        const data = await response.json()
        const filteredData = data.filter((vehicle: Vehicle) => vehicle.estado !== 'Eliminado')
        setVehicles(filteredData)
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      }
    }

    fetchVehicles()
  }, [])

  // Manejadores de eventos
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['anio', 'kilometraje', 'numeroPuertas', 'numeroAsientos'].includes(name) 
        ? Number(value) 
        : value 
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // Preparar el body con el formato correcto
      const bodyData = {
        ...formData,
        UltimoChequeo: new Date(formData.UltimoChequeo).toISOString(),
        // Si no hay tarifas seleccionadas, enviar array vacío
        tarifas: formData.tarifas || [],
        // Si no hay mantenimientos, enviar array vacío
        mantenimientos: formData.mantenimientos || []
      }

      if (editingId) {
        // Update existing vehicle
        const response = await fetch(`http://localhost:8080/cars/${editingId}`, {
          method: 'PUT',
          ...fetchConfig,
          body: JSON.stringify(bodyData)
        })
        if (!response.ok) throw new Error('Failed to update vehicle')
        
        setVehicles(vehicles.map(vehicle =>
          vehicle._id === editingId ? { ...vehicle, ...bodyData } : vehicle
        ))
      } else {
        // Create new vehicle
        const response = await fetch('http://localhost:8080/cars/', {
          method: 'POST',
          ...fetchConfig,
          body: JSON.stringify(bodyData)
        })
        if (!response.ok) throw new Error('Failed to create vehicle')
        const newVehicle = await response.json()
        setVehicles([...vehicles, newVehicle])
      }
      
      resetForm()
      setEditingId(null)
    } catch (error) {
      console.error('Error saving vehicle:', error)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle._id)
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
      numeroPuertas: vehicle.numeroPuertas,
      numeroAsientos: vehicle.numeroAsientos,
      estado: vehicle.estado,
      UltimoChequeo: vehicle.UltimoChequeo,
      tarifas: vehicle.tarifas, // Asignar el objeto completo
      mantenimientos: vehicle.mantenimientos
    })
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      marca: '',
      modelo: '',
      anio: 2024,
      color: '',
      imagen: '',
      placa: '',
      kilometraje: 0,
      tipoCombustible: '',
      transmision: '',
      numeroPuertas: 4,
      numeroAsientos: 4,
      estado: 'Disponible',
      UltimoChequeo: new Date().toISOString(),
      tarifas: [],
      mantenimientos: []
    })
  }

  const handleDelete = async (placa: string) => {
    try {
      const response = await fetch(`http://localhost:8080/cars/${placa}`, {
        method: 'DELETE',
        ...fetchConfig,
      })
      if (!response.ok) throw new Error('Failed to delete vehicle')
      setVehicles(vehicles.filter(vehicle => vehicle.placa !== placa))
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Vehículos</h1>
      
      {/* Formulario */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId !== null ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput 
            label="Nombre" 
            name="nombre" 
            value={formData.nombre}
            onChange={handleChange}
          />
          <FormInput 
            label="Marca" 
            name="marca" 
            options={brands}
            value={formData.marca}
            onChange={handleChange}
          />
          <FormInput 
            label="Modelo" 
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
          />
          <FormInput 
            label="Año" 
            name="anio" 
            type="number"
            value={formData.anio}
            onChange={handleChange}
          />
          <FormInput 
            label="Color" 
            name="color" 
            options={colors}
            value={formData.color}
            onChange={handleChange}
          />
          <FormInput 
            label="Imagen URL" 
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
          />
          <FormInput 
            label="Placa" 
            name="placa"
            value={formData.placa}
            onChange={handleChange}
          />
          <FormInput 
            label="Kilometraje" 
            name="kilometraje" 
            type="number"
            value={formData.kilometraje}
            onChange={handleChange}
          />
          <FormInput 
            label="Tipo de Combustible" 
            name="tipoCombustible" 
            options={fuelTypes}
            value={formData.tipoCombustible}
            onChange={handleChange}
          />
          <FormInput 
            label="Transmisión" 
            name="transmision" 
            options={transmissions}
            value={formData.transmision}
            onChange={handleChange}
          />
          <FormInput 
            label="Número de Puertas" 
            name="numeroPuertas" 
            type="number"
            value={formData.numeroPuertas}
            onChange={handleChange}
          />
          <FormInput 
            label="Número de Asientos" 
            name="numeroAsientos" 
            type="number"
            value={formData.numeroAsientos}
            onChange={handleChange}
          />
          <FormInput 
            label="Estado" 
            name="estado" 
            options={statuses}
            value={formData.estado}
            onChange={handleChange}
          />
          <FormInput 
            label="Último Chequeo" 
            name="UltimoChequeo" 
            type="date"
            value={formData.UltimoChequeo}
            onChange={handleChange}
          />

          <div className="col-span-full mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingId !== null ? 'Actualizar' : 'Agregar'} Vehículo
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Vehículos */}
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vehicle.nombre}</div>
                  <div className="text-sm text-gray-500">{vehicle.marca} {vehicle.modelo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Placa: {vehicle.placa}</div>
                  <div className="text-sm text-gray-500">Km: {vehicle.kilometraje}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${vehicle.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 
                      vehicle.estado === 'Alquilado' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {vehicle.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.placa)}
                    className="text-red-600 hover:text-red-900"
                    type="button"
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
  )
}

export default VehiclePage