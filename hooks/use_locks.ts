import { LOCK_API_URL } from '@constants/index';
import { formatDateFromTimestamp, formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';

export interface Lock {
  account: string;
  locked: number;
  timestamp: number;
  lockedFormatted: string | '';
  timestampFormatted: string | '';
}

const useLocks = () => {
  const format = useFormatter();

  const getLocks = async (
    baseToken?: string,
    token?: string
  ): Promise<Lock[]> => {
    if (token) {
      const url = baseToken
        ? `${LOCK_API_URL}/lock/pairs/${baseToken}/${token}`
        : `${LOCK_API_URL}/lock/tokens/${token}`;

      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const data = json.data as Lock[];

        const array = [];

        for (const lock of data) {
          array.push({
            ...lock,
            lockedFormatted: formatNumber(format, lock.locked),
            timestampFormatted: formatDateFromTimestamp(lock.timestamp),
          });
        }
        return array;
      }
    }

    return [];
  };

  return { getLocks };
};

export default useLocks;
