import Container from '@components/container';
import Faqs from '@components/faqs';
import Spinner from '@components/spinner';
import SponsoredByPococo from '@components/sponsors/pococo';
import Title from '@components/title';
import Burning from '@components/tracker/burning';
import BurningChart from '@components/tracker/burning_chart';
import GrossTable from '@components/tracker/gross_table';
import SupplyChart from '@components/tracker/supply_chart';
import TableGrid from '@components/tracker/table_grid';
import XorSpent from '@components/tracker/xor_spent';
import { PSWAPTrackerQuestions } from '@constants/pswap_tracker_questions';
import useTracker from '@hooks/use_tracker';

export default function Tracker() {
  const { loading, trackerData } = useTracker();

  return (
    <Container>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Title
            title="Track PSWAP"
            subtitle="Follow the progression of PSWAP."
          />
          <TableGrid>
            <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">
              <Burning burn={trackerData?.burn} />
              <XorSpent blocks={trackerData?.blocks} last={trackerData?.last} />
            </div>
            <GrossTable blocks={trackerData?.blocks} />
          </TableGrid>
          <BurningChart burning={trackerData?.graphBurning} />
          <SupplyChart supply={trackerData?.graphSupply} />
          <Faqs faqs={PSWAPTrackerQuestions} />
          <SponsoredByPococo />
        </>
      )}
    </Container>
  );
}
