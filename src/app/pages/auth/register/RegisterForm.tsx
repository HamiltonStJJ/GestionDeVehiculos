"use client";

import { useState, useEffect } from "react";
import { login, register, verifyEmail } from "@/services/authService";
import InputField from "@/components/InputField";
import AuthButton from "@/components/AuthButton";
import { useRouter } from "next/navigation";
import VerificationCodeInput from "./VerificationCodeInput";

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
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerificationStep && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [isVerificationStep, resendTimer]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register({ cedula, nombre, apellido, direccion, telefono, email, password });
      setIsVerificationStep(true);
      setResendTimer(60); // Reiniciar temporizador
      setCanResend(false);
    } catch (err) {
      setError("Hubo un error al enviar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await register({ cedula, nombre, apellido, direccion, telefono, email, password });
      setResendTimer(60); // Reinicia el temporizador
      setCanResend(false);
    } catch (err) {
      setError("No se pudo reenviar el código. Inténtalo más tarde.");
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

      const result = await login(email, password);
      if (result.status === "TEMPORARY_PASSWORD") {
        router.push(`pages/auth/change-password?userId=${result.userData._id}`);
      } else if (result.userData.rol === "admin") {
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
        <>
          <p className="text-gray-600 text-center mb-4">
            Ingresa el código de 6 dígitos enviado a tu correo.
          </p>
          <VerificationCodeInput value={verificationCode} onChange={(value) => setVerificationCode(value)} />
          <div className="text-center mt-4">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 hover:underline"
              >
                Reenviar código
              </button>
            ) : (
              <p className="text-gray-500">Puedes reenviar el código en {resendTimer} segundos</p>
            )}
          </div>
        </>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <AuthButton id="register-btn" text={isVerificationStep ? "Verificar Código" : "Registrarse"} isLoading={isLoading} onClick={isVerificationStep ? handleVerify : handleRegister} />
    </form>
  );
}
