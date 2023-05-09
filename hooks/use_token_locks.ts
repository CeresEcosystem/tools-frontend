import { LOCK_API_URL } from '@constants/index';
import { formatDateFromTimestamp, formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';

export interface LockToken {
  account: string;
  locked: number;
  timestamp: number;
  lockedFormatted: string | '';
  timestampFormatted: string | '';
}

const useTokenLocks = () => {
  const format = useFormatter();
  
  const getTokenLocks = async (token?: string): Promise<LockToken[]> => {
    if (token) {
      const response = await fetch(`${LOCK_API_URL}/lock/tokens/${token}`);
      if (response.ok) {
        const json = await response.json();
        const data = json.data as LockToken[];

        const array = [];

        for (const lockToken of data) {
          array.push(
            {
              ...lockToken,
              lockedFormatted: formatNumber(format, lockToken.locked),
              timestampFormatted: formatDateFromTimestamp(lockToken.timestamp),
            }
          );
        }
        return array;
      }
    }

    return [];
  };

  return { getTokenLocks };
};

export default useTokenLocks;
