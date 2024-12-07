const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

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
      console.error("Network error:", error);
      throw new Error("Error de conexión");
    }
    throw error;
  }
}
