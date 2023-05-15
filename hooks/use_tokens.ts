import { formatToCurrency, formatWalletAddress } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { ChangeEvent, useRef, useState } from 'react';
import usePagination from '@hooks/use_pagination';
import { Token, TokensReturnType } from '@interfaces/index';

const limiter = 10;

const useTokens = (data?: Token[]): TokensReturnType => {
  const format = useFormatter();

  const allTokens = useRef<Token[]>(
    data
      ? data.map((t) => {
          return {
            ...t,
            assetIdFormatted: formatWalletAddress(t.assetId),
            priceFormatted: formatToCurrency(format, t.price),
          };
        })
      : []
  );
  const tokens = useRef(allTokens.current);

  const [tokenSlice, setTokenSlice] = useState(
    allTokens.current.slice(0, limiter) ?? []
  );

  const currentPage = useRef(0);
  const totalPages = useRef(
    allTokens.current ? Math.ceil(allTokens.current.length / limiter) : 0
  );

  const { goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage } =
    usePagination<Token>(
      currentPage.current,
      totalPages.current,
      tokens.current,
      (cp: number) => (currentPage.current = cp),
      (array: Array<Token>) => setTokenSlice(array),
      limiter,
    );

  const resetData = () => {
    tokens.current = allTokens.current;
    currentPage.current = 0;
    totalPages.current = allTokens.current
      ? Math.ceil(allTokens.current.length / limiter)
      : 0;
    setTokenSlice(allTokens.current.slice(0, limiter) ?? []);
  };

  const handleTokenSearch = (search: ChangeEvent<HTMLInputElement>) => {
    if (search.target.value !== '') {
      tokens.current = allTokens.current?.filter(
        (token) =>
          token.assetId
            .toUpperCase()
            .includes(search.target.value.toUpperCase()) ||
          token.fullName
            .toUpperCase()
            .includes(search.target.value.toUpperCase())
      );
      currentPage.current = 0;
      totalPages.current = tokens.current
        ? Math.ceil(tokens.current.length / limiter)
        : 0;
      setTokenSlice(tokens.current?.slice(0, limiter) ?? []);
    } else {
      resetData();
    }
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
  };
};

export default useTokens;
