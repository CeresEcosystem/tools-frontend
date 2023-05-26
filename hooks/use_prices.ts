import { NEW_API_URL } from '@constants/index';
import { Token } from '@interfaces/index';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

const usePrices = () => {
  const { query, isReady } = useRouter();

  const [prices, setPrices] = useState<Token[]>([]);

  const [currentToken, setCurrentToken] = useState<Token | undefined>();

  const priceInterval = useRef<
    ReturnType<typeof setInterval> | undefined
  >();

  const getPrices = useCallback(async (token?: string) => {
    return fetch(`${NEW_API_URL}/prices`)
      .then(async (response) => {
        if (response.ok) {
          const json = (await response.json()) as Token[];
          setPrices(json);

          if (token) {
            const t = json.find((t) => t.token === token)!;
            setCurrentToken(t);
          }
        }
      })
      .catch(() => {});
  }, []);

  const changeCurrentToken = useCallback((token: any) => {
    const t = prices.find((t) => t.token === token?.name)!;
    setCurrentToken(t);
  }, [prices]);

  const changeCurrentTokenFromModal = useCallback((token: Token) => {
    setCurrentToken(token);
  }, []);

  const setPriceInterval = useCallback(async () => {
    priceInterval.current = setInterval(() => {
      getPrices();
    }, 30000);
  }, [getPrices]);

  useEffect(() => {
    if (isReady) {
      const token = (query?.token as string) ?? 'CERES';
      getPrices(token);
      setPriceInterval();
    }

    return () => {
      clearInterval(priceInterval.current);
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return {
    currentToken,
    prices,
    getPrices,
    changeCurrentToken,
    changeCurrentTokenFromModal,
  };
};

export default usePrices;
