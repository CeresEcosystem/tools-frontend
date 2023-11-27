import { usePolkadot } from '@context/polkadot_context';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  PageMeta,
  PortfolioItem,
  PortfolioLiquidityItem,
  PortfolioStakingRewardsItem,
  PortfolioTab,
  PortfolioTransferItem,
  Swap,
  SwapsData,
  Token,
  TransferData,
  WalletAddress,
} from '@interfaces/index';
import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import { formatWalletAddress, getEncodedAddress } from '@utils/helpers';
import usePersistState from './use_persist_state';
import { useRouter } from 'next/router';
import { showErrorNotify } from '@utils/toast';

const tabs = [
  { tab: 'Portfolio', permalink: '/portfolio/' },
  { tab: 'Staking', permalink: '/portfolio/staking/' },
  { tab: 'Rewards', permalink: '/portfolio/rewards/' },
  { tab: 'Liquidity', permalink: '/portfolio/liquidity/' },
  { tab: 'Swaps', permalink: '/portfolio/swaps/' },
  { tab: 'Transfers', permalink: '/portfolio/transfers/' },
];

const WALLET_EXIST_ERROR = 'Wallet with entered address already exist.';

const usePortfolio = () => {
  const router = useRouter();

  const polkadot = usePolkadot();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] =
    usePersistState<WalletAddress | null>(
      null,
      'SELECTED_WALLET',
      (value: WalletAddress | null) => {
        if (value && value.name !== '' && !router.query.address) return true;
        return false;
      }
    );

  const polkadotWallets = useRef<WalletAddress[]>([]);
  const storageWallets = useRef<WalletAddress[]>([]);

  const pageMeta = useRef<PageMeta | undefined>();

  const portfolioItems = useRef<
    | (
        | PortfolioItem
        | PortfolioStakingRewardsItem
        | PortfolioLiquidityItem
        | Swap
        | PortfolioTransferItem
      )[]
    | undefined
    | 'throttle error'
  >();

  const totalValue = useRef(0);

  function sortAndFilterItems(
    array: (
      | PortfolioItem
      | PortfolioStakingRewardsItem
      | PortfolioLiquidityItem
    )[]
  ) {
    const itemsFiltered = array.filter((pi) => {
      if ('balance' in pi) {
        return pi.balance >= 0.0001 && pi.value >= 0.0001;
      }

      return pi.value >= 0.0001;
    });

    itemsFiltered.sort(
      (portfolioItem1, portfolioItem2) =>
        portfolioItem2.value - portfolioItem1.value
    );
    let tv = 0;
    itemsFiltered.map((dataItem) => {
      tv += dataItem.value;
    });
    totalValue.current = tv;
    portfolioItems.current = itemsFiltered;

    setLoading(false);
  }

  const getTokens = useCallback(async () => {
    const tokensResponse = await fetch(`${NEW_API_URL}/prices`);
    return (await tokensResponse.json()) as Token[];
  }, []);

  const fetchPortfolioItems = useCallback(
    async (address: string, page = 1) => {
      if (!loading) {
        setLoading(true);
      }

      if (address !== '') {
        try {
          const permalink = router.query.slug
            ? `/portfolio/${router.query.slug[0]}/`
            : '/portfolio/';

          const response = await fetch(
            `${NEW_API_URL}${permalink}${address}?page=${page}`
          );

          if (response.status === 429) {
            portfolioItems.current = 'throttle error';
            setLoading(false);
          } else {
            const json = await response.json();

            if (response.status === 200 && json) {
              let array = [];

              if (router.query.slug === undefined) {
                array = json as PortfolioItem[];
                sortAndFilterItems(array);
              } else if (
                router.query.slug[0] === 'staking' ||
                router.query.slug[0] === 'rewards'
              ) {
                array = json as PortfolioStakingRewardsItem[];
                sortAndFilterItems(array);
              } else if (router.query.slug[0] === 'swaps') {
                const jsonResponse = json as SwapsData;
                pageMeta.current = jsonResponse.meta;

                const swapsArray: Swap[] = [];
                const tokensJson = await getTokens();

                jsonResponse.data.forEach((swap) =>
                  swapsArray.push({
                    ...swap,
                    inputAsset: tokensJson.find(
                      (token) => token.assetId === swap.inputAssetId
                    )?.token,
                    outputAsset: tokensJson.find(
                      (token) => token.assetId === swap.outputAssetId
                    )?.token,
                  })
                );

                portfolioItems.current = swapsArray;
                setLoading(false);
              } else if (router.query.slug[0] === 'transfers') {
                const jsonResponse = json as TransferData;
                pageMeta.current = jsonResponse.meta;

                const transfersArray: PortfolioTransferItem[] = [];
                const tokensJson = await getTokens();

                jsonResponse.data.forEach((transfer) =>
                  transfersArray.push({
                    ...transfer,
                    tokenFormatted: tokensJson.find(
                      (token) => token.assetId === transfer.asset
                    )?.token,
                    senderFormatted: formatWalletAddress(transfer.sender),
                    receiverFormatted: formatWalletAddress(transfer.receiver),
                  })
                );

                portfolioItems.current = transfersArray;
                setLoading(false);
              } else {
                array = json as PortfolioLiquidityItem[];
                sortAndFilterItems(array);
              }
            } else {
              portfolioItems.current = [];
              totalValue.current = 0;
              setLoading(false);
            }
          }
        } catch {
          portfolioItems.current = [];
          totalValue.current = 0;
          setLoading(false);
        }
      } else {
        portfolioItems.current = undefined;
        totalValue.current = 0;
        setLoading(false);
      }
    },
    [router.query.slug, loading, getTokens]
  );

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage && selectedWallet) {
      fetchPortfolioItems(selectedWallet.address);
    }
  }, [fetchPortfolioItems, selectedWallet]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage && selectedWallet) {
      fetchPortfolioItems(
        selectedWallet.address,
        pageMeta.current.pageNumber - 1
      );
    }
  }, [fetchPortfolioItems, selectedWallet]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage && selectedWallet) {
      fetchPortfolioItems(
        selectedWallet.address,
        pageMeta.current.pageNumber + 1
      );
    }
  }, [fetchPortfolioItems, selectedWallet]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage && selectedWallet) {
      fetchPortfolioItems(selectedWallet.address, pageMeta.current.pageCount);
    }
  }, [fetchPortfolioItems, selectedWallet]);

  const handleWalletChange = (newWallet?: string) => {
    const wallet =
      [...polkadotWallets.current, ...storageWallets.current].find(
        (w) => w.address === newWallet
      ) ?? null;

    setSelectedWallet(wallet);
  };

  const changeSelectedTab = useCallback(
    (tab: PortfolioTab) => {
      setLoading(true);
      router.push(
        `${tab.permalink}${
          router.query.address ? `?address=${router.query.address}` : ''
        }`
      );
    },
    [router]
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
              temporaryAddress: false,
            } as WalletAddress;
          }) ?? [];
      }

      polkadotWallets.current = accounts;

      const wallets = localStorage.getItem(WALLET_ADDRESSES);
      const walletsDB = wallets ? (JSON.parse(wallets) as WalletAddress[]) : [];

      storageWallets.current = walletsDB.map((w) => {
        return { ...w, temporaryAddress: w.name === '' };
      });

      const allWallets = [
        ...polkadotWallets.current,
        ...storageWallets.current,
      ];

      if (router.query.address) {
        const wallet: WalletAddress = {
          name: '',
          address: router.query.address as string,
          fromPolkadotExtension: false,
          temporaryAddress: true,
        };

        const walletExist = allWallets.find(
          (w) => w.address === wallet.address
        );

        if (walletExist) {
          setSelectedWallet(walletExist);
        } else {
          storageWallets.current?.push(wallet);
          setSelectedWallet(wallet);
        }
      } else {
        if (!selectedWallet && allWallets.length > 0) {
          setSelectedWallet(allWallets[0]);
        }
      }

      setLoadingStatus(false);
    },
    [
      polkadot?.accounts,
      router.query.address,
      selectedWallet,
      setSelectedWallet,
    ]
  );

  const editWallet = useCallback(
    (wallet: WalletAddress, previousWallet: WalletAddress) => {
      const walletIndex = storageWallets.current.findIndex(
        (w) => w.address === previousWallet.address
      );
      const walletExist = [
        ...polkadotWallets.current,
        ...storageWallets.current,
      ]
        .filter((w) => w.address !== previousWallet.address)
        .find((w) => w.address === wallet.address);

      const shouldEdit =
        !walletExist || wallet.address === previousWallet.address;

      if (shouldEdit) {
        storageWallets.current[walletIndex] = {
          name: wallet.name,
          address: wallet.address,
          fromPolkadotExtension: wallet.fromPolkadotExtension,
          temporaryAddress: wallet.temporaryAddress,
        };
        localStorage.setItem(
          WALLET_ADDRESSES,
          JSON.stringify(
            storageWallets.current.filter((w) => !w.temporaryAddress)
          )
        );
        setSelectedWallet(wallet);
      } else {
        showErrorNotify(WALLET_EXIST_ERROR, true);
      }
    },
    [setSelectedWallet]
  );

  const addWallet = useCallback(
    (wallet: WalletAddress, storeWallets: boolean) => {
      const walletExist =
        [...polkadotWallets.current, ...storageWallets.current].findIndex(
          (w) => w.address === wallet.address
        ) !== -1;

      if (walletExist) {
        showErrorNotify(WALLET_EXIST_ERROR, true);
      } else {
        const newArray = [...storageWallets.current, wallet];
        storageWallets.current = newArray;

        if (storeWallets) {
          localStorage.setItem(
            WALLET_ADDRESSES,
            JSON.stringify(newArray.filter((w) => !w.temporaryAddress))
          );
        }

        setSelectedWallet(wallet);
      }
    },
    [setSelectedWallet]
  );

  const addEditWallet = useCallback(
    (wallet: WalletAddress, previousWallet: WalletAddress | null) => {
      if (previousWallet) {
        editWallet(wallet, previousWallet);
      } else {
        addWallet(wallet, wallet.name !== '');
      }
    },
    [addWallet, editWallet]
  );

  const removeWallet = useCallback(
    (wallet: WalletAddress) => {
      const removedArray = storageWallets.current.filter(
        (w) => w.address !== wallet.address
      );

      storageWallets.current = removedArray;

      localStorage.setItem(
        WALLET_ADDRESSES,
        JSON.stringify(removedArray.filter((w) => !w.temporaryAddress))
      );

      const allWallets = [
        ...polkadotWallets.current,
        ...storageWallets.current,
      ];

      if (allWallets.length > 0) {
        setSelectedWallet(allWallets[0]);
      } else {
        setSelectedWallet(null);
      }
    },
    [setSelectedWallet]
  );

  useEffect(() => {
    if (!polkadot?.loading) {
      if (polkadot?.accounts && polkadot?.accounts?.length > 0) {
        setWalletAddresses(true);
      } else {
        setWalletAddresses(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polkadot?.accounts, polkadot?.loading]);

  useEffect(() => {
    if (!loadingStatus) {
      if (selectedWallet) {
        if (
          [...polkadotWallets.current, ...storageWallets.current].length > 0
        ) {
          fetchPortfolioItems(selectedWallet.address);
        }
      } else {
        if (portfolioItems.current && portfolioItems.current?.length > 0) {
          portfolioItems.current = undefined;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStatus, router.query.slug, selectedWallet]);

  return {
    loadingStatus,
    tabs,
    selectedTab: router.query.slug ? router.query.slug[0] : 'portfolio',
    changeSelectedTab,
    selectedWallet,
    walletAddresses: [...polkadotWallets.current, ...storageWallets.current],
    handleWalletChange,
    portfolioItems: portfolioItems.current,
    loading,
    totalValue: totalValue.current,
    fetchPortfolioItems,
    addEditWallet,
    removeWallet,
    pageMeta: pageMeta.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default usePortfolio;
