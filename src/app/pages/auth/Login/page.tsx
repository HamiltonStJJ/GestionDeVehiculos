import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4">
        {/* Imagen de encabezado */}
        <div className="flex justify-center mb-2">
          <img
            src="/images/carmini2.svg"
            alt="Vehículos"
            className="w-1/2 h-auto"
          />
        </div>

        {/* Nombre del programa FlexiDrive */}
        <h1
          className="text-4xl font-light mb-4 text-center text-[#201E43] tracking-wider mt-1"
          style={{
            fontFamily: "'Roboto', sans-serif",
            color: "#201E43",
          }}
        >
          FlexiDrive
        </h1>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 mt-2">
          Iniciar sesión
        </h2>

        <LoginForm />

        {/* Navegación hacia Registro y Recuperar Contraseña */}
        <div className="mt-4 text-center">
          <Link
            href="pages/auth/register"
            className="text-gray-600 underline text-sm hover:text-[#4A628A] transition duration-200 "
          >
            ¿No tienes cuenta? Registrarse
          </Link>
          <br />
          <Link
            href="pages/auth/forgot-password"
            className="text-gray-600 underline text-sm hover:text-[#4A628A] transition duration-200 mt-2"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
