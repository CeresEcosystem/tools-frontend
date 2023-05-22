import Container from '@components/container';
import DemeterFarming from '@components/farming/demeter_farming';
import HermesFarming from '@components/farming/hermes_farming';
import PSWAPFarming from '@components/farming/pswap_farming';
import Tabs from '@components/tabs';
import useFarming from '@hooks/use_farming';

export default function Farming() {
  const { tabs, selectedTab, onTabSelected, onChange, tvl, loading } =
    useFarming();

  const renderFarmingBody = () => {
    switch (selectedTab) {
      case 'PSWAP':
        return <PSWAPFarming />;
      case 'DEMETER':
        return <DemeterFarming />;
      case 'HERMES':
        return <HermesFarming />;
    }
  };

  return (
    <Container>
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        onChange={onChange}
        setSelectedTab={onTabSelected}
        tvl={tvl}
        loading={loading}
      />
      {renderFarmingBody()}
    </Container>
  );
}
