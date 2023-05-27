import { Block } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import ListPagination from '@components/pagination/list_pagination';
import useGross from '@hooks/use_gross';

const tableHeadStyle =
  'text-white p-2 text-left text-opacity-50 text-sm font-medium';

const tableRowStyle = 'text-white text-sm p-2';

function GrossTableData({ blocks }: { blocks?: Block[] }) {
  const {
    blocksSlice,
    totalPages,
    currentPage,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  } = useGross(blocks);

  const format = useFormatter();

  if (blocks) {
    return (
      <div className="flex flex-col space-y-4 overflow-x-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-[700px] w-full">
            <thead>
              <tr>
                <th className={tableHeadStyle}>Latest Blocks</th>
                <th className={tableHeadStyle}>Gross burn</th>
                <th className={tableHeadStyle}>Reminted for LP</th>
                <th className={tableHeadStyle}>Reminted for Parliament</th>
                <th className={tableHeadStyle}>Net burn</th>
              </tr>
            </thead>
            <tbody>
              {blocksSlice.map((block) => (
                <tr key={block.blockNum}>
                  <td className={tableRowStyle}>{`block #${formatNumber(
                    format,
                    block.blockNum,
                    0
                  )}`}</td>
                  <td className={tableRowStyle}>
                    {formatNumber(format, block.pswapGrossBurn, 3)}
                  </td>
                  <td className={tableRowStyle}>
                    {formatNumber(format, block.pswapRemintedLp, 3)}
                  </td>
                  <td className={tableRowStyle}>
                    {formatNumber(format, block.pswapRemintedParliament, 3)}
                  </td>
                  <td className={tableRowStyle}>
                    {formatNumber(format, block.pswapNetBurn, 3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToFirstPage={goToFirstPage}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            goToLastPage={goToLastPage}
            small
          />
        )}
      </div>
    );
  }

  return <span className="text-white font-medium">No data</span>;
}

export default function GrossTable({ blocks }: { blocks?: Block[] }) {
  return (
    <div className="px-4 py-8 max-w-full rounded-xl bg-backgroundItem md:col-span-2">
      <GrossTableData blocks={blocks} />
    </div>
  );
}
