import { ChangeEvent } from 'react';

export default function InputState({
  type = 'text',
  name,
  id,
  value,
  handleChange,
  showIcon = true,
  placeholder,
  label = '',
  required = false,
  disabled = false,
}: {
  type?: string;
  name: string;
  id?: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showIcon?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      {label !== '' && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-white"
        >
          {label}
        </label>
      )}
      <div className="relative w-full rounded-xl bg-backgroundItem">
        {showIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="flaticon-magnifier text-xl mt-1.5 text-white"></i>
          </div>
        )}
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          required={required}
          className="block w-full rounded-xl border-0 bg-transparent py-2 px-6 text-white placeholder:text-white placeholder:text-opacity-50 focus:ring-2 focus:ring-inset focus:ring-pink focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
