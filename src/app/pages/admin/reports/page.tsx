"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportData {
  totales: {
    cantidadRentas: number;
    rentasPendientes: number;
    rentasFinalizadas: number;
    ingresosTotales: number;
    promedioIngresoPorRenta: number;
    penalizacionesTotales: number;
    diasTotalesAlquilados: number;
  };
}

const ReportsDashboard = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/rentals?period=rango&startDate=${startDate}&endDate=${endDate}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
    setLoading(false);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDateRange(value);
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (value) {
      case "week":
        start.setDate(today.getDate() - 7);
        break;
      case "month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "quarter":
        start.setMonth(today.getMonth() - 3);
        break;
      case "year":
        start.setFullYear(today.getFullYear() - 1);
        break;
      case "custom":
        return;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };
  useEffect(() => {
    // Establecer fechas del último mes al montar
    const today = new Date();
    let start = new Date();
    start.setMonth(today.getMonth() - 1);

    setDateRange("month");
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []); // Array vacío para ejecutar solo al montar

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate]);

  const getChartData = () => {
    if (!reportData?.totales) return [];
    return [
      {
        name: "Rentas",
        total: reportData.totales.cantidadRentas,
        pendientes: reportData.totales.rentasPendientes,
        finalizadas: reportData.totales.rentasFinalizadas,
      },
    ];
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reportes de Alquiler</h1>
        <div className="flex items-center gap-4">
          <select
            className="select select-bordered w-full max-w-xs"
            value={dateRange}
            onChange={handleDateRangeChange}
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
            <option value="custom">Personalizado</option>
          </select>

{dateRange === "custom" && (
  <div className="flex gap-2">
    <input
      type="date"
      value={startDate}
      onChange={(e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);
        // Si la fecha final es menor que la nueva fecha inicial, borrar la fecha final
        if (endDate && selectedStartDate > endDate) {
          setEndDate("");
        }
      }}
      className="input input-bordered"
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => {
        const selectedEndDate = e.target.value;
        // Validar que la fecha final no sea menor que la fecha inicial
        if (selectedEndDate >= startDate) {
          setEndDate(selectedEndDate);
        } else {
          // Si la fecha es inválida, no actualizar el estado
          setEndDate("");
        }
      }}
      min={startDate} // Limitar la selección en el calendario
      className="input input-bordered"
    />
  </div>
)}       </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : reportData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Total de Rentas
                <Calendar className="h-4 w-4 text-gray-500" />
              </h2>
              <p className="text-2xl font-bold">
                {reportData.totales.cantidadRentas}
              </p>
              <p className="text-sm opacity-70">
                Finalizadas: {reportData.totales.rentasFinalizadas}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Ingresos Totales
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-gray-500"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </h2>
              <p className="text-2xl font-bold">
                ${reportData.totales.ingresosTotales.toLocaleString()}
              </p>
              <p className="text-sm opacity-70">
                Promedio por renta: $
                {Math.round(
                  reportData.totales.promedioIngresoPorRenta
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Penalizaciones
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-gray-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </h2>
              <p className="text-2xl font-bold">
                ${reportData.totales.penalizacionesTotales.toLocaleString()}
              </p>
              <p className="text-sm opacity-70">
                Días totales alquilados:{" "}
                {reportData.totales.diasTotalesAlquilados}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl col-span-full">
            <div className="card-body">
              <h2 className="card-title">Resumen de Rentas</h2>
              <p className="text-sm opacity-70">
                Distribución de estados de renta
              </p>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="finalizadas"
                      name="Finalizadas"
                      fill="#4CAF50"
                    />
                    <Bar
                      dataKey="pendientes"
                      name="Pendientes"
                      fill="#FFA726"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReportsDashboard;
