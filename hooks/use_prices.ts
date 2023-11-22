import { NEW_API_URL } from '@constants/index';
import { Token } from '@interfaces/index';
import { RootState } from '@store/index';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    flutter_inappwebview: any;
  }
}

const TOKEN = 'CHART_TOKEN';

const usePrices = () => {
  const { query, isReady } = useRouter();

  const favoriteTokens = useSelector(
    (state: RootState) => state.tokens.favoriteTokens
  );

  const [prices, setPrices] = useState<Token[]>([]);

  const [currentToken, setCurrentToken] = useState<
    Token | string | undefined
  >();

  const priceInterval = useRef<ReturnType<typeof setInterval> | undefined>();

  const sortTokens = useCallback(
    (tokenA: Token, tokenB: Token) => {
      const aIsFavorite = favoriteTokens.includes(tokenA.assetId);
      const bIsFavorite = favoriteTokens.includes(tokenB.assetId);

      if (aIsFavorite && !bIsFavorite) {
        return -1;
      } else if (!aIsFavorite && bIsFavorite) {
        return 1;
      } else {
        return 0;
      }
    },
    [favoriteTokens]
  );

  const getPrices = useCallback(
    async (token?: string) => {
      return fetch(`${NEW_API_URL}/prices`)
        .then(async (response) => {
          if (response.ok) {
            const json = (await response.json()) as Token[];
            const sortedTokens = json.slice().sort(sortTokens);

            for (let i = 0; i < favoriteTokens.length; i++) {
              sortedTokens[i].isFavorite = true;
            }

            setPrices(json.slice().sort(sortTokens));

            if (token) {
              const t = json.find((t) => t.token === token)!;
              setCurrentToken(t);
            }
          }
        })
        .catch(() => {});
    },
    [favoriteTokens.length, sortTokens]
  );

  const changeCurrentToken = useCallback(
    (token: any) => {
      const t = prices.find((t) => t.token === token?.name)!;
      localStorage.setItem(TOKEN, t.token);
      setCurrentToken(t);

      window.flutter_inappwebview?.callHandler('tokenChange', t.token);
    },
    [prices]
  );

  const changeCurrentTokenFromModal = useCallback((token: Token | string) => {
    if (typeof token !== 'string') {
      localStorage.setItem(TOKEN, token.token);
    }

    setCurrentToken(token);
  }, []);

  const setPriceInterval = useCallback(async () => {
    priceInterval.current = setInterval(() => {
      getPrices();
    }, 60000);
  }, [getPrices]);

  useEffect(() => {
    if (isReady) {
      const chartToken = localStorage.getItem(TOKEN);
      const tokenQuery = query?.token;

      if (tokenQuery) {
        const token = query.token as string;

        getPrices(token);

        if (token !== chartToken) {
          localStorage.setItem(TOKEN, token);
        }
      } else {
        getPrices(chartToken ?? 'CERES');
      }

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
    changeCurrentToken,
    changeCurrentTokenFromModal,
  };
};

export default usePrices;
