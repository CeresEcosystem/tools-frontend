import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import {
  PageMeta,
  Swap,
  SwapsData,
  Token,
  WalletAddress,
} from '@interfaces/index';
import { getEncodedAddress } from '@utils/helpers';
import { useCallback, useEffect, useRef, useState } from 'react';

const useSwaps = (tokens: Token[], address: string) => {
  const polkadot = usePolkadot();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [swaps, setSwaps] = useState<Swap[] | undefined>();

  const walletsStorage = useRef<WalletAddress[]>([]);

  const pageMeta = useRef<PageMeta | undefined>();

  const fetchSwaps = useCallback(
    (addr: string, page = 1) => {
      fetch(`${NEW_API_URL}/swaps/${addr}?page=${page}`)
        .then(async (response) => {
          if (response.ok) {
            const responseData = (await response.json()) as SwapsData;

            const swaps: Swap[] = [];

            responseData.data.forEach((swap) =>
              swaps.push({
                ...swap,
                inputAsset: tokens.find(
                  (token) => token.assetId === swap.inputAssetId
                )?.token,
                outputAsset: tokens.find(
                  (token) => token.assetId === swap.outputAssetId
                )?.token,
                type: addr === swap.inputAssetId ? 'Sell' : 'Buy',
                accountId:
                  walletsStorage.current.find(
                    (wallet) => wallet.address === swap.accountId
                  )?.name ?? swap.accountId,
              })
            );

            pageMeta.current = responseData.meta;
            setSwaps(swaps);
            setPageLoading(false);
          }
        })
        .catch(() => {
          setSwaps([]);
          setPageLoading(false);
        });
    },
    [tokens]
  );

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

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchSwaps(address);
    }
  }, [address, fetchSwaps]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchSwaps(address, pageMeta.current.pageNumber - 1);
    }
  }, [address, fetchSwaps]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchSwaps(address, pageMeta.current.pageNumber + 1);
    }
  }, [address, fetchSwaps]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchSwaps(address, pageMeta.current.pageCount);
    }
  }, [address, fetchSwaps]);

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
      fetchSwaps(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, loadingStatus]);

  return {
    swaps,
    pageMeta: pageMeta.current,
    pageLoading,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default useSwaps;
