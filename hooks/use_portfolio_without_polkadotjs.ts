import { NEW_API_URL } from '@constants/index';
import { PortfolioItem } from '@interfaces/index';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import usePersistState from './use_persist_state';

const usePortfolioWithoutPolkadotJS = () => {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = usePersistState(
    '',
    'WALLET_ADDRESS'
  );

  const portfolioItems = useRef<PortfolioItem[]>([]);

  const totalValue = useRef(0);

  const handleWalletAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setWalletAddress(e.target.value);
    },
    [setWalletAddress]
  );

  const fetchPortfolioItems = useCallback(() => {
    if (walletAddress !== '') {
      setLoading(true);

      fetch(`${NEW_API_URL}/portfolio/${walletAddress}`)
        .then(async (response) => {
          const json = (await response.json()) as PortfolioItem[];

          const itemsFiltered = json.filter((pi) => pi.balance >= 0.0001);

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
        })
        .catch(() => {
          portfolioItems.current = [];
          setLoading(false);
        });
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchPortfolioItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    portfolioItems: portfolioItems.current,
    totalValue: totalValue.current,
    walletAddress,
    handleWalletAddressChange,
    fetchPortfolioItems,
  };
};

export default usePortfolioWithoutPolkadotJS;
