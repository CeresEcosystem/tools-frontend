import LineChart from '@components/charts/line_chart';
import Container from '@components/container';
import Spinner from '@components/spinner';
import GridStats from '@components/stats/grid_stats';
import Title from '@components/title';
import { TBC_RESERVES_ADDRESS } from '@constants/index';
import useTBCReserves from '@hooks/use_tbc_reserves';
import { TBCReservesItem } from '@interfaces/index';
import {
  formatDate,
  formatNumber,
  formatCurrencyWithDecimals,
} from '@utils/helpers';
import { useFormatter } from 'next-intl';
import Link from 'next/link';

export default function TBCReserves() {
  const format = useFormatter();
  const { loading, tbcReserves } = useTBCReserves();

  return (
    <Container>
      <div className="p-4 rounded-xl bg-backgroundItem text-center">
        <span className="text-sm text-white text-opacity-50 md:text-base">
          TBC Reserves Address:{' '}
          <Link
            className="text-white hover:underline"
            href={`/portfolio?address=${TBC_RESERVES_ADDRESS}`}
          >
            {TBC_RESERVES_ADDRESS}
          </Link>
        </span>
      </div>
      <div className="mt-16">
        {loading ? (
          <Spinner />
        ) : tbcReserves ? (
          <>
            <Title title="TBCD Reserves" />
            <div className="mt-8">
              <GridStats
                firstLabel="Total balance"
                firstValue={formatNumber(format, tbcReserves.currentBalance)}
                secondLabel="Total value"
                secondValue={formatCurrencyWithDecimals(
                  format,
                  tbcReserves.currentValue
                )}
              />
            </div>
            <div className="p-4 mt-8 rounded-xl bg-backgroundItem">
              <LineChart
                data={tbcReserves.data.map((point) => point.balance)}
                labels={tbcReserves.data.map((point) =>
                  formatDate(point.updatedAt)
                )}
                callbackTitle={(tooltipItems: any) => {
                  const dataIndex = tooltipItems[0]?.dataIndex;
                  if (dataIndex !== undefined) {
                    const { updatedAt }: TBCReservesItem =
                      tbcReserves.data[dataIndex];
                    return `Date: ${formatDate(updatedAt)}`;
                  }
                  return '';
                }}
                callbackLabel={(context: any) => {
                  const { dataIndex }: { dataIndex: number } = context;
                  const { balance, value }: TBCReservesItem =
                    tbcReserves.data[dataIndex];
                  return [
                    `Balance: ${formatNumber(format, balance)}`,
                    `Value: $${formatNumber(format, value)}`,
                  ];
                }}
              />
            </div>
          </>
        ) : null}
      </div>
    </Container>
  );
}
