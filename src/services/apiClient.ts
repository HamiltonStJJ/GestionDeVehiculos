export const API_URL = "http://localhost:8080";

export async function apiRequest(endpoint: string, options: RequestInit) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok && response.status !== 403) {
      throw new Error("Error en la solicitud");
    }
    
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error:', error);
      throw new Error("Error de conexión");
    }
    throw error;
  }
}