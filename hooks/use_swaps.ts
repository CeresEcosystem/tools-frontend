import {
  FAVORITE_TOKENS,
  NEW_API_URL,
  SWAP_SOCKET_URL,
  WALLET_ADDRESSES,
} from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import {
  PageMeta,
  Swap,
  SwapsData,
  Token,
  WalletAddress,
} from '@interfaces/index';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { getEncodedAddress } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const useSwaps = (tokens: Token[], address: string) => {
  const polkadot = usePolkadot();

  const { pathname } = useRouter();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [swaps, setSwaps] = useState<Swap[] | undefined>();

  const favoriteTokens = useRef(tokens.filter((t) => t.isFavorite));

  const walletsStorage = useRef<WalletAddress[]>([]);

  const pageMeta = useRef<PageMeta | undefined>();

  const socket = useRef<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >();

  const connectSocket = useCallback(() => {
    socket.current = io(SWAP_SOCKET_URL);
  }, []);

  const disconnectSocket = useCallback(() => {
    socket.current?.disconnect();
    socket.current = undefined;
  }, []);

  const getTokenParams = useCallback((addr: string): string => {
    if (addr === FAVORITE_TOKENS) {
      let params = '';

      favoriteTokens.current.forEach((t) => {
        params += `&token=${t.assetId}`;
      });

      return params;
    } else {
      return `&token=${addr}`;
    }
  }, []);

  const fetchSwaps = useCallback(
    async (addr: string, page = 1) => {
      const params = getTokenParams(addr);

      await fetch(`${NEW_API_URL}/swaps?page=${page}${params}`)
        .then(async (response) => {
          if (response.ok) {
            const responseData = (await response.json()) as SwapsData;

            const swapsArray: Swap[] = [];

            responseData.data.forEach((swap) =>
              swapsArray.push({
                ...swap,
                inputAsset: tokens.find(
                  (token) => token.assetId === swap.inputAssetId
                )?.token,
                outputAsset: tokens.find(
                  (token) => token.assetId === swap.outputAssetId
                )?.token,
                type: addr === swap.inputAssetId ? 'Sell' : 'Buy',
                accountIdFormatted:
                  walletsStorage.current.find(
                    (wallet) => wallet.address === swap.accountId
                  )?.name ?? swap.accountId,
              })
            );

            pageMeta.current = responseData.meta;
            setSwaps(swapsArray);
            setPageLoading(false);

            if (page > 1) {
              socket.current?.disconnect();
            } else {
              if (!socket.current?.active) {
                connectSocket();
              }

              socket.current?.removeAllListeners();

              const addresses =
                addr === FAVORITE_TOKENS
                  ? favoriteTokens.current.map((ft) => ft.assetId)
                  : [addr];

              addresses.forEach((a) => {
                socket.current?.on(a, (data) => {
                  setSwaps((prevSwaps) => {
                    const swap = data as Swap;

                    if (
                      prevSwaps?.find((pSwap) => pSwap.id === swap.id) ===
                      undefined
                    ) {
                      const s: Swap = {
                        ...swap,
                        inputAsset: tokens.find(
                          (token) => token.assetId === swap.inputAssetId
                        )?.token,
                        outputAsset: tokens.find(
                          (token) => token.assetId === swap.outputAssetId
                        )?.token,
                        type: a === swap.inputAssetId ? 'Sell' : 'Buy',
                        accountIdFormatted:
                          walletsStorage.current.find(
                            (wallet) => wallet.address === swap.accountId
                          )?.name ?? swap.accountId,
                      };

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
                });
              });
            }
          } else {
            socket.current?.disconnect();
          }
        })
        .catch(() => {
          setSwaps([]);
          setPageLoading(false);

          socket.current?.disconnect();
        });
    },
    [connectSocket, getTokenParams, tokens]
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
