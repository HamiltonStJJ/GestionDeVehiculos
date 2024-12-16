"use client";

import { useState } from "react";
import { register, verifyEmail } from "@/services/authService"; // Añade verifyEmail
import InputField from "@/components/InputField";
import AuthButton from "@/components/AuthButton";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register({ cedula, nombre, apellido, direccion, telefono, email, password });
      setIsVerificationStep(true); // Cambia a la fase de verificación
    } catch (err) {
      setError("Hubo un error al enviar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyEmail({
        cedula,
        nombre,
        apellido,
        direccion,
        telefono,
        email,
        password,
        verificationCode,
      });

      // Guardar los datos del usuario en localStorage
      localStorage.setItem("user", typeof response === "string" ? response : JSON.stringify(response));
      if(response.rol === 'admin') {
        router.push("/pages/admin");
      } else {
        router.push("/pages/customer");
      }
      
    } catch (err) {
      setError("El código de verificación es inválido o expiró.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={isVerificationStep ? handleVerify : handleRegister} className="space-y-4">
      {!isVerificationStep ? (
        <>
          <InputField id="cedula" label="Cédula" type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Cédula" />
          <InputField id="nombre" label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
          <InputField id="apellido" label="Apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" />
          <InputField id="direccion" label="Dirección" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" />
          <InputField id="telefono" label="Teléfono" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
          <InputField id="email" label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@example.com" />
          <InputField id="password" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </>
      ) : (
        <InputField id="verificationCode" label="Código de verificación" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Ingresa el código enviado a tu correo" />
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <AuthButton id="register-btn" text={isVerificationStep ? "Verificar Código" : "Registrarse"} isLoading={isLoading} onClick={(e: React.MouseEvent<HTMLButtonElement>) => isVerificationStep ? handleVerify(e) : handleRegister(e)} />
    </form>
  );
}
