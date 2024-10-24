// pages/login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      if (isRegistering) {
        // Simulación de registro
        console.log({
          cedula,
          nombre,
          apellido,
          direccion,
          telefono,
          email,
          password,
        });
        setError("Registro completado exitosamente (simulado).");
      } else if (isRecovering) {
        // Simulación de recuperación de contraseña
        setError("Correo de recuperación enviado (simulado).");
      } else if (email === "test@example.com" && password === "password") {
        router.push("pages/customer");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Ocurrió un error en el login.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-2">
          <img
            src="images/carmini.svg" 
            alt="Vehículos"
            className="w-1/2 h-auto" 
          />
        </div>  

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 mt-2">
          {isRegistering
            ? "Registro de usuario"
            : isRecovering
            ? "Recuperar Contraseña"
            : "Iniciar sesión"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label
                  htmlFor="cedula"
                  className="block text-sm font-medium text-gray-800"
                >
                  Cédula
                </label>
                <input
                  id="cedula"
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Cédula"
                />
              </div>

              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-800"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Nombre"
                />
              </div>

              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm font-medium text-gray-800"
                >
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Apellido"
                />
              </div>

              <div>
                <label
                  htmlFor="direccion"
                  className="block text-sm font-medium text-gray-800"
                >
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Dirección"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-800"
                >
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Teléfono"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              placeholder="tucorreo@example.com"
            />
          </div>

          {!isRecovering && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && <p className="text-gray-700 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-[#134B70] transition duration-200"
          >
            {isRegistering
              ? "Registrarse"
              : isRecovering
              ? "Recuperar Contraseña"
              : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-gray-600 underline text-sm hover:text-[#4A628A] transition duration-200 mt-5"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "¿Ya tienes cuenta? Iniciar sesión"
              : "¿No tienes cuenta? Registrarse"}
          </button>
          <br /> 
          {!isRegistering && (
            <button
              className="text-gray-600 underline text-sm hover:text-[#4A628A] transition duration-200 mt-5"
              onClick={() => setIsRecovering(!isRecovering)}
            >
              {isRecovering
                ? "Volver a iniciar sesión"
                : "¿Olvidaste tu contraseña?"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
