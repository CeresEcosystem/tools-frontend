import Container from '@components/container';
import Faqs from '@components/faqs';
// import Socials from '@components/socials';
import SponsoredByPococo from '@components/sponsors/pococo';
import Title from '@components/title';
import Burning from '@components/tracker/burning';
import BurningChart from '@components/tracker/burning_chart';
import GrossTable from '@components/tracker/gross_table';
import SupplyChart from '@components/tracker/supply_chart';
import TableGrid from '@components/tracker/table_grid';
import XorSpent from '@components/tracker/xor_spent';
import { NEW_API_URL } from '@constants/index';
import { PSWAPTrackerQuestions } from '@constants/pswap_tracker_questions';
import { TrackerData } from '@interfaces/index';

export default function Tracker({ data }: { data?: TrackerData }) {
  return (
    <Container>
      <Title title="Track PSWAP" subtitle="Follow the progression of PSWAP." />
      <TableGrid>
        <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">
          <Burning burn={data?.burn} />
          <XorSpent blocks={data?.blocks} last={data?.last} />
        </div>
        <GrossTable blocks={data?.blocks} />
      </TableGrid>
      <BurningChart burning={data?.graphBurning} />
      <SupplyChart supply={data?.graphSupply} />
      <Faqs faqs={PSWAPTrackerQuestions} />
      {/* <Socials /> */}
      <SponsoredByPococo />
    </Container>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${NEW_API_URL}/tracker`);
  let data;

  if (res.ok) {
    data = (await res.json()) as TrackerData;
  }

  return { props: { data } };
}
