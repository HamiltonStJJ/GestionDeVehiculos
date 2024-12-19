export default function InputField({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    id,
  }: {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    id ?: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-800">{label}</label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          placeholder={placeholder}
          required
        />
      </div>
    );
  }
  