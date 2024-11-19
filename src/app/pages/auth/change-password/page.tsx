"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { changePassword } from "@/services/authService";
import { toast } from "react-hot-toast";

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    if (!userId) {
      router.push('/');
    }
  }, [userId, router]);

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