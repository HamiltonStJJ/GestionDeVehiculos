"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/services/authService";

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await changePassword(newPassword);
      if (response.ok) {
        // Redirigir al usuario a la página de inicio de sesión después de cambiar la contraseña
        router.push("/auth/login");
      } else {
        setError("Error al cambiar la contraseña. Inténtalo de nuevo.");
      }
    } catch (error) {
      setError("Ocurrió un error en la solicitud.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Cambiar Contraseña</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block font-semibold">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
