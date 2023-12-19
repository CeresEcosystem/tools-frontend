import { NEW_API_URL } from '@constants/index';
import { TBCReservesData } from '@interfaces/index';
import { useEffect, useRef, useState } from 'react';

const useTBCReserves = () => {
  const [loading, setLoading] = useState(true);

  const tbcReserves = useRef<TBCReservesData | undefined>();

  useEffect(() => {
    async function fetchTBCReserves() {
      const response = await fetch(`${NEW_API_URL}/reserves/TBCD`);

      if (response.ok) {
        const json = (await response.json()) as TBCReservesData;
        tbcReserves.current = json;
      }

      setLoading(false);
    }

    fetchTBCReserves();
  }, []);

  return {
    loading,
    tbcReserves: tbcReserves.current,
  };
};

export default useTBCReserves;
