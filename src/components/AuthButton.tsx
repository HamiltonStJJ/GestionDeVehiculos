import React from 'react';

export default function AuthButton({
    text,
    onClick,
    id,
    isLoading = false
  }: {
    text: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    id?: string;
    isLoading?: boolean;
  }) {
    return (
      <button
        id={id}
        type="submit"
        onClick={onClick}
        disabled={isLoading}
        className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-[#134B70] transition duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <span className="loading loading-dots loading-lg">
            
          </span>
        ) : (
          text
        )}
      </button>
    );
  }