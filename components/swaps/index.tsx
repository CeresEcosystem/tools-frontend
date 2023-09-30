import ListPagination from '@components/pagination/list_pagination';
import Spinner from '@components/spinner';
import { ASSET_URL } from '@constants/index';
import useSwaps from '@hooks/use_swaps';
import { Token } from '@interfaces/index';
import {
  formatDate,
  formatNumber,
  formatNumberExceptDecimal,
} from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle = 'text-center text-white px-2 py-4 text-xs font-medium';

export default function Swaps({
  address,
  tokens,
}: {
  address: string;
  tokens: Token[];
}) {
  const format = useFormatter();

  const {
    swaps,
    pageMeta,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    pageLoading,
  } = useSwaps(tokens, address);

  if (swaps === undefined) return <Spinner />;

  if (swaps.length === 0)
    return (
      <span className="p-8 text-white font-medium">
        No swaps for selected token
      </span>
    );

  return (
    <div className="max-w-full overflow-x-auto relative my-8 sm:px-8">
      <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
        <thead className="bg-white bg-opacity-10">
          <tr className="border-collapse border-4 border-backgroundHeader">
            <th className={tableHeadStyle}>Date</th>
            <th className={tableHeadStyle}>Type</th>
            <th className={tableHeadStyle}>Account</th>
            <th className={tableHeadStyle}>Sold Token</th>
            <th className={tableHeadStyle}>Bought Token</th>
            <th className={tableHeadStyle}>Sold Amount</th>
            <th className={tableHeadStyle}>Bought Amount</th>
          </tr>
        </thead>
        <tbody>
          {swaps.map((swap, index) => (
            <tr
              key={swap.swappedAt + index}
              className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
            >
              <td className={classNames(cellStyle, 'min-w-[150px]')}>
                {formatDate(swap.swappedAt)}
              </td>
              <td
                className={classNames(
                  cellStyle,
                  swap.type === 'Buy' ? '!text-green-400' : '!text-red-400'
                )}
              >
                {swap.type}
              </td>
              <td className={cellStyle}>{swap.accountId}</td>
              <td className={classNames(cellStyle, 'min-w-[150px]')}>
                <img
                  src={`${ASSET_URL}/${swap.inputAsset}.svg`}
                  alt=""
                  className="w-8 h-8 mr-3 inline-block"
                />
                <span className="text-left min-w-[50px] inline-block">
                  {swap.inputAsset}
                </span>
              </td>
              <td className={classNames(cellStyle, 'min-w-[150px]')}>
                <img
                  src={`${ASSET_URL}/${swap.outputAsset}.svg`}
                  alt=""
                  className="w-8 h-8 mr-3 inline-block"
                />
                <span className="text-left min-w-[50px] inline-block">
                  {swap.outputAsset}
                </span>
              </td>
              <td className={cellStyle}>
                {formatNumberExceptDecimal(format, swap.assetInputAmount)}
              </td>
              <td className={cellStyle}>
                {formatNumberExceptDecimal(format, swap.assetOutputAmount)}
              </td>
            </tr>
          ))}
        </tbody>
        {pageMeta && pageMeta.pageCount > 1 && (
          <tfoot className="bg-backgroundHeader border-t-backgroundHeader">
            <tr>
              <td colSpan={3}>
                <span className="px-4 text-white font-medium">
                  {`Total swaps: ${formatNumber(
                    format,
                    pageMeta.totalCount,
                    0
                  )}`}
                </span>
              </td>
              <td colSpan={4} className="py-2.5 px-4">
                <ListPagination
                  currentPage={pageMeta.pageNumber - 1}
                  totalPages={pageMeta.pageCount}
                  goToFirstPage={goToFirstPage}
                  goToPreviousPage={goToPreviousPage}
                  goToNextPage={goToNextPage}
                  goToLastPage={goToLastPage}
                  small
                  topMargin={false}
                  justifyEnd
                />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      {pageLoading && (
        <div className="absolute inset-0 z-10 bg-black bg-opacity-20 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
