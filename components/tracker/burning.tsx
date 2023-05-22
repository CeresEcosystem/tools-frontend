import { Burn } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { useState } from 'react';
import TimeTab from '@components/tracker/time_tab';

const labelStyle = 'text-white text-opacity-50 text-sm mb-1';

function BurnData({ burn }: { burn?: Burn }) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('24');

  const format = useFormatter();

  if (burn) {
    return (
      <div className="flex flex-col space-y-8">
        <TimeTab
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
        />
        <div className="px-2">
          <p className={labelStyle}>PSWAP gross burn</p>
          <h5 className="text-2xl text-white font-bold xs:text-3xl">
            {formatNumber(format, burn[selectedTimeFrame].gross)}
            <span className="text-white font-medium text-opacity-50">
              {' PSWAP'}
            </span>
          </h5>
        </div>
        <div className="px-2">
          <p className={labelStyle}>PSWAP net burn</p>
          <h5 className="text-white font-bold text-lg">
            {formatNumber(format, burn[selectedTimeFrame].net)}
            <span className="text-white font-medium text-opacity-50">
              {' PSWAP'}
            </span>
          </h5>
        </div>
      </div>
    );
  }

  return <span className="text-white font-medium">No data</span>;
}

export default function Burning({ burn }: { burn?: Burn }) {
  return (
    <div className="px-4 py-8 w-full rounded-xl bg-backgroundItem bg-opacity-20 backdrop-blur-lg">
      <BurnData burn={burn} />
    </div>
  );
}