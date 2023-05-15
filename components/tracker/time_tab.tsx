import { formatTimeFrame } from '@utils/helpers';
import classNames from 'classnames';

const timeFrames = ['24', '7', '30', '-1'];

export default function TimeTab({
  selectedTimeFrame,
  setSelectedTimeFrame,
  label,
}: {
  selectedTimeFrame: string;
  // eslint-disable-next-line no-unused-vars
  setSelectedTimeFrame: (stf: string) => void;
  label?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      {label && (
        <span className="text-white px-2 text-opacity-50 text-base">
          {label}
        </span>
      )}
      <div className="flex px-2 space-x-4 xs:space-x-6">
        {timeFrames.map((time) => {
          const active = selectedTimeFrame === time;

          return (
            <span
              key={time}
              onClick={() => setSelectedTimeFrame(time)}
              className={classNames(
                'text-white cursor-pointer text-lg',
                active ? 'text-opacity-100' : 'text-opacity-50',
                'hover:text-opacity-100'
              )}
            >
              {formatTimeFrame(time)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
