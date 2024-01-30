import { timeFrames } from '@hooks/use_tracker';
import classNames from 'classnames';

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
        {Object.keys(timeFrames).map((time) => {
          const active = selectedTimeFrame === time;

          return (
            <span
              key={time}
              onClick={() => {
                if (!active) {
                  setSelectedTimeFrame(time);
                }
              }}
              className={classNames(
                'text-white cursor-pointer text-lg',
                active ? 'text-opacity-100' : 'text-opacity-50',
                'hover:text-opacity-100'
              )}
            >
              {timeFrames[time]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
