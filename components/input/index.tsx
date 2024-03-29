import { ChangeEvent } from 'react';

export default function Input({
  handleChange,
  showIcon = true,
}: {
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showIcon?: boolean;
}) {
  return (
    <div className="relative w-full rounded-xl bg-backgroundItem">
      {showIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <i className="flaticon-magnifier text-xl mt-1.5 text-white"></i>
        </div>
      )}
      <input
        type="text"
        name="search"
        onChange={handleChange}
        className="block w-full rounded-xl border-0 bg-transparent py-2 pl-12 text-white placeholder:text-white placeholder:text-opacity-50 focus:ring-2 focus:ring-inset focus:ring-pink focus:outline-none"
        placeholder="Enter name or address"
      />
    </div>
  );
}
