import React from 'react';

interface FilterSectionProps {
  fechaInicio: string;
  setFechaInicio: (fecha: string) => void;
  fechaFin: string;
  setFechaFin: (fecha: string) => void;
  filterBrand: string;
  setFilterBrand: (brand: string) => void;
  filterPrice: number;
  setFilterPrice: (price: number) => void;
  filterYear: string | number;
  setFilterYear: (year: string | number) => void;
  resetFilters: () => void;
  uniqueBrands: string[];
  uniqueYears: (string | number)[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  filterBrand,
  setFilterBrand,
  filterPrice,
  setFilterPrice,
  filterYear,
  setFilterYear,
  resetFilters,
  uniqueBrands,
  uniqueYears
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      {/* Contenedor principal para todos los filtros */}
      <div className="space-y-6">
        {/* Sección de fechas */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Selecciona el período de alquiler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
                Fecha de inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => {
                  const nuevaFechaInicio = e.target.value;
                  setFechaInicio(nuevaFechaInicio);
                  if (fechaFin && new Date(nuevaFechaInicio) > new Date(fechaFin)) {
                    setFechaFin('');
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">
                Fecha de fin
              </label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => {
                  const nuevaFechaFin = e.target.value;
                  if (!fechaInicio) {
                    alert('Por favor, seleccione primero una fecha de inicio');
                    return;
                  }
                  if (new Date(nuevaFechaFin) >= new Date(fechaInicio)) {
                    setFechaFin(nuevaFechaFin);
                  } else {
                    alert('La fecha de fin debe ser posterior a la fecha de inicio');
                    setFechaFin('');
                  }
                }}
                min={fechaInicio}
                disabled={!fechaInicio}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Sección de filtros adicionales */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Filtros adicionales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="filterBrand" className="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <select
                id="filterBrand"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Todas">Todas las marcas</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="price-input" className="block text-sm font-medium text-gray-700">
                Precio máximo por día
              </label>
              <input
                id="price-input"
                type="number"
                placeholder="Ej: 50"
                value={filterPrice || ''}
                onChange={(e) => setFilterPrice(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700">
                Año del vehículo
              </label>
              <select
                id="year-filter"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value === "Todos" ? "Todos" : Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Todos">Todos los años</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón de reset */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Restablecer filtros</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;