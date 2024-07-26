import LineChart from '@components/charts/line_chart';
import Title from '@components/title';
import { Burning } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';

import { useFormatter } from 'next-intl';
import { useCallback } from 'react';

export default function BurningChart({
  burning,
  selectedToken,
}: {
  burning?: Burning[];
  selectedToken: string;
}) {
  const format = useFormatter();

  const getCallbackLabels = useCallback(
    (
      y: number,
      spent: number,
      lp: number,
      parl: number,
      net: number,
      back: number
    ) => {
      switch (selectedToken) {
        case 'PSWAP':
          return [
            `Gross Burn: ${formatNumber(format, y)}`,
            `XOR spent: ${formatNumber(format, spent)}`,
            `Reminted LP: ${formatNumber(format, lp)}`,
            `Reminted Parliament: ${formatNumber(format, parl)}`,
            `Total Reminted: ${formatNumber(format, lp + parl)}`,
            `Net Burn: ${formatNumber(format, net)}`,
          ];
        case 'VAL':
          return [
            `Gross Burn: ${formatNumber(format, y)}`,
            `XOR fees: ${formatNumber(format, spent)}`,
            `XOR for buyback: ${formatNumber(format, back)}`,
            `Reminted Parliament: ${formatNumber(format, parl)}`,
            `Total Reminted: ${formatNumber(format, lp + parl)}`,
            `Net Burn: ${formatNumber(format, net)}`,
          ];
        case 'XOR':
          return [`Gross Burn: ${formatNumber(format, y)}`];
      }
    },
    [format, selectedToken]
  );

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
              return getCallbackLabels(y, spent, lp, parl, net, back);
            }}
          />
        ) : (
          <span className="text-white font-medium">No data</span>
        )}
      </div>
    </>
  );
}
