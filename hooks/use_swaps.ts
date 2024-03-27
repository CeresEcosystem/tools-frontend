import {
  ALL_TOKENS,
  FAVORITE_TOKENS,
  NEW_API_URL,
  SWAP_SOCKET_URL,
  WALLET_ADDRESSES,
} from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import {
  PageMeta,
  Swap,
  SwapFilterData,
  SwapTokens,
  SwapsData,
  SwapsStats,
  Token,
  WalletAddress,
} from '@interfaces/index';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { RootState } from '@store/index';
import { getEncodedAddress } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket, io } from 'socket.io-client';

const useSwaps = (tokens: Token[], address: string) => {
  const polkadot = usePolkadot();

  const { pathname } = useRouter();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [swaps, setSwaps] = useState<Swap[] | undefined>();

  const favoriteTokens = useSelector(
    (state: RootState) => state.tokens.favoriteTokens
  );

  const walletsStorage = useRef<WalletAddress[]>([]);

  const pageMeta = useRef<PageMeta | undefined>();
  const stats = useRef<SwapsStats | undefined>();

  const socket = useRef<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >();

  const lastFilterOptions = useRef<SwapFilterData | undefined>();

  const connectSocket = useCallback(() => {
    socket.current = io(SWAP_SOCKET_URL);
  }, []);

  const disconnectSocket = useCallback(() => {
    socket.current?.disconnect();
    socket.current = undefined;
  }, []);

  const getSwapTokens = useCallback(
    (addr: string): SwapTokens => {
      if (addr === FAVORITE_TOKENS) {
        const swapTokens: string[] = [];

        favoriteTokens.forEach((assetId) => {
          swapTokens.push(assetId);
        });

        return { tokens: swapTokens };
      } else {
        return { tokens: [addr] };
      }
    },
    [favoriteTokens]
  );

  const validateSwapFilters = useCallback(
    (swap: Swap, swapFilterData: SwapFilterData | undefined) => {
      if (swapFilterData) {
        if (
          swapFilterData.dateFrom &&
          new Date(swap.swappedAt) < swapFilterData.dateFrom
        ) {
          return false;
        }
        if (
          swapFilterData.dateTo &&
          new Date(swap.swappedAt) > swapFilterData.dateTo
        ) {
          return false;
        }
        if (
          swapFilterData.minAmount &&
          swap.assetInputAmount < Number(swapFilterData.minAmount) &&
          swap.assetOutputAmount < Number(swapFilterData.minAmount)
        ) {
          return false;
        }
        if (
          swapFilterData.maxAmount &&
          swap.assetInputAmount > Number(swapFilterData.maxAmount) &&
          swap.assetOutputAmount > Number(swapFilterData.maxAmount)
        ) {
          return false;
        }
        if (
          swapFilterData.token &&
          swap.inputAssetId !== swapFilterData.token.value &&
          swap.outputAssetId !== swapFilterData.token.value
        ) {
          return false;
        }
        if (swapFilterData.excludedAccounts.includes(swap.accountId)) {
          return false;
        }
      }

      return true;
    },
    []
  );

  const getFormattedSwap = useCallback(
    (swap: Swap, addr: string) => {
      return {
        ...swap,
        inputAsset: tokens.find((token) => token.assetId === swap.inputAssetId)
          ?.token,
        outputAsset: tokens.find(
          (token) => token.assetId === swap.outputAssetId
        )?.token,
        type: addr === swap.inputAssetId ? 'Sell' : 'Buy',
        accountIdFormatted:
          walletsStorage.current.find(
            (wallet) => wallet.address === swap.accountId
          )?.name ?? swap.accountId,
      };
    },
    [tokens]
  );

  const getSwapFilters = useCallback((swapFilterData: SwapFilterData) => {
    let swapOptions = '';

    if (swapFilterData.dateFrom) {
      swapOptions += `&dateFrom=${swapFilterData.dateFrom.toISOString()}`;
    }

    if (swapFilterData.dateTo) {
      swapOptions += `&dateTo=${swapFilterData.dateTo.toISOString()}`;
    }

    if (swapFilterData.minAmount) {
      swapOptions += `&minAmount=${swapFilterData.minAmount}`;
    }

    if (swapFilterData.maxAmount) {
      swapOptions += `&maxAmount=${swapFilterData.maxAmount}`;
    }

    if (swapFilterData.token !== '') {
      swapOptions += `&assetId=${swapFilterData.token.value}`;
    }

    if (swapFilterData.excludedAccounts.length > 0) {
      swapFilterData.excludedAccounts.forEach((acc) => {
        swapOptions += `&excludedAccIds=${acc}`;
      });
    }

    return swapOptions;
  }, []);

  const updateStats = useCallback((swap: Swap, addr: string) => {
    if (stats.current) {
      if (swap.inputAssetId === addr) {
        stats.current.sells++;
        stats.current.tokensSold += swap.assetInputAmount;
      }

      if (swap.outputAssetId === addr) {
        stats.current.buys++;
        stats.current.tokensBought += swap.assetOutputAmount;
      }
    }
  }, []);

  const clearSwaps = useCallback(() => {
    setSwaps([]);
    setLoading(false);
    setPageLoading(false);
    socket.current?.disconnect();
  }, []);

  const fetchSwaps = useCallback(
    async (
      addr: string,
      page = 1,
      swapFilterData = lastFilterOptions.current
    ) => {
      const swapOptions = swapFilterData ? getSwapFilters(swapFilterData) : '';

      let response: Response;

      if (addr === ALL_TOKENS) {
        response = await fetch(
          `${NEW_API_URL}/swaps/all?page=${page}${swapOptions}`
        );
      } else {
        const swapTokens = getSwapTokens(addr);

        response = await fetch(
          `${NEW_API_URL}/swaps?page=${page}${swapOptions}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(swapTokens),
          }
        );
      }

      if (response.ok) {
        const responseData = (await response.json()) as SwapsData;

        const swapsArray: Swap[] = [];

        responseData.data.forEach((swap) =>
          swapsArray.push(getFormattedSwap(swap, addr))
        );

        pageMeta.current = responseData.meta;

        if (addr !== ALL_TOKENS && addr !== FAVORITE_TOKENS) {
          stats.current = responseData.summary;
        } else {
          stats.current = undefined;
        }

        setSwaps(swapsArray);
        setLoading(false);
        setPageLoading(false);

        if (page > 1 || (swapFilterData && swapFilterData.dateTo !== null)) {
          socket.current?.disconnect();
        } else {
          if (!socket.current?.active) {
            connectSocket();
          }

          socket.current?.removeAllListeners();

          const addresses =
            addr === FAVORITE_TOKENS
              ? favoriteTokens.map((assetId) => assetId)
              : addr === ALL_TOKENS
              ? tokens.map((t) => t.assetId)
              : [addr];

          addresses.forEach((a) => {
            socket.current?.on(a, (data) => {
              const swap = data as Swap;

              if (validateSwapFilters(swap, swapFilterData)) {
                setSwaps((prevSwaps) => {
                  if (!prevSwaps?.find((pSwap) => pSwap.id === swap.id)) {
                    const s: Swap = getFormattedSwap(swap, a);

                    if (
                      addresses.length === 1 &&
                      addr !== ALL_TOKENS &&
                      addr !== FAVORITE_TOKENS
                    ) {
                      updateStats(s, a);
                    }

                    let updatedSwaps = [s];

                    if (pageMeta.current && prevSwaps) {
                      const numberOfSwapsOnPage = prevSwaps?.length;
                      updatedSwaps = [s, ...prevSwaps].slice(0, 10);
                      pageMeta.current.totalCount++;

                      if (numberOfSwapsOnPage === pageMeta.current.pageSize) {
                        pageMeta.current.hasNextPage = true;
                      }
                    }

                    return updatedSwaps;
                  }

                  return prevSwaps;
                });
              }
            });
          });
        }
      } else {
        clearSwaps();
      }
    },
    [
      clearSwaps,
      connectSocket,
      favoriteTokens,
      getFormattedSwap,
      getSwapFilters,
      getSwapTokens,
      tokens,
      validateSwapFilters,
      updateStats,
    ]
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

  const filterSwaps = useCallback(
    (swapFilterData: SwapFilterData) => {
      if (swapFilterData !== lastFilterOptions.current) {
        setPageLoading(true);
        lastFilterOptions.current = swapFilterData;
        fetchSwaps(address, 1, swapFilterData);
      }
    },
    [address, fetchSwaps]
  );

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket, pathname]);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

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
      fetchSwaps(address);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, loadingStatus]);

  return {
    swaps,
    pageMeta: pageMeta.current,
    stats: stats.current,
    loading,
    pageLoading,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    filterSwaps,
  };
};

export default useSwaps;
