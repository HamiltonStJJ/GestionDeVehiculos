"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/services/authService";
import InputField from "@/components/InputField";
import AuthButton from "@/components/AuthButton";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await requestPasswordReset(email);
      setSuccessMessage("Correo de recuperación enviado con éxito.");
      setError(null);
    } catch (err) {
      setError("Error al enviar el correo de recuperación.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@example.com" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      <AuthButton text="Recuperar ahora" onClick={()=> handleSubmit} />
    </form>
  );
}
