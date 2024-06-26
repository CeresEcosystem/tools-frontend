import { formatCurrencyWithDecimals } from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';

export default function Table({
  totalValue,
  renderHeader,
  renderBody,
  footerColSpan,
}: {
  totalValue?: number;
  renderHeader: React.ReactNode;
  renderBody: React.ReactNode;
  footerColSpan?: number;
}) {
  const format = useFormatter();

  const footerStyle = 'text-white px-4 py-2 text-left text-base font-bold';

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
        <thead className="bg-white bg-opacity-10">
          <tr className="border-collapse border-4 border-backgroundHeader">
            {renderHeader}
          </tr>
        </thead>
        <tbody>{renderBody}</tbody>
        {totalValue && (
          <tfoot className="bg-backgroundHeader border-t-4 border-t-backgroundHeader">
            <tr>
              <td colSpan={footerColSpan} className={footerStyle}>
                Total Value
              </td>
              <td className={classNames(footerStyle, 'text-center !text-pink')}>
                {formatCurrencyWithDecimals(format, totalValue, 2, true)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
