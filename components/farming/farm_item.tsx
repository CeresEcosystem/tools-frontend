import { ASSET_URL } from '@constants/index';
import { FarmData, PoolData } from '@interfaces/index';
import { checkNumberValue, formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import Image from 'next/image';

function FarmInfo({ label, info }: { label: string; info: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-white text-opacity-50 font-bold text-xs">
        {label}
      </span>
      <span className="font-bold text-xs text-white">{info}</span>
    </div>
  );
}

export default function FarmItem({
  item,
  isFarm = true,
}: {
  item: FarmData | PoolData;
  isFarm?: boolean;
}) {
  const format = useFormatter();

  const renderImages = () => {
    if (isFarm) {
      const farmItem = item as FarmData;

      return (
        <div className="relative inline-flex">
          <div className="h-8 w-8 rounded-full md:h-12 md:w-12">
            <div className="bg-gray h-full w-full rounded-full">
              <Image
                src={`${ASSET_URL}/${farmItem.baseAsset}.svg`}
                alt=""
                width={44}
                height={44}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="h-8 w-8 absolute left-4 rounded-full md:h-12 md:w-12 md:left-6">
            <div className="bg-gray h-full w-full rounded-full">
              <Image
                src={`${ASSET_URL}/${farmItem.token}.svg`}
                alt=""
                width={44}
                height={44}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      );
    }

    const poolItem = item as PoolData;

    return (
      <div className="h-12 w-12 p-1 rounded-full bg-gradient-to-r from-goldLight to-goldDark">
        <div className="bg-gray h-full w-full rounded-full">
          <Image
            src={`${ASSET_URL}/${poolItem.token}.svg`}
            alt=""
            width={44}
            height={44}
            className="rounded-full"
          />
        </div>
      </div>
    );
  };

  const getTitle = () => {
    if (isFarm) return `${(item as FarmData).baseAsset} / ${item.token}`;

    return (item as PoolData).token;
  };

  const getDetails = () => {
    if (isFarm) {
      return (
        <FarmInfo
          label={'Liquidity:'}
          info={
            checkNumberValue((item as FarmData).totalLiquidity)
              ? `$${formatNumber(format, (item as FarmData).totalLiquidity)}`
              : 'Calculating...'
          }
        />
      );
    }

    return (
      <FarmInfo
        label={'Staked:'}
        info={
          checkNumberValue((item as PoolData).stakedTotal)
            ? `$${formatNumber(format, (item as PoolData).stakedTotal)}`
            : 'Calculating...'
        }
      />
    );
  };

  return (
    <li className="p-2 rounded-xl flex flex-col bg-backgroundItem bg-opacity-20 backdrop-blur-lg md:p-4">
      <div className="inline-flex items-center justify-between">
        {renderImages()}
        <div className="flex flex-col items-end">
          <span className="font-bold text-white text-xs md:text-sm">
            {getTitle()}
          </span>
        </div>
      </div>
      <ul role="list" className="mt-4 divide-y divide-white divide-opacity-10">
        <FarmInfo
          label={'APR:'}
          info={
            checkNumberValue(item.apr)
              ? `${formatNumber(format, item.apr)}%`
              : 'Calculating...'
          }
        />
        <FarmInfo label={'Earn:'} info={item.earn} />
        <FarmInfo
          label={'Fee:'}
          info={`${formatNumber(format, item.depositFee)}%`}
        />
        {getDetails()}
      </ul>
    </li>
  );
}
