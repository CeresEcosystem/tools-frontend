import Clipboard from '@components/clipboard';
import FallbackImage from '@components/image/fallback_image';
import ListPagination from '@components/pagination/list_pagination';
import { ASSET_URL } from '@constants/index';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { PageMeta, Swap, Token } from '@interfaces/index';
import {
  formatDateAndTime,
  formatNumber,
  formatNumberExceptDecimal,
} from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import Link from 'next/link';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'text-center text-white px-2 py-4 text-xs font-medium whitespace-nowrap';

export default function SwapsTable({
  token,
  swaps,
  pageMeta,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
  showAccount = true,
  linkToChart = false,
}: {
  token: Token | string;
  swaps: Swap[];
  pageMeta: PageMeta | undefined;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  showAccount?: boolean;
  linkToChart?: boolean;
}) {
  const format = useFormatter();

  const tokenCell = (swapToken?: string) => {
    if (linkToChart) {
      return (
        <Link
          href={{
            pathname: '/charts',
            query: { token: swapToken },
          }}
        >
          <FallbackImage
            src={`${ASSET_URL}/${swapToken}.svg`}
            fallback={`${ASSET_URL}/${swapToken}.png`}
            alt={swapToken ?? ''}
            className="w-8 h-8 mr-3 inline-block"
          />
          <span className="text-left min-w-[50px] inline-block">
            {swapToken}
          </span>
        </Link>
      );
    }

    return (
      <>
        <FallbackImage
          src={`${ASSET_URL}/${swapToken}.svg`}
          fallback={`${ASSET_URL}/${swapToken}.png`}
          alt={swapToken ?? ''}
          className="w-8 h-8 mr-3 inline-block"
        />
        <span className="text-left min-w-[50px] inline-block">{swapToken}</span>
      </>
    );
  };

  return (
    <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
      <thead className="bg-white bg-opacity-10">
        <tr className="border-collapse border-4 border-backgroundHeader">
          <th className={tableHeadStyle}>Date</th>
          {typeof token !== 'string' && (
            <th className={tableHeadStyle}>Type</th>
          )}
          {showAccount && <th className={tableHeadStyle}>Account</th>}
          <th className={tableHeadStyle}>Sold Token</th>
          <th className={tableHeadStyle}>Bought Token</th>
          <th className={tableHeadStyle}>Sold Amount</th>
          <th className={tableHeadStyle}>Bought Amount</th>
        </tr>
      </thead>
      <tbody>
        {swaps.map((swap, index) => (
          <tr
            key={`${swap.accountId}${index}`}
            className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
          >
            <td className={classNames(cellStyle, 'min-w-[150px]')}>
              {formatDateAndTime(swap.swappedAt)}
            </td>
            {typeof token !== 'string' && (
              <td
                className={classNames(
                  cellStyle,
                  swap.type === 'Buy' ? '!text-green-400' : '!text-red-400'
                )}
              >
                {swap.type}
              </td>
            )}
            {showAccount && (
              <td className={cellStyle}>
                <Link href={`/portfolio/swaps?address=${swap.accountId}`}>
                  {swap.accountIdFormatted}
                </Link>
                <Clipboard text={swap.accountId}>
                  <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
                </Clipboard>
              </td>
            )}
            <td className={classNames(cellStyle, 'min-w-[150px]')}>
              {tokenCell(swap.inputAsset)}
            </td>
            <td className={classNames(cellStyle, 'min-w-[150px]')}>
              {tokenCell(swap.outputAsset)}
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
                {`Total swaps: ${formatNumber(format, pageMeta.totalCount, 0)}`}
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
  );
}
