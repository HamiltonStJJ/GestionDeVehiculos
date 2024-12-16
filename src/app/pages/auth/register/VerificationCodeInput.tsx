import React, { useRef } from "react";

interface VerificationCodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export default function VerificationCodeInput({
  length = 6,
  value,
  onChange,
}: VerificationCodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Maneja el cambio en cada input
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, ""); // Solo números
    const updatedValue = value.split("");
    updatedValue[index] = newValue;
    const finalValue = updatedValue.join("").slice(0, length);

    onChange(finalValue);

    // Mueve el foco al siguiente input si hay un valor
    if (newValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Maneja pegar todos los valores
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, length).replace(/[^0-9]/g, "");
    onChange(pastedData);
    e.preventDefault();
  };

  // Renderiza los inputs
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          value={value[index] || ""}
          onChange={(e) => handleInputChange(index, e)}
          onPaste={handlePaste}
          maxLength={1}
          className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          type="text"
        />
      ))}
    </div>
  );
}
