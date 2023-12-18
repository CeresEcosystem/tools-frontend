import { ChangeEvent } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({
  name,
  id,
  value,
  onChangeDate,
  label,
  showTimeSelect = true,
  required = false,
}: {
  name: string;
  id: string;
  value: Date | null;
  // eslint-disable-next-line no-unused-vars
  onChangeDate: (date: Date) => void;
  label?: string;
  showTimeSelect?: boolean;
  required?: boolean;
}) => {
  const handleDateChangeRaw = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const getMinDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  };

  return (
    <div className="w-full">
      {label !== '' && (
        <label
          htmlFor={id}
          className="block mb-2 text-xs font-medium text-white text-opacity-50"
        >
          {label}
        </label>
      )}
      <DatePicker
        id={id}
        name={name}
        required={required}
        className="text-xs w-full rounded-xl py-2 px-4 bg-backgroundItem placeholder-white placeholder:opacity-80 text-white focus:ring-2 focus:ring-inset focus:ring-pink focus:outline-none"
        selected={value}
        onChange={(date: Date) => onChangeDate(date)}
        minDate={getMinDate()}
        maxDate={new Date()}
        showTimeSelect={showTimeSelect}
        dateFormat="dd.MM.yyyy HH:mm"
        timeFormat="HH:mm"
        showYearDropdown={false}
        timeIntervals={15}
        onChangeRaw={handleDateChangeRaw}
        dropdownMode={'select'}
        placeholderText="Pick a date"
        isClearable
        autoComplete="off"
      />
    </div>
  );
};

export default DateTimePicker;
