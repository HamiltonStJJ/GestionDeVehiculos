
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerPage() {
  const router = useRouter();

  useEffect(() => {
    
    const userLoggedIn = true; 

    if (!userLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <h1>Bienvenido a la página de vehículos</h1>
      {/* Aquí agregarás los filtros y vehículos*/}
    </div>
  );
}
