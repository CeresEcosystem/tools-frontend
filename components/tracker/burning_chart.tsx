import LineChart from '@components/charts/line_chart';
import Title from '@components/title';
import { Burning } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';

import { useFormatter } from 'next-intl';

export default function BurningChart({
  burning,
  selectedToken,
}: {
  burning?: Burning[];
  selectedToken: string;
}) {
  const format = useFormatter();

  return (
    <>
      <Title title={`Track ${selectedToken} burning`} topMargin />
      <div className="mt-16 p-4 rounded-xl bg-backgroundItem">
        {burning ? (
          <LineChart
            data={burning.map((point) => point.y)}
            labels={burning?.map((point) =>
              new Date(point.x).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })
            )}
            callbackTitle={(tooltipItems: any) => {
              const dataIndex = tooltipItems[0]?.dataIndex;
              if (dataIndex !== undefined) {
                const { x }: Burning = burning![dataIndex];
                return `Date: ${x}`;
              }
              return '';
            }}
            callbackLabel={(context: any) => {
              const { dataIndex }: { dataIndex: number } = context;
              const { y, spent, lp, parl, net, back }: Burning =
                burning![dataIndex];
              return [
                `Gross Burn: ${formatNumber(format, y)}`,
                `XOR ${
                  selectedToken === 'PSWAP' ? 'spent' : 'fees'
                }: ${formatNumber(format, spent)}`,
                selectedToken === 'PSWAP'
                  ? `Reminted LP: ${formatNumber(format, lp)}`
                  : `XOR for buyback: ${formatNumber(format, back)}`,
                `Reminted Parliament: ${formatNumber(format, parl)}`,
                `Total Reminted: ${formatNumber(format, lp + parl)}`,
                `Net Burn: ${formatNumber(format, net)}`,
              ];
            }}
          />
        ) : (
          <span className="text-white font-medium">No data</span>
        )}
      </div>
    </>
  );
}
