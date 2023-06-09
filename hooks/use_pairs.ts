import { formatNumber, formatToCurrency } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { ChangeEvent, useRef, useState } from 'react';
import usePagination from '@hooks/use_pagination';
import { Pair, PairData, PairsReturnType } from '@interfaces/index';

const limiter = 10;

const usePairs = (data?: Pair[]): PairsReturnType => {
  const format = useFormatter();

  const getPairsData = () => {
    const array = [];
    let liquidity = 0;
    let volume = 0;
    const baseAssets = new Set<string>(['All']);

    if (data) {
      for (const pair of data) {
        array.push({
          ...pair,
          baseLiquidityFormatted: formatNumber(format, pair.baseAssetLiq),
          tokenLiquidityFormatted: formatNumber(format, pair.targetAssetLiq),
          liquidityFormatted: formatToCurrency(format, pair.liquidity ?? 0),
          volumeFormatted: formatToCurrency(format, pair.volume ?? 0),
          lockedLiquidityFormatted: `${formatNumber(
            format,
            pair.lockedLiquidity
          )}%`,
        });
        baseAssets.add(pair.baseAsset);
        if (pair.liquidity) {
          liquidity += pair.liquidity;
        }
        if (pair.volume) {
          volume += pair.volume;
        }
      }
    }

    return {
      allData: array,
      liquidity: formatToCurrency(format, liquidity),
      volume: formatToCurrency(format, volume),
      baseAssets: Array.from(baseAssets),
    };
  };

  const allPairs = useRef<PairData>(getPairsData());
  const pairs = useRef(allPairs.current.allData);
  const searchQuery = useRef('');

  const [pairsSlice, setPairsSlice] = useState(
    allPairs.current.allData.slice(0, limiter) ?? []
  );

  const selectedBaseAsset = useRef('All');

  const currentPage = useRef(0);
  const totalPages = useRef(
    Math.ceil(allPairs.current.allData.length / limiter)
  );

  const { goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage } =
    usePagination<Pair>(
      currentPage.current,
      totalPages.current,
      pairs.current,
      (cp: number) => (currentPage.current = cp),
      (array: Array<Pair>) => setPairsSlice(array),
      limiter,
    );

  const setPage = () => {
    currentPage.current = 0;
    totalPages.current = pairs.current
      ? Math.ceil(pairs.current.length / limiter)
      : 0;
    setPairsSlice(pairs.current.slice(0, limiter) ?? []);
  };

  const setPairs = (search?: string, bAsset?: string) => {
    const s = search ?? searchQuery.current;
    const ba = bAsset ?? selectedBaseAsset.current;

    const pairsByBaseAsset =
      ba === 'All'
        ? allPairs.current.allData
        : allPairs.current.allData.filter((pair) => pair.baseAsset === ba);

    pairs.current = pairsByBaseAsset.filter(
      (pair) =>
        pair.tokenFullName.toUpperCase().includes(s.toUpperCase()) ||
        pair.baseAssetFullName.toUpperCase().includes(s.toUpperCase())
    );
    setPage();
  };

  const handlePairSearch = (search: ChangeEvent<HTMLInputElement>) => {
    searchQuery.current = search.target.value;

    setPairs(search.target.value, undefined);
  };

  const handleBaseAssetChange = (bAsset: string) => {
    if (bAsset !== selectedBaseAsset.current) {
      selectedBaseAsset.current = bAsset;

      setPairs(undefined, bAsset);
    }
  };

  return {
    pairs: pairsSlice,
    totalPages: totalPages.current,
    currentPage: currentPage.current,
    totalLiquidity: allPairs.current.liquidity,
    totalVolume: allPairs.current.volume,
    baseAssets: allPairs.current.baseAssets,
    selectedBaseAsset: selectedBaseAsset.current,
    handleBaseAssetChange,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    handlePairSearch,
  };
};

export default usePairs;
