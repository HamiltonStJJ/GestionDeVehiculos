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
      await register({
        cedula,
        nombre,
        apellido,
        direccion,
        telefono,
        email,
        password,
      });
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
      await register({
        cedula,
        nombre,
        apellido,
        direccion,
        telefono,
        email,
        password,
      });
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
      } else {
        localStorage.setItem("userData", JSON.stringify(result.userData));
      }
      if (result.userData.rol === "admin") {
        router.push("/pages/admin");
      } else if (result.userData.rol === "empleado") {
        router.push("/pages/employee");
      } else {
        router.push("/pages/customer");
      }
    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={isVerificationStep ? handleVerify : handleRegister}
      className="space-y-4"
    >
      {!isVerificationStep ? (
        <>
          <InputField
            id="cedula"
            label="Cédula"
            type="text"
            value={cedula}
            onChange={(e) => {
              const numericValue = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 10);
              setCedula(numericValue);
            }}
            placeholder="Cédula"
          />
          <InputField
            id="nombre"
            label="Nombre"
            type="text"
            value={nombre}
            onChange={(e) => {
              const letterValue = e.target.value.replace(
                /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                ""
              );
              setNombre(letterValue);
            }}
            placeholder="Nombre"
          />

          <InputField
            id="apellido"
            label="Apellido"
            type="text"
            value={apellido}
            onChange={(e) => {
              const letterValue = e.target.value.replace(
                /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                ""
              );
              setApellido(letterValue);
            }}
            placeholder="Apellido"
          />
          <InputField
            id="direccion"
            label="Dirección"
            type="text"
            value={direccion}
            onChange={(e) => {
              const input = e.target.value;
              const filteredValue = input.replace(
                /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.-]/g,
                ""
              );

              setDireccion(filteredValue);
              setError(null); // Limpiar error si es válido
            }}
            placeholder="Dirección"
          />

          <InputField
            id="telefono"
            label="Teléfono"
            type="text"
            value={telefono}
            onChange={(e) => {
              const numericValue = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 10);
              setTelefono(numericValue);
            }}
            placeholder="Teléfono"
          />
          <InputField
            id="email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => {
              const input = e.target.value;
              const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

              if (!emailRegex.test(input)) {
                setError("Por favor ingresa un correo electrónico válido.");
              } else {
                setError(null); 
              }

              setEmail(input);
            }}
            placeholder="tucorreo@example.com"
          />

          <InputField
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </>
      ) : (
        <>
          <p className="text-gray-600 text-center mb-4">
            Ingresa el código de 6 dígitos enviado a tu correo.
          </p>
          <VerificationCodeInput
            value={verificationCode}
            onChange={(value) => setVerificationCode(value)}
          />
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
              <p className="text-gray-500">
                Puedes reenviar el código en {resendTimer} segundos
              </p>
            )}
          </div>
        </>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <AuthButton
        id="register-btn"
        text={isVerificationStep ? "Verificar Código" : "Registrarse"}
        isLoading={isLoading}
        onClick={isVerificationStep ? handleVerify : handleRegister}
      />
    </form>
  );
}
