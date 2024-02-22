import classNames from 'classnames';
import { ChangeEvent, KeyboardEvent } from 'react';

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
  labelStyle,
  inputStyle,
  inputBgColor = 'bg-backgroundItem',
  containerClassName,
  onKeyDown,
}: {
  type?: string;
  name: string;
  id?: string;
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showIcon?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  labelStyle?: string;
  inputStyle?: string;
  inputBgColor?: string;
  containerClassName?: string;
  // eslint-disable-next-line no-unused-vars
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={containerClassName}>
      {label !== '' && (
        <label
          htmlFor={id}
          className={classNames(
            'block mb-2 text-sm font-medium text-white',
            labelStyle
          )}
        >
          {label}
        </label>
      )}
      <div className={classNames('relative w-full rounded-xl', inputBgColor)}>
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
          onKeyDown={onKeyDown}
          required={required}
          className={classNames(
            'block w-full rounded-xl border-0 bg-transparent py-2 px-6 text-white placeholder:text-white placeholder:text-opacity-50 focus:ring-2 focus:ring-inset focus:ring-pink focus:outline-none',
            inputStyle
          )}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
