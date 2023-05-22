import Spinner from '@components/spinner';
import { usePolkadot } from '@context/polkadot_context';
import useDemeterFarming from '@hooks/use_demeter_farming';
import FarmingHeading from '@components/farming/farming_heading';

function DemeterFarmingData() {
  const { farmsAndPools } = useDemeterFarming();

  if (farmsAndPools.farms?.length > 0 && farmsAndPools.pools?.length > 0) {
    return (
      <>
        <FarmingHeading
          title="Farming"
          link="https://farming.deotoken.io/farms"
          linkText="Farm on Demeter platform"
        />
        {farmsAndPools.farms.map((farm) => (
          <div key={farm.baseAsset + farm.poolAsset + farm.rewardAsset}>
            <span>{`${farm.baseAsset} ${farm.token} ${farm.apr}`}</span>
          </div>
        ))}
        <FarmingHeading
          title="Staking"
          link="https://farming.deotoken.io/staking"
          linkText="Stake on Demeter platform"
          topMargin
        />
        {farmsAndPools.pools.map((pool) => (
          <div key={pool.poolAsset + pool.rewardAsset}>
            <span>{`${pool.token} ${pool.apr}`}</span>
          </div>
        ))}
      </>
    );
  }

  return <Spinner />;
}

export default function DemeterFarming() {
  const polkadot = usePolkadot();

  return polkadot?.loading ? <Spinner /> : <DemeterFarmingData />;
}
