import { SelectOption } from '@interfaces/index';
import classNames from 'classnames';
import { ChangeEvent } from 'react';

export default function Select({
  name,
  id,
  options,
  selectedOption,
  onChange,
  label = '',
  labelStyle,
  inputStyle,
}: {
  name: string;
  id?: string;
  options: SelectOption[];
  selectedOption: SelectOption | '';
  // eslint-disable-next-line no-unused-vars
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  labelStyle?: string;
  inputStyle?: string;
}) {
  return (
    <div>
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
      <div className="relative w-full rounded-xl bg-backgroundItem after:content-['▼'] after:top-2 after:text-white after:text-opacity-50 after:text-xs after:right-2 after:absolute">
        <select
          name={name}
          id={id}
          className={classNames(
            'w-full rounded-xl appearance-none border-0 bg-backgroundItem py-2 px-6 text-white placeholder:text-white placeholder:text-opacity-50 focus:ring-2 focus:ring-inset focus:ring-pink focus:outline-none',
            inputStyle
          )}
          value={selectedOption !== '' ? selectedOption.value : ''}
          onChange={onChange}
        >
          <option value="">Show all tokens</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
