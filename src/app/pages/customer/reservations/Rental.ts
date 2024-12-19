import { Auto } from "./Auto";
import { Cliente } from "./Cliente";
import { TarifaAplicada } from "./TarifaAplicada";

export interface Rental {
  _id: string;
  cliente: Cliente;
  auto: Auto;
  fechaInicio: string;
  fechaFin: string;
  tarifaAplicada: TarifaAplicada;
  estado: string;
  total: number;
  fechaDevolucion: string | null;
  penalizacion: number;
  penalizacionPorDanios: number;
  piezasRevisadas: [];
}
