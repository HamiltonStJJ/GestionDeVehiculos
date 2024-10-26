import { apiRequest } from "./apiClient";

export async function login(email: string, password: string) {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  cedula: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  password: string;
}) {
  return apiRequest("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function requestPasswordReset(email: string) {
  return apiRequest("/auth/forgot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
