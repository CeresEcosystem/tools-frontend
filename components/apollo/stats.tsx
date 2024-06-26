import StatsInfo from '@components/stats/stats_info';
import { StatsData } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';

export default function ApolloStats({ userData }: { userData: StatsData }) {
  const format = useFormatter();

  return (
    <div className="flex justify-center">
      <div className="bg-backgroundHeader py-2 px-6 rounded-xl w-full inline-flex flex-col items-center justify-center flex-wrap gap-y-2 gap-x-6 xs:flex-row xl:w-auto">
        <StatsInfo
          label="Total Value Locked:"
          info={`$${formatNumber(format, userData.tvl, 3)}`}
        />
        <StatsInfo
          label="Lent:"
          info={`$${formatNumber(format, userData.totalLent, 3)}`}
        />
        <StatsInfo
          label="Borrowed:"
          info={`$${formatNumber(format, userData.totalBorrowed, 3)}`}
        />
        <StatsInfo
          label="Total Rewards:"
          info={`${formatNumber(format, userData.totalRewards, 3)} APOLLO`}
        />
      </div>
    </div>
  );
}
