import Spinner from '@components/spinner';
import useDemeterFarming from '@hooks/use_demeter_farming';
import FarmingHeading from '@components/farming/farming_heading';
import FarmContainer from './farm_container';
import FarmItem from './farm_item';

export default function HermesFarming() {
  const { farmsAndPools } = useDemeterFarming(true);

  if (farmsAndPools.farms?.length > 0 && farmsAndPools.pools?.length > 0) {
    return (
      <>
        <FarmingHeading
          title="Farming"
          link="https://hermes-dao.io/rewards/farm"
          linkText="Farm on Hermes DAO platform"
        />
        <FarmContainer>
          {farmsAndPools.farms.map((farm) => (
            <FarmItem
              key={farm.baseAsset + farm.poolAsset + farm.rewardAsset}
              item={farm}
            />
          ))}
        </FarmContainer>
        <FarmingHeading
          title="Staking"
          link="https://hermes-dao.io/rewards/staking"
          linkText="Stake on Hermes DAO platform"
          topMargin
        />
        <FarmContainer>
          {farmsAndPools.pools.map((pool) => (
            <FarmItem
              key={pool.poolAsset + pool.rewardAsset}
              item={pool}
              isFarm={false}
            />
          ))}
        </FarmContainer>
      </>
    );
  }

  return <Spinner />;
}
