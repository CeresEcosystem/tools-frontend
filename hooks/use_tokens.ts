import { useRef, useState } from 'react';

export interface Token {
  token: string;
  price: number;
  assetId: string;
  fullName: string;
  lockedTokens: number;
}

interface TokensReturnType {
  tokens: Token[];
  totalPages: number;
  currentPage: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}

const limiter = 10;

const useTokens = (data?: Token[]): TokensReturnType => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(data ? Math.ceil(data.length / limiter) : 0);

  const tokens = useRef(data?.slice(0, limiter) ?? []);

  const goToFirstPage = () => {
    if (currentPage > 0) {
      tokens.current = data!.slice(0, limiter);
      setCurrentPage(0);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      tokens.current = data!.slice((currentPage - 1) * limiter, currentPage * limiter);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const nextLimit = (currentPage + 1) * limiter;

    if (currentPage + 1 < totalPages) {
      tokens.current = data!.slice(nextLimit, nextLimit + limiter);
      setCurrentPage(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (currentPage + 1 < totalPages) {
      tokens.current = data!.slice((totalPages - 1) * limiter, data?.length);
      setCurrentPage(totalPages - 1);
    }
  };

  return {
    tokens: tokens.current,
    totalPages,
    currentPage,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default useTokens;
