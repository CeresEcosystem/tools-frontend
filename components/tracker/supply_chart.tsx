import TrackerChart from '@components/charts/tracker_chart';
import Title from '@components/title';
import { Supply } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';

import { useFormatter } from 'next-intl';

export default function SupplyChart({ supply }: { supply?: Supply[] }) {
  const format = useFormatter();

  return (
    <>
      <Title title="Track PSWAP supply" topMargin />
      <div className="mt-16 p-4 rounded-xl bg-backgroundItem bg-opacity-20 backdrop-blur-lg">
        {supply ? (
          <TrackerChart
            data={supply.map((point) => point.y)}
            labels={supply?.map((point) =>
              new Date(point.x).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
              })
            )}
            callbackTitle={(tooltipItems: any) => {
              const dataIndex = tooltipItems[0]?.dataIndex;
              if (dataIndex !== undefined) {
                const { x }: Supply = supply![dataIndex];
                return `Date: ${x}`;
              }
              return '';
            }}
            callbackLabel={(context: any) => {
              const { dataIndex }: { dataIndex: number } = context;
              const { y }: Supply = supply![dataIndex];
              return `PSWAP Gross Burn: ${formatNumber(format, y, 4)}`;
            }}
          />
        ) : (
          <span className="text-white font-medium">No data</span>
        )}
      </div>
    </>
  );
}
