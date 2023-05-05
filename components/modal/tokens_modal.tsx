import Clipboard from '@components/clipboard';
import Modal from '@components/modal';
import { ASSET_URL } from '@constants/index';
import { LockToken } from '@hooks/use_token_locks';
import { Token } from '@hooks/use_tokens';
import { formatDateFromTimestamp, formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import Image from 'next/image';

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
  locks: LockToken[];
}) {
  const formatter = useFormatter();

  return (
    <Modal showModal={showModal} closeModal={closeModal}>
      <div className="flex items-center">
        <Image
          className="rounded-full"
          src={`${ASSET_URL}/${token?.token}.svg`}
          width={48}
          height={48}
          alt=""
        />
        <h4 className="pl-4 text-base font-bold text-white line-clamp-1 sm:text-lg">
          {token?.token}
        </h4>
      </div>
      <div className="mt-8">
        {locks.length === 0 ? (
          <span className="block text-white text-base text-center">
            Token has no lockups.
          </span>
        ) : (
          <ul role="list" className="space-y-2">
            {locks.map((lockToken) => (
              <li
                key={`${lockToken.account}+${lockToken.timestamp}`}
                className="bg-backgroundHeader bg-opacity-20 p-3 rounded-xl overflow-hidden"
              >
                <span className={labelStyle}>Account</span>
                <Clipboard text={lockToken.account}>
                  <span className="text-white cursor-pointer text-xs font-medium line-clamp-2">
                    {lockToken.account}
                  </span>
                </Clipboard>
                <div className="grid grid-cols-6 mt-3">
                  <div className="flex flex-col col-span-2">
                    <span className={labelStyle}>Locked</span>
                    <span className="text-white text-sm font-medium line-clamp-2">
                      {formatNumber(formatter, lockToken.locked)}
                    </span>
                  </div>
                  <div className="flex flex-col col-span-4">
                    <span className={labelStyle}>Unlock time</span>
                    <span className="text-white text-sm font-medium line-clamp-2">
                      {formatDateFromTimestamp(lockToken.timestamp)}
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
