import { LOCK_API_URL } from '@constants/index';

export interface LockToken {
  account: string;
  locked: number;
  timestamp: number;
}

const useTokenLocks = () => {
  const getTokenLocks = async (token?: string): Promise<LockToken[]> => {
    if (token) {
      const response = await fetch(`${LOCK_API_URL}/lock/tokens/${token}`);
      if (response.ok) {
        const json = await response.json();
        return json?.data as LockToken[];
      }
    }

    return [];
  };

  return { getTokenLocks };
};

export default useTokenLocks;
