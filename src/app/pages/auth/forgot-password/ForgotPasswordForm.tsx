"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import AuthButton from "@/components/AuthButton";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      
      setSuccessMessage("Correo de recuperación enviado con éxito.");
      setError(null);
    } catch (err) {
      console.error("Error al enviar el correo de recuperación:", err);
      setError("Error al enviar el correo de recuperación.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  <InputField
    id="correo"
    label="Correo electrónico"
    type="email"
    value={email}
    onChange={(e) => {
      const input = e.target.value;
      setEmail(input);
      
      // Validación de formato de correo electrónico
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      // Verificar si el correo es válido
      if (!emailRegex.test(input)) {
        setError("Por favor ingresa un correo electrónico válido.");
      } else {
        setError(null); // Limpiar el error si el correo es válido
      }
    }}
    placeholder="tucorreo@example.com"
  />
  
  {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      <AuthButton id="recuperar-btn" text="Recuperar ahora" isLoading={isLoading} onClick={()=> handleSubmit} />
    </form>
  );
}
