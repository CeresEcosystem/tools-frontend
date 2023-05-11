import { ASSET_URL } from '@constants/index';
import classNames from 'classnames';

export default function PairsFilter({
  baseAssets,
  selectedBaseAsset,
  handleBaseAssetChange,
}: {
  baseAssets: string[];
  selectedBaseAsset: string;
  // eslint-disable-next-line no-unused-vars
  handleBaseAssetChange: (bAsset: string) => void;
}) {
  return (
    <div className="flex flex-wrap mt-2">
      {baseAssets.map((baseAsset) => {
        const active = baseAsset === selectedBaseAsset;

        return (
          <div
            key={baseAsset}
            onClick={() => handleBaseAssetChange(baseAsset)}
            className={classNames(
              'bg-backgroundHeader mx-1 mt-2 px-4 py-1 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-2',
              active ? 'opacity-100' : 'opacity-50',
              'hover:opacity-100'
            )}
          >
            {baseAsset !== 'All' && (
              <img
                src={`${ASSET_URL}/${baseAsset}.svg`}
                alt={baseAsset}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="text-sm text-white font-medium md:text-base">
              {baseAsset}
            </span>
          </div>
        );
      })}
    </div>
  );
}
