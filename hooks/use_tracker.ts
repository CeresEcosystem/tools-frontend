import { NEW_API_URL } from '@constants/index';
import { TrackerData } from '@interfaces/index';
import { useCallback, useEffect, useRef, useState } from 'react';

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

    fetch(`${NEW_API_URL}/tracker/${selectedToken}`)
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
