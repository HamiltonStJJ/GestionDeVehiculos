    "use client";

import { useState } from "react";
import { register } from "@/services/authService";
import InputField from "@/components/InputField";
import AuthButton from "@/components/AuthButton";

export default function RegisterForm() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register({ cedula, nombre, apellido, direccion, telefono, email, password });
      alert("Registro completado con éxito.");
    } catch (err) {
      setError("Hubo un error en el registro.");
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField id="cedula" label="Cédula" type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Cédula" />
      <InputField id="nombre" label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <InputField id="apellido" label="Apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" />
      <InputField id="direccion" label="Dirección" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" />
      <InputField id="telefono" label="Teléfono" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
      <InputField id="email" label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@example.com" />
      <InputField id="password" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <AuthButton id="register-btn" text="Registrarse" isLoading={isLoading} onClick={()=>handleSubmit} />  
    </form>
  );
}
