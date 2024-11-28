export default function AuthButton({
    text,
    onClick,
    id,
  }: {
    text: string;
    onClick: () => void;
    id?: string;
  }) {
    return (
      <button
        id={id}
        type="submit"
        onClick={onClick}
        className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-[#134B70] transition duration-200"
      >
        {text}
      </button>
    );
  }
  