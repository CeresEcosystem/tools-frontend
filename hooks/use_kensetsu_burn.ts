import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import {
  KensetsuBurn,
  KensetsuBurnData,
  KensetsuFilterData,
  KensetsuSummaryFormatted,
  PageMeta,
  WalletAddress,
} from '@interfaces/index';
import { formatNumber, getEncodedAddress } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

const useKensetsuBurn = () => {
  const format = useFormatter();

  const polkadot = usePolkadot();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [kensetsuBurns, setKensetsuBurns] = useState<KensetsuBurn[]>([]);

  const walletsStorage = useRef<WalletAddress[]>([]);
  const pageMeta = useRef<PageMeta | undefined>();
  const summary = useRef<KensetsuSummaryFormatted | undefined>();
  const lastFilterOptions = useRef<KensetsuFilterData | undefined>();

  const getKensetsuFilters = useCallback(
    (kensetsuFilterData: KensetsuFilterData) => {
      let kensetsuOptions = '';

      if (kensetsuFilterData.dateFrom) {
        kensetsuOptions += `&dateFrom=${kensetsuFilterData.dateFrom.toISOString()}`;
      }

      if (kensetsuFilterData.dateTo) {
        kensetsuOptions += `&dateTo=${kensetsuFilterData.dateTo.toISOString()}`;
      }

      if (kensetsuFilterData.accountId !== '') {
        kensetsuOptions += `&accountId=${kensetsuFilterData.accountId}`;
      }

      return kensetsuOptions;
    },
    []
  );

  const clearBurns = useCallback(() => {
    setKensetsuBurns([]);
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

  const getFormattedKensetsuBurn = useCallback((kensetsuBurn: KensetsuBurn) => {
    return {
      ...kensetsuBurn,
      accountIdFormatted:
        walletsStorage.current.find(
          (wallet) => wallet.address === kensetsuBurn.accountId
        )?.name ?? kensetsuBurn.accountId,
      kenAllocated: kensetsuBurn.amountBurned / 1000000,
    };
  }, []);

  const fetchKensetsuBurns = useCallback(
    async (page = 1, kensetsuFilterData = lastFilterOptions.current) => {
      const kensetsuOptions = kensetsuFilterData
        ? getKensetsuFilters(kensetsuFilterData)
        : '';

      let response = await fetch(
        `${NEW_API_URL}/kensetsu/burns?page=${page}${kensetsuOptions}`
      );

      if (response.ok) {
        const responseData = (await response.json()) as KensetsuBurnData;

        const kensetsuArray: KensetsuBurn[] = [];

        responseData.data.forEach((burn) =>
          kensetsuArray.push(getFormattedKensetsuBurn(burn))
        );

        pageMeta.current = responseData.meta;

        const kensutsuSummary = Number(responseData.summary.amountBurnedTotal);
        summary.current = {
          xorBurned: formatNumber(format, kensutsuSummary),
          kenAllocated: formatNumber(format, kensutsuSummary / 1000000),
        };
        setKensetsuBurns(kensetsuArray);
        setLoading(false);
        setPageLoading(false);
      } else {
        clearBurns();
      }
    },
    [clearBurns, getKensetsuFilters, getFormattedKensetsuBurn, format]
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
      fetchKensetsuBurns();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStatus]);

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchKensetsuBurns();
    }
  }, [fetchKensetsuBurns]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchKensetsuBurns(pageMeta.current.pageNumber - 1);
    }
  }, [fetchKensetsuBurns]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchKensetsuBurns(pageMeta.current.pageNumber + 1);
    }
  }, [fetchKensetsuBurns]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchKensetsuBurns(pageMeta.current.pageCount);
    }
  }, [fetchKensetsuBurns]);

  const filterKensetsuBurns = useCallback(
    (kensetsuFilterData: KensetsuFilterData) => {
      if (kensetsuFilterData !== lastFilterOptions.current) {
        setPageLoading(true);
        lastFilterOptions.current = kensetsuFilterData;
        fetchKensetsuBurns(1, kensetsuFilterData);
      }
    },
    [fetchKensetsuBurns]
  );

  return {
    loading,
    pageMeta: pageMeta.current,
    summary: summary.current,
    pageLoading,
    kensetsuBurns,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    filterKensetsuBurns,
  };
};

export default useKensetsuBurn;
