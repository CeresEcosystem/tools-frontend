import Clipboard from '@components/clipboard';
import ListPagination from '@components/pagination/list_pagination';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { BurningData, PageMeta } from '@interfaces/index';
import {
  formatDateAndTime,
  formatNumber,
  formatNumberExceptDecimal,
} from '@utils/helpers';
import { useFormatter } from 'next-intl';
import Link from 'next/link';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'text-center text-white px-2 py-4 text-xs font-medium whitespace-nowrap';

export default function BurningTable({
  burns,
  pageMeta,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
  tokenShortName,
}: {
  burns: BurningData[];
  pageMeta: PageMeta | undefined;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  tokenShortName: string;
}) {
  const format = useFormatter();

  return (
    <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
      <thead className="bg-white bg-opacity-10">
        <tr className="border-collapse border-4 border-backgroundHeader">
          <th className={tableHeadStyle}>Date</th>
          <th className={tableHeadStyle}>Account</th>
          <th className={tableHeadStyle}>Burned XOR</th>
          <th className={tableHeadStyle}>{`${tokenShortName} Allocated`}</th>
        </tr>
      </thead>
      <tbody>
        {burns.map((burn, index) => (
          <tr
            key={`${burn.accountId + index}`}
            className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
          >
            <td className={cellStyle}>{formatDateAndTime(burn.createdAt)}</td>
            <td className={cellStyle}>
              <Link href={`/portfolio?address=${burn.accountId}`}>
                {burn.accountIdFormatted}
              </Link>
              <Clipboard text={burn.accountId}>
                <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
              </Clipboard>
            </td>
            <td className={cellStyle}>
              {formatNumberExceptDecimal(format, burn.amountBurned)}
            </td>
            <td className={cellStyle}>
              {formatNumberExceptDecimal(format, burn.tokenAllocated)}
            </td>
          </tr>
        ))}
      </tbody>
      {pageMeta && pageMeta.pageCount > 1 && (
        <tfoot className="bg-backgroundHeader border-t-backgroundHeader">
          <tr>
            <td colSpan={2}>
              <span className="px-4 text-white font-medium">
                {`Total burns: ${formatNumber(format, pageMeta.totalCount, 0)}`}
              </span>
            </td>
            <td colSpan={3} className="py-2.5 px-4">
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
