import Clipboard from '@components/clipboard';
import FallbackImage from '@components/image/fallback_image';
import Modal from '@components/modal';
import { ASSET_URL } from '@constants/index';
import { Lock, Pair } from '@interfaces/index';

const labelStyle = 'text-white text-opacity-50 text-base block';

export default function PairsModal({
  showModal,
  closeModal,
  pair,
  locks,
}: {
  showModal: boolean;
  closeModal: () => void;
  pair: Pair | null;
  locks: Lock[];
}) {
  return (
    <Modal showModal={showModal} closeModal={closeModal}>
      <div className="flex items-center">
        <div className="mr-4 flex flex-shrink-0">
          <FallbackImage
            className="rounded-full w-12 h-12 -mr-4 z-10"
            src={`${ASSET_URL}/${pair?.baseAsset}.svg`}
            alt={pair?.baseAsset ?? ''}
            fallback={`${ASSET_URL}/${pair?.baseAsset}.png`}
          />
          <FallbackImage
            className="rounded-full left-8 w-12 h-12"
            src={`${ASSET_URL}/${pair?.token}.svg`}
            alt={pair?.token ?? ''}
            fallback={`${ASSET_URL}/${pair?.token}.png`}
          />
        </div>
        <h4 className="text-base font-bold text-white line-clamp-1 sm:text-lg">
          {`${pair?.baseAsset} / ${pair?.token}`}
        </h4>
      </div>
      <div className="mt-8 overflow-y-auto overscroll-contain h-full">
        {locks.length === 0 ? (
          <span className="block text-white text-base text-center">
            Pair has no liquidity lockups.
          </span>
        ) : (
          <ul role="list" className="space-y-2">
            {locks.map((lockToken) => (
              <li
                key={`${lockToken.account}+${lockToken.timestamp}`}
                className="bg-backgroundItem p-3 rounded-xl overflow-hidden"
              >
                <span className={labelStyle}>Account</span>
                <Clipboard text={lockToken.account}>
                  <span className="text-white block break-words cursor-pointer text-xs font-medium">
                    {lockToken.account}
                  </span>
                </Clipboard>
                <div className="grid grid-cols-6 mt-3">
                  <div className="col-span-3 flex flex-col sm:col-span-2">
                    <span className={labelStyle}>Locked</span>
                    <span className="text-xs text-white font-medium sm:text-sm">
                      {`${lockToken.lockedFormatted}%`}
                    </span>
                  </div>
                  <div className="col-span-3 flex flex-col sm:col-span-4">
                    <span className={labelStyle}>Unlock time</span>
                    <span className="text-white text-xs font-medium sm:text-sm">
                      {lockToken.timestampFormatted}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
