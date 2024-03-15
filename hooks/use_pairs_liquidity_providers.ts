import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import {
  PageMeta,
  Pair,
  PairLiquidityProvider,
  WalletAddress,
} from '@interfaces/index';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatWalletAddress, getEncodedAddress } from '@utils/helpers';
import { usePolkadot } from '@context/polkadot_context';

const pageLimiter = 10;

const usePairsLiquidityProviders = (pair: Pair | null, showModal: boolean) => {
  const polkadot = usePolkadot();

  const [walletsLoading, setWalletsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<PairLiquidityProvider[]>([]);

  const allProviders = useRef<PairLiquidityProvider[]>([]);
  const pageMeta = useRef<PageMeta | undefined>();
  const walletsStorage = useRef<WalletAddress[]>([]);

  const setPageMeta = useCallback((pageNumber: number) => {
    const pageCount = Math.ceil(allProviders.current.length / pageLimiter);

    pageMeta.current = {
      pageSize: pageLimiter,
      totalCount: allProviders.current.length,
      pageNumber,
      hasPreviousPage: pageNumber > 1,
      pageCount,
      hasNextPage: pageNumber < pageCount,
    };

    const startIndex = (pageNumber - 1) * pageLimiter;
    const endIndex = Math.min(
      startIndex + pageLimiter,
      allProviders.current.length
    );

    setProviders(allProviders.current.slice(startIndex, endIndex));
  }, []);

  const fetchPairLiquidityProviders = useCallback(async () => {
    await fetch(
      `${NEW_API_URL}/pairs-liquidity/providers/${pair?.baseAssetId}/${pair?.tokenAssetId}`
    )
      .then(async (response) => {
        if (response.ok) {
          const responseData =
            (await response.json()) as PairLiquidityProvider[];

          const array: PairLiquidityProvider[] = [];

          responseData.forEach((liq) =>
            array.push({
              ...liq,
              accountIdFormatted:
                walletsStorage.current.find(
                  (wallet) => wallet.address === liq.address
                )?.name ?? formatWalletAddress(liq.address, 10),
            })
          );

          allProviders.current = array;
          setPageMeta(1);
          setLoading(false);
        }
      })
      .catch(() => {
        setProviders([]);
        setLoading(false);
      });
  }, [pair, setPageMeta]);

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageMeta(1);
    }
  }, [setPageMeta]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageMeta(pageMeta.current.pageNumber - 1);
    }
  }, [setPageMeta]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageMeta(pageMeta.current.pageNumber + 1);
    }
  }, [setPageMeta]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageMeta(pageMeta.current.pageCount);
    }
  }, [setPageMeta]);

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

      setWalletsLoading(false);
    },
    [polkadot?.accounts]
  );

  useEffect(() => {
    setWalletsLoading(true);
    setLoading(true);

    if (!polkadot?.loading) {
      if (polkadot?.accounts && polkadot?.accounts?.length > 0) {
        setWalletAddresses(true);
      } else {
        setWalletAddresses(false);
      }
    }
  }, [polkadot?.accounts, polkadot?.loading, setWalletAddresses]);

  useEffect(() => {
    if (showModal && !walletsLoading) {
      setLoading(true);
      fetchPairLiquidityProviders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, walletsLoading]);

  return {
    loading,
    providers,
    pageMeta: pageMeta.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default usePairsLiquidityProviders;
