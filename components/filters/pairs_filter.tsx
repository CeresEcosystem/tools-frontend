import { ASSET_URL } from '@constants/index';
import { volumeIntervals } from '@hooks/use_pairs';
import { VolumeInterval } from '@interfaces/index';
import classNames from 'classnames';

export default function PairsFilter({
  baseAssets,
  selectedBaseAsset,
  handleBaseAssetChange,
  syntheticsFilter,
  handleSyntheticsFilter,
  volumeTimeInterval,
  setVolumeTimeInterval,
}: {
  baseAssets: string[];
  selectedBaseAsset: string;
  // eslint-disable-next-line no-unused-vars
  handleBaseAssetChange: (bAsset: string) => void;
  syntheticsFilter: boolean;
  handleSyntheticsFilter: () => void;
  volumeTimeInterval: string;
  // eslint-disable-next-line no-unused-vars
  setVolumeTimeInterval: (volumeTimeInterval: keyof VolumeInterval) => void;
}) {
  return (
    <div className="flex flex-wrap mt-4 items-center justify-between gap-x-2 gap-y-4">
      <div className="flex items-center gap-2 flex-wrap xs:flex-nowrap xs:flex-shrink-0">
        {baseAssets.map((baseAsset) => {
          const active = baseAsset === selectedBaseAsset;

          return (
            <div
              key={baseAsset}
              onClick={() => handleBaseAssetChange(baseAsset)}
              className={classNames(
                'bg-backgroundHeader px-3 py-1 rounded-3xl text-center cursor-pointer flex items-center justify-center',
                active ? 'opacity-100' : 'opacity-50',
                'hover:opacity-100'
              )}
            >
              {baseAsset !== 'All' ? (
                <img
                  src={`${ASSET_URL}/${baseAsset}.svg`}
                  alt={baseAsset}
                  className="h-6 w-6 mr-2 rounded-full"
                />
              ) : (
                <div className="h-6 w-0" />
              )}
              <span className="text-sm text-white font-medium">
                {baseAsset}
              </span>
            </div>
          );
        })}
        <div
          onClick={() => handleSyntheticsFilter()}
          className={classNames(
            'bg-backgroundHeader px-3 py-1 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-2',
            syntheticsFilter ? 'opacity-100' : 'opacity-50',
            'hover:opacity-100'
          )}
        >
          <img
            src={`${ASSET_URL}/XST.svg`}
            alt="XST"
            className="h-6 w-6 rounded-full"
          />
          <span className="text-sm text-white font-medium">Synthetics</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap xs:flex-nowrap xs:flex-shrink-0">
        <span className="text-white text-xs text-opacity-50 sm:text-sm">
          Volume interval
        </span>
        {volumeIntervals.map((vi) => {
          const activeVI = vi === volumeTimeInterval;

          return (
            <div
              key={vi}
              onClick={() => setVolumeTimeInterval(vi as keyof VolumeInterval)}
              className={classNames(
                'bg-backgroundHeader rounded-3xl px-3 py-1 cursor-pointer',
                activeVI && 'bg-pink'
              )}
            >
              <span
                className={classNames(
                  'text-sm text-white font-medium hover:text-opacity-100',
                  activeVI ? 'text-opacity-100' : 'text-opacity-50'
                )}
              >
                {vi}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
