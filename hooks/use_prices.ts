import { NEW_API_URL } from '@constants/index';
import { Token } from '@interfaces/index';
import { RootState } from '@store/index';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const usePrices = () => {
  const { query, isReady } = useRouter();

  const favoriteTokens = useSelector(
    (state: RootState) => state.tokens.favoriteTokens
  );

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(
    favoriteTokens.length > 0
  );

  const prices = useRef<Token[]>([]);
  const [pricesFavorites, setPricesFavorites] = useState<Token[]>([]);

  const [currentToken, setCurrentToken] = useState<Token | undefined>();

  const priceInterval = useRef<ReturnType<typeof setInterval> | undefined>();

  const getPrices = useCallback(
    async (token?: string) => {
      return fetch(`${NEW_API_URL}/prices`)
        .then(async (response) => {
          if (response.ok) {
            const json = (await response.json()) as Token[];
            prices.current = json;
            setPricesFavorites(
              showOnlyFavorites
                ? json.filter((p) => favoriteTokens.includes(p.assetId))
                : json
            );

            if (token) {
              const t = json.find((t) => t.token === token)!;
              setCurrentToken(t);
            }
          }
        })
        .catch(() => {});
    },
    [favoriteTokens, showOnlyFavorites]
  );

  const changeCurrentToken = useCallback(
    (token: any) => {
      const t = prices.current.find((t) => t.token === token?.name)!;
      setCurrentToken(t);
    },
    [prices]
  );

  const changeCurrentTokenFromModal = useCallback((token: Token) => {
    setCurrentToken(token);
  }, []);

  const setPriceInterval = useCallback(async () => {
    priceInterval.current = setInterval(() => {
      getPrices();
    }, 60000);
  }, [getPrices]);

  const toggleFavorites = (favorites: boolean) => {
    if (favorites !== showOnlyFavorites) {
      setPricesFavorites(
        favorites
          ? prices.current.filter((p) => favoriteTokens.includes(p.assetId))
          : prices.current
      );
      setShowOnlyFavorites(favorites);
    }
  };

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
    prices: pricesFavorites,
    getPrices,
    changeCurrentToken,
    changeCurrentTokenFromModal,
    showOnlyFavorites,
    toggleFavorites,
  };
};

export default usePrices;
