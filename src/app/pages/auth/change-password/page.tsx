"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/services/authService";
import { toast } from "react-hot-toast";

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [, setUserId] = useState<string | null>(null);

useEffect(() => {
    try {
      // Obtener parámetros manualmente desde la URL
      const searchParams = new URLSearchParams(window.location.search);
      const userIdParam = searchParams.get("userId");

      if (!userIdParam) {
        throw new Error("No se proporcionó un ID de usuario");
      }

      setUserId(userIdParam);
    } catch (error) {
      console.error("Error al obtener parámetros:", error);
      setError("Parámetro 'userId' no encontrado. Redirigiendo...");
      toast.error("Parámetro 'userId' no encontrado.");
      setTimeout(() => router.push("/"), 3000); // Redirigir después de mostrar el error
    }
  }, [router]);

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await changePassword(newPassword);
      toast.success("Contraseña cambiada exitosamente");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setError("Error al cambiar la contraseña");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-2">
          <img
            src="/images/carmini2.svg"
            alt="Vehículos"
            className="w-1/2 h-auto"
          />
        </div>

        <h1
          className="text-4xl font-light mb-4 text-center text-[#201E43] tracking-wider mt-1"
          style={{
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          FlexiDrive
        </h1>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 mt-2">
          Cambiar Contraseña
        </h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A628A] focus:border-transparent transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#4A628A] text-white py-3 rounded-lg hover:bg-[#3A527A] transition duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;