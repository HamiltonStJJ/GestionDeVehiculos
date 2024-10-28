import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
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

        <h1 className="text-4xl font-light mb-4 text-center text-[#201E43]">FlexiDrive</h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registro de usuario</h2>

        <RegisterForm />

        {/* Enlace para volver a Iniciar sesión */}
        <div className="mt-4 text-center">
          <Link href="/"
          className="text-gray-600 underline text-sm hover:text-[#4A628A] transition duration-200">
            
              ¿Ya tienes cuenta? Iniciar sesión
            
          </Link>
        </div>
      </div>
    </div>
  );
}
