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

const filters = ['All', 'Favorites', 'Synthetics'];

const useTokens = (data?: Token[]): TokensReturnType => {
  const format = useFormatter();

  const dispatch = useDispatch();
  const favoriteTokens = useSelector(
    (state: RootState) => state.tokens.favoriteTokens
  );

  const [showPriceConverter, setShowPriceConverter] = useState(false);

  const [filter, setFilter] = useState(
    favoriteTokens.length > 0 ? filters[1] : filters[0]
  );

  const dataFormatted = useRef<Token[]>(
    data?.map((t) => {
      return {
        ...t,
        assetIdFormatted: formatWalletAddress(t.assetId),
        priceFormatted: formatToCurrency(format, t.price),
      };
    }) || []
  );

  const searchQuery = useRef('');

  const getAllTokens = useCallback(
    (tokenFilter = filter) => {
      switch (tokenFilter) {
        case 'All':
          return dataFormatted.current;
        case 'Favorites':
          return dataFormatted.current.filter((item) =>
            favoriteTokens.includes(item.assetId)
          );
        case 'Synthetics':
          return dataFormatted.current.filter((token) =>
            token.assetId.startsWith(SYNTHETICS_FILTER)
          );
        default:
          return dataFormatted.current;
      }
    },
    [favoriteTokens, filter]
  );

  const [allTokens, setAllTokens] = useState<Token[]>(getAllTokens());
  const [tokens, setTokens] = useState(allTokens);

  const [tokenSlice, setTokenSlice] = useState(
    filter === 'Favorites' ? allTokens : allTokens.slice(0, limiter)
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

  const resetData = (allTs: Token[], filt: string) => {
    setTokens(allTs);
    currentPage.current = 0;
    totalPages.current = allTs ? Math.ceil(allTs.length / limiter) : 0;
    setTokenSlice(filt === 'Favorites' ? allTs : allTs.slice(0, limiter));
  };

  const handleTokenSearch = (
    search?: ChangeEvent<HTMLInputElement>,
    allTs = allTokens,
    filt = filter
  ) => {
    const s = search?.target.value ?? searchQuery.current;

    if (s !== '') {
      const searchedTokens = allTs?.filter(
        (token) =>
          token.assetId.toUpperCase().includes(s.toUpperCase()) ||
          token.fullName.toUpperCase().includes(s.toUpperCase())
      );

      setTokens(searchedTokens);
      currentPage.current = 0;
      totalPages.current = searchedTokens
        ? Math.ceil(searchedTokens.length / limiter)
        : 0;
      setTokenSlice(
        filt === 'Favorites' ? searchedTokens : searchedTokens.slice(0, limiter)
      );
    } else {
      resetData(allTs, filt);
    }

    searchQuery.current = s;
  };

  const toggleFilter = (tokenFilter: string) => {
    if (tokenFilter !== filter) {
      const tokensFiltered: Token[] = getAllTokens(tokenFilter);
      setAllTokens(tokensFiltered);
      handleTokenSearch(undefined, tokensFiltered, tokenFilter);
      setFilter(tokenFilter);
    }
  };

  const addTokenToFavorites = (token: Token) => {
    dispatch(addToFavorites(token.assetId));
  };

  const removeTokenFromFavorites = (token: Token) => {
    dispatch(removeFromFavorites(token.assetId));
  };

  return {
    tokens: tokenSlice,
    allTokens: dataFormatted.current,
    totalPages: totalPages.current,
    currentPage: currentPage.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    handleTokenSearch,
    addTokenToFavorites,
    removeTokenFromFavorites,
    filters,
    filter,
    toggleFilter,
    favoriteTokens,
    showPriceConverter,
    setShowPriceConverter,
  };
};

export default useTokens;
