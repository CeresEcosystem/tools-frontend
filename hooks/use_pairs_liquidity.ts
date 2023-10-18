import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import {
  PageMeta,
  Pair,
  PairLiquidity,
  PairLiquidityData,
  WalletAddress,
} from '@interfaces/index';
import { useCallback, useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { formatDateFromTimestamp, getEncodedAddress } from '@utils/helpers';
import { usePolkadot } from '@context/polkadot_context';

const usePairsLiquidity = (pair: Pair | null, showModal: boolean) => {
  const polkadot = usePolkadot();

  const [loading, setLoading] = useState(true);
  const [liquidity, setLiquidity] = useState<PairLiquidity[]>([]);

  const pageMeta = useRef<PageMeta | undefined>();
  const walletsStorage = useRef<WalletAddress[]>([]);

  const fetchPairLiquidity = useCallback(
    async (page = 1) => {
      await fetch(
        `${NEW_API_URL}/pairs-liquidity/${pair?.baseAssetId}/${pair?.tokenAssetId}?page=${page}`
      )
        .then(async (response) => {
          if (response.ok) {
            const responseData = (await response.json()) as PairLiquidityData;

            const array: PairLiquidity[] = [];

            responseData.data.forEach((liq) =>
              array.push({
                ...liq,
                firstAssetAmountFormatted: BigNumber(liq.firstAssetAmount)
                  .dividedBy(Math.pow(10, 18))
                  .toNumber(),
                secondAssetAmountFormatted: BigNumber(liq.secondAssetAmount)
                  .dividedBy(Math.pow(10, 18))
                  .toNumber(),
                transactionTypeFormatted:
                  liq.transactionType === 'withdrawLiquidity'
                    ? 'Withdraw'
                    : 'Deposit',
                timestampFormatted: formatDateFromTimestamp(
                  liq.timestamp,
                  'YYYY-MM-DD'
                ),
                accountIdFormatted:
                  walletsStorage.current.find(
                    (wallet) => wallet.address === liq.signerId
                  )?.name ?? liq.signerId,
              })
            );

            pageMeta.current = responseData.meta;
            setLiquidity(array);
            setLoading(false);
          }
        })
        .catch(() => {
          setLiquidity([]);
          setLoading(false);
        });
    },
    [pair]
  );

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setLoading(true);
      fetchPairLiquidity();
    }
  }, [fetchPairLiquidity]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setLoading(true);
      fetchPairLiquidity(pageMeta.current.pageNumber - 1);
    }
  }, [fetchPairLiquidity]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setLoading(true);
      fetchPairLiquidity(pageMeta.current.pageNumber + 1);
    }
  }, [fetchPairLiquidity]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setLoading(true);
      fetchPairLiquidity(pageMeta.current.pageCount);
    }
  }, [fetchPairLiquidity]);

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

      fetchPairLiquidity();
    },
    [polkadot?.accounts, fetchPairLiquidity]
  );

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      if (!polkadot?.loading) {
        if (polkadot?.accounts && polkadot?.accounts?.length > 0) {
          setWalletAddresses(true);
        } else {
          setWalletAddresses(false);
        }
      }
    }
  }, [polkadot?.accounts, polkadot?.loading, setWalletAddresses, showModal]);

  return {
    loading,
    liquidity,
    pageMeta: pageMeta.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default usePairsLiquidity;
