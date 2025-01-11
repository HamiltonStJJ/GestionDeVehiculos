export interface Auto {
  valor: number;
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
  tarifas: string[];
  mantenimientos: {
    fecha: string;
    descripcion: string;
    _id: string;
  }[];
}
