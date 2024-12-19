export interface Cliente {
  _id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  direccion: string;
  telefono: string;
  email: string;
  rol: string;
  estado: string;
  authentication: {
    isTemporaryPassword: boolean;
  };
}
