import { formatCurrencyWithDecimals, formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';

export default function PriceCell({
  valuePercentage,
  value,
}: {
  valuePercentage: number;
  value: number;
}) {
  const format = useFormatter();

  if (value === 0) {
    return <span className="text-white text-opacity-50">0%</span>;
  }

  if (value < 0) {
    return (
      <div className="flex flex-col space-y-1">
        <span className="text-red-400">{`${formatNumber(
          format,
          valuePercentage,
          2
        )}%`}</span>
        <span className="text-red-400 text-xs">
          {formatCurrencyWithDecimals(format, value, 2, true)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-green-400">{`${formatNumber(
        format,
        valuePercentage,
        2
      )}%`}</span>
      <span className="text-green-400 text-xs">
        {formatCurrencyWithDecimals(format, value, 2, true)}
      </span>
    </div>
  );
}
