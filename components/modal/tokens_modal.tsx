import Clipboard from '@components/clipboard';
import Modal from '@components/modal';
import { ASSET_URL } from '@constants/index';
import { Lock } from '@hooks/use_locks';
import { Token } from '@hooks/use_tokens';

const labelStyle = 'text-white text-opacity-50 text-base block';

export default function TokensModal({
  showModal,
  closeModal,
  token,
  locks,
}: {
  showModal: boolean;
  closeModal: () => void;
  token: Token | null;
  locks: Lock[];
}) {
  return (
    <Modal showModal={showModal} closeModal={closeModal}>
      <div className="flex items-center">
        <img
          className="rounded-full w-12 h-12"
          src={`${ASSET_URL}/${token?.token}.svg`}
          alt=""
        />
        <h4 className="pl-4 text-base font-bold text-white line-clamp-1 sm:text-lg">
          {token?.token}
        </h4>
      </div>
      <div className="mt-8 overflow-y-auto overscroll-contain h-full">
        {locks.length === 0 ? (
          <span className="block text-white text-base text-center">
            Token has no lockups.
          </span>
        ) : (
          <ul role="list" className="space-y-2">
            {locks.map((lockToken) => (
              <li
                key={`${lockToken.account}+${lockToken.timestamp}`}
                className="bg-backgroundItem bg-opacity-20 p-3 rounded-xl overflow-hidden"
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
                      {lockToken.lockedFormatted}
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
