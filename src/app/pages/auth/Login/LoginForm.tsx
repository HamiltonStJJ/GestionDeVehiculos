"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import InputField from "@/components/InputField";
import AuthButton from "@/components/AuthButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null); // Error específico del email
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneralError(null);

    // Validar el correo antes de enviar la solicitud
    if (!validateEmail(email)) {
      setEmailError("Por favor, ingresa un correo válido.");
      setIsLoading(false);
      return;
    }

    try {
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
      setGeneralError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Correo electrónico"
        id="email-input"
        type="email"
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          setEmail(value);
          if (!validateEmail(value)) {
            setEmailError("Por favor, ingresa un correo válido.");
          } else {
            setEmailError(null); // Limpiar error si el correo es válido
          }
        }}
        placeholder="tucorreo@example.com"
      />
      {emailError && <p className="text-red-500 text-sm">{emailError}</p>} {/* Error específico del email */}
      
      <InputField
        label="Contraseña"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      {generalError && <p className="text-red-500 text-sm">{generalError}</p>} {/* Error general */}
      
      <AuthButton
        id="login-btn"
        text="Ingresar"
        onClick={() => handleSubmit}
        isLoading={isLoading}
      />
    </form>
  );
}
