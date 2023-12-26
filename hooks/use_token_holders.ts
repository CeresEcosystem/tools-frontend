import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import {
  PageMeta,
  Token,
  TokenHolder,
  TokenHolderData,
  WalletAddress,
} from '@interfaces/index';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  formatNumber,
  formatWalletAddress,
  getEncodedAddress,
} from '@utils/helpers';
import { usePolkadot } from '@context/polkadot_context';
import { useFormatter } from 'next-intl';

const useTokenHolders = (token: Token | null, showModal: boolean) => {
  const polkadot = usePolkadot();
  const format = useFormatter();

  const [walletsLoading, setWalletsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [holders, setHolders] = useState<TokenHolder[]>([]);

  const pageMeta = useRef<PageMeta | undefined>();
  const walletsStorage = useRef<WalletAddress[]>([]);

  const fetchTokenHolders = useCallback(
    async (page = 1) => {
      await fetch(
        `${NEW_API_URL}/holders?page=${page}&assetId=${token?.assetId}`
      )
        .then(async (response) => {
          if (response.ok) {
            const responseJson = (await response.json()) as TokenHolderData;
            const array: TokenHolder[] = [];

            responseJson.data.forEach((h) =>
              array.push({
                ...h,
                holderFormatted:
                  walletsStorage.current.find(
                    (wallet) => wallet.address === h.holder
                  )?.name ?? formatWalletAddress(h.holder, 10),
                balanceFormatted: formatNumber(format, h.balance),
              })
            );

            pageMeta.current = responseJson.meta;
            setHolders(array);
            setLoading(false);
            setPageLoading(false);
          }
        })
        .catch(() => {
          setHolders([]);
          setLoading(false);
          setPageLoading(false);
        });
    },
    [token, format]
  );

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchTokenHolders();
    }
  }, [fetchTokenHolders]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setPageLoading(true);
      fetchTokenHolders(pageMeta.current.pageNumber - 1);
    }
  }, [fetchTokenHolders]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchTokenHolders(pageMeta.current.pageNumber + 1);
    }
  }, [fetchTokenHolders]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setPageLoading(true);
      fetchTokenHolders(pageMeta.current.pageCount);
    }
  }, [fetchTokenHolders]);

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

      fetchTokenHolders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, walletsLoading]);

  return {
    loading,
    holders,
    pageMeta: pageMeta.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    pageLoading,
  };
};

export default useTokenHolders;
