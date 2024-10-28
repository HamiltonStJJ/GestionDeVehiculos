export const API_URL = "http://localhost:8080";

export async function apiRequest(endpoint: string, options: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error("Error en la solicitud");
  }
  return response.json();
}
