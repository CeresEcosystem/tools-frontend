import { NEW_API_URL } from '@constants/index';
import { TimeFrame, TrackerData } from '@interfaces/index';
import { useCallback, useEffect, useRef, useState } from 'react';

export const timeFrames: TimeFrame = {
  DAY: '24h',
  WEEK: '7d',
  MONTH: '30d',
  ALL: 'all',
};

const useTracker = () => {
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState('PSWAP');

  const trackerData = useRef<TrackerData | undefined>();

  const changeToken = useCallback(
    (token: string) => {
      if (token !== selectedToken) {
        setSelectedToken(token);
      }
    },
    [selectedToken]
  );

  useEffect(() => {
    setLoading(true);

    fetch(`${NEW_API_URL}/tracker/v2/${selectedToken}`)
      .then(async (response) => {
        const json = (await response.json()) as TrackerData;
        trackerData.current = json;
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedToken]);

  return {
    loading,
    trackerData: trackerData.current,
    selectedToken,
    changeToken,
  };
};

export default useTracker;
