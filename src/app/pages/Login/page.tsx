// pages/login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      if (email === "test@example.com" && password === "password") {
        router.push("pages/customer");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Ocurrió un error en el login.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600 sm:text-sm"
              placeholder="tucorreo@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-gray-700 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
