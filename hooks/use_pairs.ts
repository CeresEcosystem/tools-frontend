import { formatNumber, formatToCurrency } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import usePagination from '@hooks/use_pagination';
import {
  Pair,
  PairData,
  PairsReturnType,
  VolumeInterval,
} from '@interfaces/index';
import { SYNTHETICS_FILTER } from '@constants/index';

const limiter = 10;
export const volumeIntervals = ['24h', '7d', '1M', '3M'];

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

  const [syntheticsFilter, setSyntheticsFilter] = useState(false);

  const [pairsSlice, setPairsSlice] = useState(
    allPairs.current.allData.slice(0, limiter) ?? []
  );
  const [volumeTimeInterval, setVolumeTimeInterval] =
    useState<keyof VolumeInterval>('24h');

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
      limiter
    );

  const setPage = () => {
    currentPage.current = 0;
    totalPages.current = pairs.current
      ? Math.ceil(pairs.current.length / limiter)
      : 0;
    setPairsSlice(pairs.current.slice(0, limiter) ?? []);
  };

  const setPairs = useCallback(
    (search?: string, bAsset?: string, filterBySynthetics?: boolean) => {
      const s = search ?? searchQuery.current;
      const ba = bAsset ?? selectedBaseAsset.current;
      const synthFilter = filterBySynthetics ?? syntheticsFilter;

      let pairsByBaseAsset =
        ba === 'All' || ba === ''
          ? allPairs.current.allData
          : allPairs.current.allData.filter((pair) => pair.baseAsset === ba);

      if (synthFilter && ba !== 'All') {
        pairsByBaseAsset = pairsByBaseAsset.filter((pair) =>
          pair.tokenAssetId.startsWith(SYNTHETICS_FILTER)
        );
      }

      pairs.current = pairsByBaseAsset.filter(
        (pair) =>
          pair.tokenFullName.toUpperCase().includes(s.toUpperCase()) ||
          pair.baseAssetFullName.toUpperCase().includes(s.toUpperCase())
      );
      setPage();
    },
    [syntheticsFilter]
  );

  const handlePairSearch = (search: ChangeEvent<HTMLInputElement>) => {
    searchQuery.current = search.target.value;

    setPairs(search.target.value, undefined);
  };

  const handleBaseAssetChange = (bAsset: string) => {
    let synthFilter = syntheticsFilter;

    if (bAsset === 'All' && synthFilter) {
      synthFilter = false;
      setSyntheticsFilter(false);
    }

    if (bAsset !== selectedBaseAsset.current) {
      selectedBaseAsset.current = bAsset;
      setPairs(undefined, bAsset, synthFilter);
    } else {
      if (synthFilter) {
        selectedBaseAsset.current = '';
        setPairs(undefined, '', synthFilter);
      }
    }
  };

  const handleSyntheticsFilter = () => {
    const filter = !syntheticsFilter;

    if (filter) {
      if (selectedBaseAsset.current === 'All') {
        selectedBaseAsset.current = '';
      }
    } else {
      if (selectedBaseAsset.current === '') {
        selectedBaseAsset.current = 'All';
      }
    }

    setSyntheticsFilter(filter);
    setPairs(undefined, undefined, filter);
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
    syntheticsFilter,
    handleSyntheticsFilter,
    volumeTimeInterval,
    setVolumeTimeInterval,
  };
};

export default usePairs;
