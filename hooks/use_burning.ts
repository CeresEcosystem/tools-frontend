import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import {
  BurningData,
  BurningFilterData,
  BurningSummaryFormatted,
  PageMeta,
  TokenBurningData,
  WalletAddress,
} from '@interfaces/index';
import { formatNumber, getEncodedAddress } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

const useBurning = (tokenFullName: string) => {
  const format = useFormatter();

  const polkadot = usePolkadot();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [burns, setBurns] = useState<BurningData[]>([]);

  const walletsStorage = useRef<WalletAddress[]>([]);
  const pageMeta = useRef<PageMeta | undefined>();
  const summary = useRef<BurningSummaryFormatted | undefined>();
  const lastFilterOptions = useRef<BurningFilterData | undefined>();

  const getFilters = useCallback((burningFilterData: BurningFilterData) => {
    let filterOptions = '';

    if (burningFilterData.dateFrom) {
      filterOptions += `&dateFrom=${burningFilterData.dateFrom.toISOString()}`;
    }

    if (burningFilterData.dateTo) {
      filterOptions += `&dateTo=${burningFilterData.dateTo.toISOString()}`;
    }

    if (burningFilterData.accountId !== '') {
      filterOptions += `&accountId=${burningFilterData.accountId}`;
    }

    return filterOptions;
  }, []);

  const clearBurns = useCallback(() => {
    setBurns([]);
    setLoading(false);
    setPageLoading(false);
  }, []);

  const setWalletAddresses = useCallback(
    (connected: boolean) => {
      let accounts: WalletAddress[] = [];

      if (connected) {
        accounts =
          polkadot?.accounts?.map((acc) => {
            return {
              name: acc.meta.name,
              address: getEncodedAddress(acc.address),
              fromPolkadotExtension: true,
            } as WalletAddress;
          }) ?? [];
      }

      const wallets = localStorage.getItem(WALLET_ADDRESSES);
      const walletDB = wallets ? (JSON.parse(wallets) as WalletAddress[]) : [];

      walletsStorage.current = [...accounts, ...walletDB];

      setLoadingStatus(false);
    },
    [polkadot?.accounts]
  );

  const getFormattedBurningData = useCallback((burn: BurningData) => {
    return {
      ...burn,
      accountIdFormatted:
        walletsStorage.current.find(
          (wallet) => wallet.address === burn.accountId
        )?.name ?? burn.accountId,
      tokenAllocated: burn.amountBurned / 1000000,
    };
  }, []);

  const fetchBurningData = useCallback(
    async (page = 1, burningFilterData = lastFilterOptions.current) => {
      const options = burningFilterData ? getFilters(burningFilterData) : '';

      const response = await fetch(
        `${NEW_API_URL}/burns/${tokenFullName}?page=${page}${options}`
      );

      if (response.ok) {
        const responseData = (await response.json()) as TokenBurningData;

        const burningData: BurningData[] = [];

        responseData.data.forEach((burn) =>
          burningData.push(getFormattedBurningData(burn))
        );

        pageMeta.current = responseData.meta;

        const burningSummary = Number(responseData.summary.amountBurnedTotal);
        summary.current = {
          xorBurned: formatNumber(format, burningSummary),
          tokenAllocated: formatNumber(format, burningSummary / 1000000),
        };
        setBurns(burningData);
        setLoading(false);
        setPageLoading(false);
      } else {
        clearBurns();
      }
    },
    [getFilters, tokenFullName, format, getFormattedBurningData, clearBurns]
  );

  useEffect(() => {
    if (!polkadot?.loading) {
      if (polkadot?.accounts && polkadot?.accounts?.length > 0) {
        setWalletAddresses(true);
      } else {
        setWalletAddresses(false);
      }
    }
  }, [polkadot?.accounts, polkadot?.loading, setWalletAddresses]);

  useEffect(() => {
    if (!loadingStatus) {
      setLoading(true);
      lastFilterOptions.current = undefined;
      fetchBurningData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStatus]);

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchBurningData();
    }
  }, [fetchBurningData]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchBurningData(pageMeta.current.pageNumber - 1);
    }
  }, [fetchBurningData]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchBurningData(pageMeta.current.pageNumber + 1);
    }
  }, [fetchBurningData]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchBurningData(pageMeta.current.pageCount);
    }
  }, [fetchBurningData]);

  const filterBurningData = useCallback(
    (burningFilterData: BurningFilterData) => {
      if (burningFilterData !== lastFilterOptions.current) {
        setPageLoading(true);
        lastFilterOptions.current = burningFilterData;
        fetchBurningData(1, burningFilterData);
      }
    },
    [fetchBurningData]
  );

  return {
    loading,
    pageMeta: pageMeta.current,
    summary: summary.current,
    pageLoading,
    burns,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    filterBurningData,
  };
};

export default useBurning;
