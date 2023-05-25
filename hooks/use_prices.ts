import { NEW_API_URL } from '@constants/index';
import { Token } from '@interfaces/index';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

const usePrices = () => {
  const { query, isReady } = useRouter();

  const prices = useRef<Token[]>([]);

  const [currentToken, setCurrentToken] = useState<Token | undefined>();

  const getPrices = useCallback(async (token: string) => {
    return fetch(`${NEW_API_URL}/prices`)
      .then(async (response) => {
        if (response.ok) {
          const json = (await response.json()) as Token[];
          prices.current = json;

          const t = json.find((t) => t.token === token)!;
          setCurrentToken(t);
        }
      })
      .catch(() => {});
  }, []);

  const changeCurrentToken = useCallback((token: any) => {
    const t = prices.current.find((t) => t.token === token?.name)!;
    setCurrentToken(t);
  }, []);

  const changeCurrentTokenFromModal = useCallback((token: Token) => {
    setCurrentToken(token);
  }, []);

  useEffect(() => {
    if (isReady) {
      const token = (query?.token as string) ?? 'CERES';
      getPrices(token);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return {
    currentToken,
    prices: prices.current,
    getPrices,
    changeCurrentToken,
    changeCurrentTokenFromModal,
  };
};

export default usePrices;
