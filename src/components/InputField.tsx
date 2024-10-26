export default function InputField({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-800">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    );
  }
  