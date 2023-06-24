import { usePolkadot } from '@context/polkadot_context';
import { useEffect, useState, useCallback, ChangeEvent, useRef } from 'react';
import usePersistState from './use_persist_state';
import {
  PortfolioItem,
  PortfolioLiquidityItem,
  PortfolioStakingRewardsItem,
  PortfolioTab,
} from '@interfaces/index';
import { NEW_API_URL } from '@constants/index';
import { getEncodedAddress } from '@utils/helpers';

export type LoadingStatus =
  | 'Loading'
  | 'No extension'
  | 'Not connected'
  | 'Connected';

const tabs = [
  { tab: 'Portfolio', permalink: '/portfolio/' },
  { tab: 'Staking', permalink: '/portfolio/staking/' },
  { tab: 'Rewards', permalink: '/portfolio/rewards/' },
  { tab: 'Liquidity', permalink: '/portfolio/liquidity/' },
];

const usePortfolio = () => {
  const polkadot = usePolkadot();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('Loading');
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [inputWalletAddress, setInputWalletAddress] = usePersistState(
    '',
    'WALLET_ADDRESS'
  );
  const [loading, setLoading] = useState(false);

  const portfolioItems = useRef<
    | (PortfolioItem | PortfolioStakingRewardsItem | PortfolioLiquidityItem)[]
    | undefined
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
            `${NEW_API_URL}${selectedTab.permalink}${getEncodedAddress(
              address
            )}`
          );
          const json = await response.json();

          if (json && json?.length > 0) {
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

  const handleWalletAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInputWalletAddress(e.target.value);
    },
    [setInputWalletAddress]
  );

  const changeSelectedTab = (tab: PortfolioTab) => {
    if (tab !== selectedTab) {
      setLoading(true);
      setSelectedTab(tab);
    }
  };

  useEffect(() => {
    if (!polkadot?.loading) {
      if (polkadot?.accounts && polkadot?.accounts?.length > 0) {
        if (polkadot?.selectedAccount?.address) {
          setLoadingStatus('Connected');
        } else {
          setLoadingStatus('Not connected');
        }
      } else {
        setLoadingStatus('No extension');
      }
    }
  }, [
    polkadot?.accounts,
    polkadot?.loading,
    polkadot?.selectedAccount?.address,
  ]);

  useEffect(() => {
    if (loadingStatus === 'Connected') {
      fetchPortfolioItems(polkadot?.selectedAccount?.address!);
    } else if (loadingStatus === 'No extension' && inputWalletAddress !== '') {
      fetchPortfolioItems(inputWalletAddress);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStatus, selectedTab]);

  return {
    loadingStatus,
    tabs,
    selectedTab,
    changeSelectedTab,
    inputWalletAddress,
    handleWalletAddressChange,
    walletAddress: polkadot?.selectedAccount?.address,
    portfolioItems: portfolioItems.current,
    loading,
    totalValue: totalValue.current,
    fetchPortfolioItems,
  };
};

export default usePortfolio;
