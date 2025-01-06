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
import { toast } from "react-toastify";
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#201E43',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#134B70',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    padding: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    padding: 8
  },
  cell: {
    flex: 1,
    fontSize: 10
  },
  headerCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold'
  },
  period: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4A628A'
  },
  divider: {
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    marginVertical: 15
  }
});

// Componente PDF mejorado
const ReportPDF = ({ reportData, startDate, endDate }: { reportData: ReportData; startDate: string; endDate: string }) => {
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Reporte de Alquileres</Text>
          <Text style={styles.period}>
            Período: {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
          
          <Text style={styles.subtitle}>Resumen General</Text>
          <Text style={styles.text}>Total de Rentas: {reportData.totales.cantidadRentas}</Text>
          <Text style={styles.text}>Rentas Finalizadas: {reportData.totales.rentasFinalizadas}</Text>
          <Text style={styles.text}>Rentas Pendientes: {reportData.totales.rentasPendientes}</Text>
          <Text style={styles.text}>Rentas Canceladas: {reportData.totales.rentasCanceladas}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.subtitle}>Métricas Financieras</Text>
          <Text style={styles.text}>Ingresos Totales: ${reportData.totales.ingresosTotales.toLocaleString()}</Text>
          <Text style={styles.text}>Promedio por Renta: ${Math.round(reportData.totales.promedioIngresoPorRenta).toLocaleString()}</Text>
          <Text style={styles.text}>Total Penalizaciones: ${reportData.totales.penalizacionesTotales.toLocaleString()}</Text>
          <Text style={styles.text}>Días Totales Alquilados: {reportData.totales.diasTotalesAlquilados}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.subtitle}>Detalle de Rentas</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Cliente</Text>
            <Text style={styles.headerCell}>Vehículo</Text>
            <Text style={styles.headerCell}>Estado</Text>
            <Text style={styles.headerCell}>Subtotal</Text>
            <Text style={styles.headerCell}>Penalización</Text>
            <Text style={styles.headerCell}>Total</Text>
          </View>
          
          {reportData.rentas.map((renta) => (
            <View style={styles.tableRow} key={renta._id}>
              <Text style={styles.cell}>{renta.cliente}</Text>
              <Text style={styles.cell}>{renta.auto}</Text>
              <Text style={styles.cell}>{renta.estado}</Text>
              <Text style={styles.cell}>${renta.subtotal}</Text>
              <Text style={styles.cell}>${renta.penalizacion}</Text>
              <Text style={styles.cell}>${renta.total}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
// Agregar esta función dentro del componente ReportsDashboard
const generatePDF = async (reportData: ReportData, startDate: string, endDate: string) => {
  if (!reportData) return;

  try {
    const blob = await pdf(
      <ReportPDF 
        reportData={reportData} 
        startDate={startDate} 
        endDate={endDate} 
      />
    ).toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-alquileres-${startDate}-${endDate}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("PDF generado exitosamente");
  } catch (error) {
    toast.error("Error al generar el PDF");
    console.error("Error generando PDF:", error);
  }
};
interface Renta {
  _id: string;
  cliente: string;
  auto: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  diasAlquilado: number;
  subtotal: number;
  penalizacion: number;
  total: number;
}

interface ReportData {
  rangoFechas: {
    $gte: string;
    $lte: string;
  };
  rentas: Renta[];
  totales: {
    cantidadRentas: number;
    rentasPendientes: number;
    rentasFinalizadas: number;
    rentasCanceladas: number;
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
      toast.error("Error al obtener los datos del reporte");
    }
    setLoading(false);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDateRange(value);
    const today = new Date();
    const start = new Date();
    const end = new Date();

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
    const start = new Date();
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
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Reportes de Alquiler</h1>
        <button
          onClick={() => reportData && generatePDF(reportData, startDate, endDate)}
          className="btn btn-primary"
          disabled={!reportData || loading}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          Descargar PDF
        </button>
      </div>
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
