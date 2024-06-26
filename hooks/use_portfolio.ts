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
  { tab: 'Apollo', permalink: '/portfolio/apollo/' },
];

const WALLET_EXIST_ERROR = 'Wallet with entered address already exist.';

const usePortfolio = () => {
  const { pathname, query, push, replace } = useRouter();

  const polkadot = usePolkadot();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] =
    usePersistState<WalletAddress | null>(
      null,
      'SELECTED_WALLET',
      (value: WalletAddress | null) => {
        if (value && value.name !== '') return true;
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

  const setURLAddress = useCallback(
    (address: string) => {
      replace({
        pathname,
        query: { address, slug: query.slug ?? '' },
      });
    },
    [pathname, replace, query.slug]
  );

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
    async (page = 1, sw = selectedWallet) => {
      if (!loading) {
        setLoading(true);
      }

      if (sw) {
        if (
          [...polkadotWallets.current, ...storageWallets.current].length > 0
        ) {
          if (query.slug && query.slug[0] === 'apollo') {
            portfolioItems.current = [];
            setLoading(false);
            return;
          }

          try {
            const permalink = query.slug
              ? `/portfolio/${query.slug[0]}/`
              : '/portfolio/';

            const response = await fetch(
              `${NEW_API_URL}${permalink}${sw.address}?page=${page}`
            );

            if (response.status === 429) {
              portfolioItems.current = 'throttle error';
              setLoading(false);
            } else {
              const json = await response.json();

              if (response.status === 200 && json) {
                let array = [];

                if (query.slug === undefined) {
                  array = json as PortfolioItem[];
                  sortAndFilterItems(array);
                } else if (
                  query.slug[0] === 'staking' ||
                  query.slug[0] === 'rewards'
                ) {
                  array = json as PortfolioStakingRewardsItem[];
                  sortAndFilterItems(array);
                } else if (query.slug[0] === 'swaps') {
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
                } else if (query.slug[0] === 'transfers') {
                  const jsonResponse = json as TransferData;
                  pageMeta.current = jsonResponse.meta;

                  const transfersArray: PortfolioTransferItem[] = [];
                  const tokensJson = await getTokens();

                  jsonResponse.data.forEach((transfer) => {
                    const walletSender: WalletAddress | undefined = [
                      ...polkadotWallets.current,
                      ...storageWallets.current,
                    ].find((w) => w.address === transfer.sender);
                    const walletReceiver: WalletAddress | undefined = [
                      ...polkadotWallets.current,
                      ...storageWallets.current,
                    ].find((w) => w.address === transfer.receiver);

                    transfersArray.push({
                      ...transfer,
                      tokenFormatted: tokensJson.find(
                        (token) => token.assetId === transfer.asset
                      )?.token,
                      senderFormatted:
                        walletSender && walletSender.name !== ''
                          ? walletSender.name
                          : formatWalletAddress(transfer.sender),
                      receiverFormatted:
                        walletReceiver && walletReceiver.name !== ''
                          ? walletReceiver.name
                          : formatWalletAddress(transfer.receiver),
                    });
                  });

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
        }
      } else {
        portfolioItems.current = undefined;
        totalValue.current = 0;
        setLoading(false);
      }
    },
    [loading, selectedWallet, query.slug, getTokens]
  );

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      fetchPortfolioItems();
    }
  }, [fetchPortfolioItems]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      fetchPortfolioItems(pageMeta.current.pageNumber - 1);
    }
  }, [fetchPortfolioItems]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      fetchPortfolioItems(pageMeta.current.pageNumber + 1);
    }
  }, [fetchPortfolioItems]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      fetchPortfolioItems(pageMeta.current.pageCount);
    }
  }, [fetchPortfolioItems]);

  const handleWalletChange = useCallback(
    (newWallet?: string) => {
      if (newWallet && newWallet !== selectedWallet?.address) {
        if (!loading) {
          setLoading(true);
        }

        setURLAddress(newWallet);
      }
    },
    [loading, selectedWallet?.address, setURLAddress]
  );

  const changeSelectedTab = useCallback(
    (tab: PortfolioTab) => {
      if (!loading) {
        setLoading(true);
      }
      push(
        `${tab.permalink}${query.address ? `?address=${query.address}` : ''}`
      );
    },
    [loading, push, query.address]
  );

  const setWallet = useCallback(() => {
    if (
      query.address !== selectedWallet?.address &&
      query.address?.toString().startsWith('cn')
    ) {
      const wallet = [
        ...polkadotWallets.current,
        ...storageWallets.current,
      ].find((w) => w.address === query.address) ?? {
        name: '',
        address: query.address as string,
        fromPolkadotExtension: false,
        temporaryAddress: true,
      };

      if (wallet.name === '') {
        storageWallets.current?.push(wallet);
      }

      setSelectedWallet(wallet);
      setLoadingStatus(false);
      fetchPortfolioItems(1, wallet);
    } else {
      setLoadingStatus(false);
      fetchPortfolioItems();
    }
  }, [
    fetchPortfolioItems,
    query.address,
    selectedWallet?.address,
    setSelectedWallet,
  ]);

  const setWalletAddresses = useCallback(
    (connected: boolean) => {
      if (connected) {
        polkadotWallets.current =
          polkadot?.accounts?.map((acc) => {
            return {
              name: acc.meta.name,
              address: getEncodedAddress(acc.address),
              fromPolkadotExtension: true,
              temporaryAddress: false,
            } as WalletAddress;
          }) ?? [];
      }

      const wallets = localStorage.getItem(WALLET_ADDRESSES);
      const walletsDB = wallets ? (JSON.parse(wallets) as WalletAddress[]) : [];

      storageWallets.current = walletsDB.map((w) => {
        return { ...w, temporaryAddress: w.name === '' };
      });

      setWalletsLoading(false);

      if (!query.address) {
        if (selectedWallet) {
          setURLAddress(selectedWallet.address);
        } else if (
          !selectedWallet &&
          [...polkadotWallets.current, ...storageWallets.current].length > 0
        ) {
          setURLAddress(
            [...polkadotWallets.current, ...storageWallets.current][0].address
          );
        } else {
          setLoadingStatus(false);
          setLoading(false);
        }
      }
    },
    [polkadot?.accounts, query.address, selectedWallet, setURLAddress]
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
        setURLAddress(wallet.address);
      } else {
        showErrorNotify(WALLET_EXIST_ERROR, true);
      }
    },
    [setURLAddress]
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

        setURLAddress(wallet.address);
      }
    },
    [setURLAddress]
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
        setURLAddress(allWallets[0].address);
      } else {
        setSelectedWallet(null);
        delete query.address;
        replace({
          pathname,
          query: { slug: query.slug ?? '' },
        });
      }
    },
    [
      pathname,
      replace,
      query.address,
      query.slug,
      setSelectedWallet,
      setURLAddress,
    ]
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
    if (!walletsLoading && query.address) {
      setWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, walletsLoading]);

  return {
    loadingStatus,
    tabs,
    selectedTab: query.slug ? query.slug[0] : 'portfolio',
    changeSelectedTab,
    selectedWallet,
    walletAddresses: [...polkadotWallets.current, ...storageWallets.current],
    handleWalletChange,
    portfolioItems: portfolioItems.current,
    loading,
    totalValue: totalValue.current,
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
