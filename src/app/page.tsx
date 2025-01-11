
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const validateAuth = async () => {
      const token = Cookies.get("auth"); // Obtiene el token de las cookies

      if (!token) {
        // Si no hay token, redirige al login
        router.push("/pages/auth/Login");
        return;
      }

      try {
        // Verifica el token con el backend
// Redirige al usuario según su rol después de verificar el token
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          throw new Error("No user data found in localStorage");
        }
        const userData = JSON.parse(userDataString);

        if (!userData) {
          throw new Error("No user data found in localStorage");
        }
        const response = await fetch(`${API_URL}/users/${userData.cedula}`, {
          method: "GET",
          credentials: "include", // Incluye el token automáticamente
        });

        if (!response.ok) {
          throw new Error("Token inválido o expirado");
        }

        

        switch (userData.rol) {
          case "admin":
            router.push("/pages/admin");
            break;
          case "empleado":
            router.push("/pages/employee");
            break;
          case "cliente":
            router.push("/pages/customer");
            break;
          default:
            router.push("/pages/auth/Login");
        }
      } catch (error) {

        // Si el token es inválido, elimina la cookie y redirige al login
        console.error("Error al validar el token:", error);
        Cookies.remove("auth");
        localStorage.removeItem("userData");
        router.push("/pages/auth/Login");
      }
    };

    validateAuth();
  }, [router]);

  return null; // No renderiza nada mientras redirige
}
