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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(email, password);

      if (result.status === "TEMPORARY_PASSWORD") {
        router.push(`pages/auth/change-password?userId=${result.userData._id}`);
      } else if (result.userData.rol === "admin") {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Correo electrónico"
        id="email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tucorreo@example.com"
      />
      <InputField
        label="Contraseña"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <AuthButton
        id="login-btn"
        text="Ingresar"
        onClick={() => handleSubmit}
        isLoading={isLoading}
      />
    </form>
  );
}
