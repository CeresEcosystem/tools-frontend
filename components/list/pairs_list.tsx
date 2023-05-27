import { ASSET_URL } from '@constants/index';
import Image from 'next/image';
import Lock from '@public/lock.svg';
import { Pair } from '@interfaces/index';

const labelStyle =
  'text-xs text-white text-opacity-50 text-right block sm:text-sm';
const infoStyle = 'block text-pink text-base text-end font-bold sm:text-xl';

export default function PairsList({
  pairs,
  showModal,
}: {
  pairs: Pair[];
  // eslint-disable-next-line no-unused-vars
  showModal: (show: boolean, pair: Pair) => void;
}) {
  return (
    <ul role="list" className="space-y-2 mt-8">
      {pairs.map((pair) => (
        <li
          key={`${pair.baseAssetId}+${pair.tokenAssetId}`}
          className="bg-backgroundItem p-4 rounded-xl flex flex-col items-center space-y-4 sm:space-x-4 sm:space-y-0 sm:flex-row sm:items-stretch"
        >
          <div className="flex w-full justify-between items-end sm:items-start">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center">
                <div className="mr-2 flex flex-shrink-0 sm:mr-4">
                  <img
                    className="rounded-full w-12 h-12 -mr-4 z-10"
                    src={`${ASSET_URL}/${pair.baseAsset}.svg`}
                    alt={pair.baseAsset}
                  />
                  <img
                    className="rounded-full left-8 w-12 h-12"
                    src={`${ASSET_URL}/${pair.token}.svg`}
                    alt={pair.baseAsset}
                  />
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1 sm:text-lg">
                  {`${pair.baseAsset} / ${pair.token}`}
                </h4>
              </div>
              <div className="flex flex-col space-y-1 sm:pl-24 sm:space-y-0">
                <span className="text-sm text-white font-bold pb-1 sm:text-base">
                  Pool details
                </span>
                <span className="text-sm font-medium text-white text-opacity-50 sm:text-base">
                  {`${pair.baseAsset}: `}
                  <span className="block text-white text-opacity-100 sm:inline-block">
                    {pair.baseLiquidityFormatted}
                  </span>
                </span>
                <span className="text-sm font-medium text-white text-opacity-50 sm:text-base">
                  {`${pair.token}: `}
                  <span className="block text-white text-opacity-100 sm:inline-block">
                    {pair.tokenLiquidityFormatted}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <p>
                <small className={labelStyle}>Pair liquidity</small>
                <span className={infoStyle}>{pair.liquidityFormatted}</span>
              </p>
              <p>
                <small className={labelStyle}>Volume</small>
                <span className={infoStyle}>{pair.volumeFormatted}</span>
              </p>
              <p>
                <small className={labelStyle}>Locked liquidity</small>
                <span className={infoStyle}>
                  {pair.lockedLiquidityFormatted}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => showModal(true, pair)}
            className="rounded-md w-full bg-white bg-opacity-10 px-3 py-1.5 flex max-w-xs justify-center items-center gap-x-1 hover:bg-opacity-20 sm:max-w-none sm:w-auto"
          >
            <Image className="h-5 w-auto shrink-0" src={Lock} alt="" />
            <span className="text-white text-sm sm:hidden">View locks</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
