"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import InputField from "@/components/InputField";
import AuthButton from "@/components/AuthButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      router.push("pages/customer");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Correo electrónico" type="email"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@example.com" />
      <InputField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <AuthButton text="Ingresar" onClick={() => handleSubmit} />
    </form>
  );  
}
