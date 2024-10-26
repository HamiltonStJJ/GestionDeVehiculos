export default function AuthButton({
    text,
    onClick,
  }: {
    text: string;
    onClick: () => void;
  }) {
    return (
      <button
        type="submit"
        onClick={onClick}
        className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-[#134B70] transition duration-200"
      >
        {text}
      </button>
    );
  }
  