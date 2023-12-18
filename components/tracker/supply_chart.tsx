import LineChart from '@components/charts/line_chart';
import Title from '@components/title';
import { Supply } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import classNames from 'classnames';

import { useFormatter } from 'next-intl';

export default function SupplyChart({
  supply,
  selectedToken,
  showTitle = true,
}: {
  supply?: Supply[];
  selectedToken: string;
  showTitle?: boolean;
}) {
  const format = useFormatter();

  return (
    <>
      {showTitle && <Title title={`Track ${selectedToken} supply`} topMargin />}
      <div
        className={classNames(
          'p-4 rounded-xl bg-backgroundItem',
          showTitle ? 'mt-16' : 'mt-8'
        )}
      >
        {supply ? (
          <LineChart
            data={supply.map((point) => point.y)}
            labels={supply?.map((point) =>
              new Date(point.x).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
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
              return `Gross Burn: ${formatNumber(format, y, 4)}`;
            }}
          />
        ) : (
          <span className="text-white font-medium">No data</span>
        )}
      </div>
    </>
  );
}
