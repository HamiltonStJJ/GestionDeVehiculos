'use client'
import { useState, ChangeEvent, FormEvent } from 'react'

interface Vehicle {
  id: number
  name: string
  brand: string
  model: string
  year: string
  color: string
  plate: string
  mileage: string
  fuelType: string
  transmission: string
  doors: string
  status: string
  lastCheck: string
}

interface FormData extends Omit<Vehicle, 'id'> {}

// Componente de input reutilizable separado para mejor legibilidad
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
  value: string
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
  // Datos predefinidos
  const brands = ["Toyota", "Ford", "Chevrolet", "Honda", "Nissan"]
  const colors = ["Blanco", "Negro", "Azul", "Rojo", "Plata"]
  const fuelTypes = ["Gasolina", "Diesel", "Híbrido", "Eléctrico"]
  const transmissions = ["Manual", "Automática"]
  const statuses = ["Disponible", "Alquilado", "En mantenimiento"]

  // Estados
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    plate: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    doors: '',
    status: 'Disponible',
    lastCheck: ''
  })

  // Manejadores de eventos
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editingId !== null) {
      setVehicles(vehicles.map(vehicle =>
        vehicle.id === editingId ? { ...formData, id: editingId } : vehicle
      ))
      setEditingId(null)
    } else {
      setVehicles([...vehicles, { ...formData, id: Date.now() }])
    }
    resetForm()
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id)
    setFormData(vehicle)
  }

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: '',
      color: '',
      plate: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      doors: '',
      status: 'Disponible',
      lastCheck: ''
    })
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
            name="name" 
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput 
            label="Marca" 
            name="brand" 
            options={brands}
            value={formData.brand}
            onChange={handleChange}
          />
          <FormInput 
            label="Modelo" 
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
          <FormInput 
            label="Año" 
            name="year" 
            type="number"
            value={formData.year}
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
            label="Placa" 
            name="plate"
            value={formData.plate}
            onChange={handleChange}
          />
          <FormInput 
            label="Kilometraje" 
            name="mileage" 
            type="number"
            value={formData.mileage}
            onChange={handleChange}
          />
          <FormInput 
            label="Tipo de Combustible" 
            name="fuelType" 
            options={fuelTypes}
            value={formData.fuelType}
            onChange={handleChange}
          />
          <FormInput 
            label="Transmisión" 
            name="transmission" 
            options={transmissions}
            value={formData.transmission}
            onChange={handleChange}
          />
          <FormInput 
            label="Número de Puertas" 
            name="doors" 
            type="number"
            value={formData.doors}
            onChange={handleChange}
          />
          <FormInput 
            label="Estado" 
            name="status" 
            options={statuses}
            value={formData.status}
            onChange={handleChange}
          />
          <FormInput 
            label="Último Chequeo" 
            name="lastCheck" 
            type="date"
            value={formData.lastCheck}
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
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                  <div className="text-sm text-gray-500">{vehicle.brand} {vehicle.model}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Placa: {vehicle.plate}</div>
                  <div className="text-sm text-gray-500">Km: {vehicle.mileage}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${vehicle.status === 'Disponible' ? 'bg-green-100 text-green-800' : 
                      vehicle.status === 'Alquilado' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {vehicle.status}
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
                    onClick={() => handleDelete(vehicle.id)}
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