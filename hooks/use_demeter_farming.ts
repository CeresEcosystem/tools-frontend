import { DEMETER_API, HMX_ADDRESS, NEW_API_URL } from '@constants/index';
import {
  Farm,
  FarmAndPoolData,
  FarmData,
  Pair,
  Pool,
  PoolData,
  Token,
  TokenInfo,
} from '@interfaces/index';
import { useCallback, useEffect, useState } from 'react';

const useDemeterFarming = (hermesFilter = false) => {
  const [farmsAndPools, setFarmsAndPools] = useState<FarmAndPoolData>({
    farms: [],
    pools: [],
  });

  const getPairs = useCallback(async () => {
    return fetch(`${NEW_API_URL}/pairs`)
      .then(async (response) => {
        return (await response.json()) as Pair[];
      })
      .catch(() => []);
  }, []);

  const getTokenInfos = useCallback(async () => {
    return fetch(`${DEMETER_API}/tokens-infos`)
      .then(async (response) => {
        return (await response.json()) as TokenInfo;
      })
      .catch(() => <TokenInfo>{});
  }, []);

  const getTokens = useCallback(async () => {
    return fetch(`${NEW_API_URL}/prices`)
      .then(async (response) => {
        return (await response.json()) as Token[];
      })
      .catch(() => []);
  }, []);

  const getFarms = useCallback(
    async (pairs: Pair[], tokens: Token[], tokenInfos: TokenInfo) => {
      if (pairs && tokens) {
        return fetch(`${DEMETER_API}/farms`)
          .then(async (response) => {
            const json = await response.json();

            if (json && json.length > 0) {
              let res: Farm[] = json;

              if (hermesFilter) {
                res = res.filter((item) => item.poolAsset === HMX_ADDRESS);
              }

              const farmsArray: FarmData[] = [];

              for (const farm of res) {
                if (!farm.isRemoved) {
                  const pair = pairs.find(
                    (p) =>
                      p.baseAssetId === farm.baseAssetId &&
                      p.tokenAssetId === farm.poolAsset
                  );
                  const rewardToken = tokens?.find(
                    (t) => t.assetId === farm.rewardAsset
                  );
                  const totalLiquidity =
                    Number(farm.tvlPercent) * (pair?.liquidity! / 100);

                  const tokenInfo = tokenInfos[rewardToken!.assetId];

                  const tokenPerBlock =
                    /* @ts-ignore */
                    parseInt(tokenInfo?.tokenPerBlock?.replaceAll(',', '')) /
                    Math.pow(10, 18);

                  const farmsAllocation =
                    /* @ts-ignore */
                    parseInt(tokenInfo?.farmsAllocation?.replaceAll(',', '')) /
                    Math.pow(10, 18);

                  const apr =
                    ((tokenPerBlock *
                      farmsAllocation *
                      5256000 *
                      (Number(farm.multiplierPercent) / 100) *
                      rewardToken!.price) /
                      totalLiquidity) *
                    100;

                  const data = {
                    token: pair!.token,
                    earn: rewardToken!.token,
                    totalLiquidity,
                    apr,
                    ...farm,
                  };

                  farmsArray.push(data);
                }
              }

              return farmsArray.sort((item1, item2) => item2.apr - item1.apr);
            }
          })
          .catch(() => []);
      } else {
        return [];
      }
    },
    [hermesFilter]
  );

  const getPools = useCallback(
    async (tokens: Token[], tokenInfos: TokenInfo) => {
      if (tokens) {
        return fetch(`${DEMETER_API}/stakings`)
          .then(async (response) => {
            const json = await response.json();

            if (json && json.length > 0) {
              let res: Pool[] = json;

              if (hermesFilter) {
                res = res.filter((item) => item.poolAsset === HMX_ADDRESS);
              }

              const poolArray: PoolData[] = [];

              for (const pool of res) {
                if (!pool.isRemoved) {
                  const token = tokens?.find(
                    (t) => t.assetId === pool?.poolAsset
                  );
                  const rewardToken = tokens?.find(
                    (t) => t.assetId === pool.rewardAsset
                  );

                  const stakedTotal = pool?.totalStaked * token!.price;

                  const tokenInfo = tokenInfos[rewardToken!.assetId];

                  const tokenPerBlock =
                    /* @ts-ignore */
                    parseInt(tokenInfo?.tokenPerBlock?.replaceAll(',', '')) /
                    Math.pow(10, 18);

                  const stakingAllocation =
                    parseInt(
                      /* @ts-ignore */
                      tokenInfo?.stakingAllocation?.replaceAll(',', '')
                    ) / Math.pow(10, 18);

                  const apr =
                    ((tokenPerBlock *
                      stakingAllocation *
                      5256000 *
                      (Number(pool.multiplierPercent) / 100) *
                      rewardToken!.price) /
                      stakedTotal) *
                    100;

                  const data = {
                    token: token!.token,
                    earn: rewardToken!.token,
                    stakedTotal,
                    apr,
                    ...pool,
                  };

                  poolArray.push(data);
                }
              }

              return poolArray.sort((item1, item2) => item2.apr - item1.apr);
            }
          })
          .catch(() => []);
      } else {
        return [];
      }
    },
    [hermesFilter]
  );

  const init = useCallback(async () => {
    Promise.all([getPairs(), getTokens(), getTokenInfos()]).then(
      async (responseAPI) => {
        const pairs: Pair[] = responseAPI[0];
        const tokens: Token[] = responseAPI[1];
        const tokenInfos: TokenInfo = responseAPI[2];

        const responseFarmsAndPools = (await Promise.all([
          getFarms(pairs, tokens, tokenInfos),
          getPools(tokens, tokenInfos),
        ])) as [FarmData[], PoolData[]];

        setFarmsAndPools({
          farms: responseFarmsAndPools[0],
          pools: responseFarmsAndPools[1],
        });
      }
    );
  }, [getPairs, getTokens, getFarms, getPools, getTokenInfos]);

  useEffect(() => {
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { farmsAndPools };
};

export default useDemeterFarming;
