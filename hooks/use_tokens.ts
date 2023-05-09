import { formatToCurrency, formatWalletAddress } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { ChangeEvent, useRef, useState } from 'react';

export interface Token {
  token: string;
  price: number;
  assetId: string;
  fullName: string;
  lockedTokens: number;
  assetIdFormatted: string | '';
  priceFormatted: string | '';
}

interface TokensReturnType {
  tokens: Token[];
  totalPages: number;
  currentPage: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  // eslint-disable-next-line no-unused-vars
  handleTokenSearch: (search: ChangeEvent<HTMLInputElement>) => void;
}

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

  const goToFirstPage = () => {
    if (currentPage.current > 0) {
      currentPage.current = 0;
      setTokenSlice(tokens.current!.slice(0, limiter));
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.current > 0) {
      currentPage.current--;
      setTokenSlice(
        tokens.current!.slice(
          currentPage.current * limiter,
          (currentPage.current + 1) * limiter
        )
      );
    }
  };

  const goToNextPage = () => {
    const nextLimit = (currentPage.current + 1) * limiter;

    if (currentPage.current + 1 < totalPages.current) {
      currentPage.current++;
      setTokenSlice(tokens.current!.slice(nextLimit, nextLimit + limiter));
    }
  };

  const goToLastPage = () => {
    if (currentPage.current + 1 < totalPages.current) {
      currentPage.current = totalPages.current - 1;
      setTokenSlice(
        tokens.current!.slice(
          (totalPages.current - 1) * limiter,
          tokens.current?.length
        )
      );
    }
  };

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
