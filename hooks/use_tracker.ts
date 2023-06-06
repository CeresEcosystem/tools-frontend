import { NEW_API_URL } from '@constants/index';
import { TrackerData } from '@interfaces/index';
import { useEffect, useRef, useState } from 'react';

const useTracker = () => {
  const [loading, setLoading] = useState(true);

  const trackerData = useRef<TrackerData | undefined>();

  useEffect(() => {
    // TODO: promeniti da se dinamicki prosledjuje token
    fetch(`${NEW_API_URL}/tracker/PSWAP`)
      .then(async (response) => {
        const json = (await response.json()) as TrackerData;
        trackerData.current = json;
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { loading, trackerData: trackerData.current };
};

export default useTracker;
