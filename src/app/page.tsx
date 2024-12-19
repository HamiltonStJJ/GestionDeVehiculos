"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("auth"); // Obtiene el token desde las cookies
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null; // Obtiene los datos del usuario desde localStorage

    if (!token || !userData) {
      // Si no hay token o datos del usuario, redirige al login
      router.push("/pages/auth/Login");
      return;
    }

    // Verifica el rol del usuario y redirige según corresponda
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
        // Si el rol no es reconocido, redirige al login
        router.push("/pages/auth/Login");
    }
  }, [router]);

  return null; // No renderiza nada mientras redirige
}
