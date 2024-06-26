import { APOLLO_API_URL, NEW_API_URL } from '@constants/index';
import { ApolloDashboardData, Token, WalletAddress } from '@interfaces/index';
import { useCallback, useEffect, useState } from 'react';

const useApolloDashboard = (selectedWallet: WalletAddress) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApolloDashboardData>();

  const getTokens = useCallback(async () => {
    return fetch(`${NEW_API_URL}/prices`)
      .then(async (response) => {
        return (await response.json()) as Token[];
      })
      .catch(() => []);
  }, []);

  useEffect(() => {
    async function fetchApolloDashboard() {
      setLoading(true);

      const prices = await getTokens();

      const response = await fetch(
        `${APOLLO_API_URL}/users/${selectedWallet.address}`
      );

      if (response.ok) {
        const json = (await response.json()) as ApolloDashboardData;

        const rewardPrice =
          prices.find((token) => token.token === 'APOLLO')?.price || 0;

        setData({
          ...json,
          lendingInfo: json.lendingInfo
            .filter((item) => Number(item.amount) > 0)
            .map((item) => {
              return {
                ...item,
                amountPrice:
                  Number(item.amount) *
                  (prices.find((token) => token.assetId === item.poolAssetId)
                    ?.price || 0),
                rewardPrice: Number(item.rewards) * rewardPrice,
              };
            }),
          borrowingInfo: json.borrowingInfo
            .filter((item) => Number(item.amount) > 0)
            .map((item) => {
              const amountPrice =
                prices.find((token) => token.assetId === item.poolAssetId)
                  ?.price || 0;

              return {
                ...item,
                amountPrice: Number(item.amount) * amountPrice,
                interestPrice: Number(item.interest) * amountPrice,
                rewardPrice: Number(item.rewards) * rewardPrice,
                collaterals: item.collaterals.map((collateral) => {
                  return {
                    ...collateral,
                    collateralAmountPrice:
                      Number(collateral.collateralAmount) *
                      (prices.find(
                        (token) =>
                          token.assetId === collateral.collateralAssetId
                      )?.price || 0),
                    borrowedAmountPrice:
                      Number(collateral.borrowedAmount) * amountPrice,
                    interestPrice: Number(collateral.interest) * amountPrice,
                    rewardPrice: Number(collateral.rewards) * rewardPrice,
                  };
                }),
              };
            }),
        });
      }

      setLoading(false);
    }

    fetchApolloDashboard();
  }, [getTokens, selectedWallet]);

  return { loading, data };
};

export default useApolloDashboard;
