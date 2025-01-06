"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface ImageUploaderProps {
  onImageUpload: (url: string) => void; // Función para devolver la URL pública al componente padre
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Vista previa de la imagen
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("Por favor selecciona una imagen.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Intentar subir la imagen al bucket de Supabase
      const { error: uploadError } = await supabase.storage
        .from("Vehicles") // Asegúrate de usar el nombre correcto del bucket
        .upload(`public/${file.name}`, file, {
          cacheControl: "3600",
          upsert: false, // No sobrescribir archivos existentes
        });

      // Si la imagen ya existe
      if (uploadError && uploadError.message === "The resource already exists") {
        console.warn("La imagen ya existe. Usando la URL existente...");
      } else if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública de la imagen (ya sea nueva o existente)
      const { data: publicData } = supabase.storage
        .from("Vehicles")
        .getPublicUrl(`public/${file.name}`);

      const publicUrl = publicData.publicUrl;

      // Actualizar la vista previa y notificar al componente padre
      setPreviewUrl(publicUrl);
      onImageUpload(publicUrl);
    } catch (err) {
      console.error("Error al manejar la imagen:", err);
      setError("Error al manejar la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {uploading ? (
        // Skeleton de carga
        <div className="w-32 h-32 bg-gray-200 animate-pulse rounded border flex items-center justify-center">
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      ) : (
        previewUrl && (
          // Vista previa de la imagen
          <img
            src={previewUrl}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded border"
          />
        )
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
