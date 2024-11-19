import { apiRequest } from "./apiClient";

interface LoginResponse {
  authentication: {
    password: string;
    salt: string;
    isTemporaryPassword: boolean;
    sessionToken: string;
  };
  _id: string;
  nombre: string;
  cedula: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  rol: string;
  estado: string;
}

export async function login(email: string, password: string) {
  try {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.message) {
      throw new Error(response.message);
    }

    if (response.authentication?.isTemporaryPassword) {
      return {
        status: 'TEMPORARY_PASSWORD',
        userData: response
      };
    }

    return {
      status: 'SUCCESS',
      userData: response  
    };
  } catch (error) {
    throw error;
  }
}

export async function changePassword(newPassword: string) {
  return apiRequest("/auth/change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
    credentials: "include",
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

