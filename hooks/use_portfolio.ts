import { usePolkadot } from '@context/polkadot_context';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  PortfolioItem,
  PortfolioLiquidityItem,
  PortfolioStakingRewardsItem,
  PortfolioTab,
  WalletAddress,
} from '@interfaces/index';
import { NEW_API_URL, WALLET_ADDRESSES } from '@constants/index';
import { getEncodedAddress } from '@utils/helpers';
import usePersistState from './use_persist_state';
import { useRouter } from 'next/router';

const tabs = [
  { tab: 'Portfolio', permalink: '/portfolio/' },
  { tab: 'Staking', permalink: '/portfolio/staking/' },
  { tab: 'Rewards', permalink: '/portfolio/rewards/' },
  { tab: 'Liquidity', permalink: '/portfolio/liquidity/' },
];

const usePortfolio = () => {
  const router = useRouter();

  const polkadot = usePolkadot();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] =
    usePersistState<WalletAddress | null>(
      null,
      'SELECTED_WALLET',
      (value: WalletAddress | null) => {
        if (value && value.name !== '' && router.query.slug === undefined)
          return true;
        return false;
      }
    );

  const polkadotWallets = useRef<WalletAddress[]>([]);
  const storageWallets = useRef<WalletAddress[]>([]);

  const portfolioItems = useRef<
    | (PortfolioItem | PortfolioStakingRewardsItem | PortfolioLiquidityItem)[]
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

  const fetchPortfolioItems = useCallback(
    async (address: string) => {
      if (!loading) {
        setLoading(true);
      }

      if (address !== '') {
        try {
          const response = await fetch(
            `${NEW_API_URL}${selectedTab.permalink}${address}`
          );

          if (response.status === 429) {
            portfolioItems.current = 'throttle error';
            setLoading(false);
          } else {
            const json = await response.json();

            if (response.status === 200 && json && json?.length > 0) {
              let array = [];

              if (selectedTab.tab === 'Portfolio') {
                array = json as PortfolioItem[];
                sortAndFilterItems(array);
              } else if (
                selectedTab.tab === 'Staking' ||
                selectedTab.tab === 'Rewards'
              ) {
                array = json as PortfolioStakingRewardsItem[];
                sortAndFilterItems(array);
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
    [selectedTab.permalink, selectedTab.tab, loading]
  );

  const handleWalletChange = (newWallet?: string) => {
    const wallet =
      [...polkadotWallets.current, ...storageWallets.current].find(
        (w) => w.address === newWallet
      ) ?? null;

    setSelectedWallet(wallet);
  };

  const changeSelectedTab = (tab: PortfolioTab) => {
    if (tab !== selectedTab) {
      setLoading(true);
      setSelectedTab(tab);
    }
  };

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

      if (router.query.slug && router.query.slug?.length > 0) {
        const wallet: WalletAddress = {
          name: '',
          address: router.query.slug[0],
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
    [polkadot?.accounts, router.query.slug, selectedWallet, setSelectedWallet]
  );

  const editWallet = useCallback(
    (wallet: WalletAddress, index: number) => {
      storageWallets.current[index] = {
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
    },
    [setSelectedWallet]
  );

  const addWallet = useCallback(
    (wallet: WalletAddress, storeWallets: boolean) => {
      const walletExist = [
        ...polkadotWallets.current,
        ...storageWallets.current,
      ].find((w) => w.address === wallet.address);

      if (walletExist) {
        setSelectedWallet(walletExist);
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
      if (wallet.name !== '') {
        if (previousWallet) {
          const walletIndex = storageWallets.current.findIndex(
            (w) => w.address === previousWallet.address
          );

          editWallet(wallet, walletIndex);
        } else {
          addWallet(wallet, true);
        }
      } else {
        addWallet(wallet, false);
      }
    },
    [addWallet, editWallet]
  );

  const removeWallet = useCallback(
    (wallet: WalletAddress) => {
      const removedArray = Array.from(storageWallets.current).filter(
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
  }, [loadingStatus, selectedTab, selectedWallet]);

  return {
    loadingStatus,
    tabs,
    selectedTab,
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
  };
};

export default usePortfolio;
