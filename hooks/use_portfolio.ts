import { NEW_API_URL } from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import { PortfolioItem } from '@interfaces/index';
import { getEncodedAddress } from '@utils/helpers';
import { useEffect, useRef, useState } from 'react';

const usePortfolio = () => {
  const polkadot = usePolkadot();

  const [loading, setLoading] = useState(false);

  const [portfolioItems, setPortfolioItems] = useState<
    PortfolioItem[] | string
  >('');

  const totalValue = useRef(0);

  useEffect(() => {
    if (polkadot?.selectedAccount?.address) {
      setLoading(true);

      fetch(
        `${NEW_API_URL}/portfolio/${getEncodedAddress(
          polkadot?.selectedAccount?.address
        )}`
      )
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

          setPortfolioItems(itemsFiltered);
          setLoading(false);
        })
        .catch(() => {
          setPortfolioItems([]);
          setLoading(false);
        });
    } else {
      totalValue.current = 0;
      setPortfolioItems('Waiting for wallet connection...');
      setLoading(false);
    }
  }, [polkadot?.selectedAccount?.address]);

  return { loading, portfolioItems, totalValue: totalValue.current };
};

export default usePortfolio;
