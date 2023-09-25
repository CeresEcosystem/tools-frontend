import { formatToCurrency, formatWalletAddress } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import usePagination from '@hooks/use_pagination';
import { Token, TokensReturnType } from '@interfaces/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { addToFavorites, removeFromFavorites } from '@store/tokens/token_slice';
import { SYNTHETICS_FILTER } from '@constants/index';

const limiter = 10;

const useTokens = (data?: Token[]): TokensReturnType => {
  const format = useFormatter();

  const dispatch = useDispatch();
  const favoriteTokens = useSelector(
    (state: RootState) => state.tokens.favoriteTokens
  );

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(
    favoriteTokens.length > 0
  );

  const [syntheticsFilter, setSyntheticsFilter] = useState(false);

  const dataFormatted = useRef<Token[]>(
    data?.map((t) => {
      return {
        ...t,
        assetIdFormatted: formatWalletAddress(t.assetId),
        priceFormatted: formatToCurrency(format, t.price),
      };
    }) || []
  );

  const getAllTokens = useCallback(
    (
      showFavorites = showOnlyFavorites,
      filterBySynthetics = syntheticsFilter
    ) => {
      let arrayFiltered = [];

      if (showFavorites) {
        arrayFiltered = dataFormatted.current.filter((item) =>
          favoriteTokens.includes(item.assetId)
        );
      } else {
        arrayFiltered = dataFormatted.current;
      }

      if (filterBySynthetics) {
        arrayFiltered = arrayFiltered.filter((token) =>
          token.assetId.startsWith(SYNTHETICS_FILTER)
        );
      }

      return arrayFiltered;
    },
    [favoriteTokens, showOnlyFavorites, syntheticsFilter]
  );

  const [allTokens, setAllTokens] = useState<Token[]>(getAllTokens());
  const [tokens, setTokens] = useState(allTokens);

  const [tokenSlice, setTokenSlice] = useState(
    showOnlyFavorites ? allTokens : allTokens.slice(0, limiter)
  );

  const currentPage = useRef(0);
  const totalPages = useRef(
    allTokens ? Math.ceil(allTokens.length / limiter) : 0
  );

  const { goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage } =
    usePagination<Token>(
      currentPage.current,
      totalPages.current,
      tokens,
      (cp: number) => (currentPage.current = cp),
      (array: Array<Token>) => setTokenSlice(array),
      limiter
    );

  const resetData = (allTs = allTokens, favorites = showOnlyFavorites) => {
    setTokens(allTs);
    currentPage.current = 0;
    totalPages.current = allTs ? Math.ceil(allTs.length / limiter) : 0;
    setTokenSlice(favorites ? allTs : allTs.slice(0, limiter));
  };

  const handleTokenSearch = (search: ChangeEvent<HTMLInputElement>) => {
    if (search.target.value !== '') {
      setTokens(
        allTokens?.filter(
          (token) =>
            token.assetId
              .toUpperCase()
              .includes(search.target.value.toUpperCase()) ||
            token.fullName
              .toUpperCase()
              .includes(search.target.value.toUpperCase())
        )
      );
      currentPage.current = 0;
      totalPages.current = tokens ? Math.ceil(tokens.length / limiter) : 0;
      setTokenSlice(showOnlyFavorites ? tokens : tokens.slice(0, limiter));
    } else {
      resetData();
    }
  };

  const toggleFavorites = (favorites: boolean) => {
    if (favorites !== showOnlyFavorites) {
      const tokensFiltered: Token[] = getAllTokens(favorites);
      setAllTokens(tokensFiltered);
      resetData(tokensFiltered, favorites);
      setShowOnlyFavorites(favorites);
    }
  };

  const addTokenToFavorites = (token: Token) => {
    dispatch(addToFavorites(token.assetId));
  };

  const removeTokenFromFavorites = (token: Token) => {
    dispatch(removeFromFavorites(token.assetId));
  };

  const handleSyntheticsFilter = () => {
    const filter = !syntheticsFilter;
    setSyntheticsFilter(filter);

    const tokensFiltered: Token[] = getAllTokens(showOnlyFavorites, filter);
    setAllTokens(tokensFiltered);
    resetData(tokensFiltered);
  };

  return {
    tokens: tokenSlice,
    totalPages: totalPages.current,
    currentPage: currentPage.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    handleTokenSearch,
    addTokenToFavorites,
    removeTokenFromFavorites,
    showOnlyFavorites,
    toggleFavorites,
    favoriteTokens,
    syntheticsFilter,
    handleSyntheticsFilter,
  };
};

export default useTokens;
