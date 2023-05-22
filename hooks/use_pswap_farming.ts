import { NEW_API_URL } from '@constants/index';
import { Reward } from '@interfaces/index';
import { useEffect, useState } from 'react';

const usePSWAPFarming = () => {
  const [reward, setReward] = useState<Reward | undefined>();

  useEffect(() => {
    fetch(`${NEW_API_URL}/rewards`)
      .then(async (response) => {
        const json = (await response.json()) as Reward;
        setReward(json);
      })
      .catch(() => {});
  }, []);
  
  return { reward };
};

export default usePSWAPFarming;
