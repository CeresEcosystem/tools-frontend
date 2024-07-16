import { NEW_API_URL } from '@constants/index';
import { KensetsuPortfolioData, Token, WalletAddress } from '@interfaces/index';
import { useCallback, useEffect, useState } from 'react';

const useKensetsuPortfolio = (selectedWallet: WalletAddress) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<KensetsuPortfolioData[]>([]);

  const getTokens = useCallback(async () => {
    return fetch(`${NEW_API_URL}/prices`)
      .then(async (response) => {
        return (await response.json()) as Token[];
      })
      .catch(() => []);
  }, []);

  useEffect(() => {
    async function fetchKensetsuPortfolio() {
      setLoading(true);

      const prices = await getTokens();

      const response = await fetch(
        `${NEW_API_URL}/portfolio/${selectedWallet.address}/kensetsu`
      );

      if (response.ok) {
        const kensetsuPositions =
          (await response.json()) as KensetsuPortfolioData[];
        const kensetsuPositionsFormatted: KensetsuPortfolioData[] = [];

        for (const kp of kensetsuPositions) {
          kensetsuPositionsFormatted.push({
            ...kp,
            collateralToken: prices.find(
              (token) => token.assetId === kp.collateralAssetId
            ),
            stablecoinToken: prices.find(
              (token) => token.assetId === kp.stablecoinAssetId
            ),
          });
        }

        setData(kensetsuPositionsFormatted);
      }

      setLoading(false);
    }

    fetchKensetsuPortfolio();
  }, [getTokens, selectedWallet]);

  return { loading, data };
};

export default useKensetsuPortfolio;
