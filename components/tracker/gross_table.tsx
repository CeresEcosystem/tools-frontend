import { BlockData } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import ListPagination from '@components/pagination/list_pagination';
import useGross from '@hooks/use_gross';
import { VAL_LATEST_BLOCK } from '@constants/index';
import Spinner from '@components/spinner';

const tableHeadStyle =
  'text-white p-2 text-left text-opacity-50 text-sm font-medium text-center';

const tableRowStyle = 'text-white text-sm p-2 text-center';

export default function GrossTable({
  blocksFees,
  selectedToken,
}: {
  blocksFees?: BlockData;
  selectedToken: string;
}) {
  const {
    loading,
    blocks,
    pageMeta,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  } = useGross(selectedToken, blocksFees);

  const format = useFormatter();

  return (
    <div className="relative px-4 py-8 max-w-full rounded-xl bg-backgroundItem md:col-span-2">
      <div className="flex flex-col space-y-4 overflow-x-hidden">
        <h1 className="text-white px-2 text-base">Burns by fees</h1>
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-[700px] w-full">
            <thead>
              <tr>
                <th className={tableHeadStyle}>Latest Blocks</th>
                {selectedToken === 'VAL' && (
                  <th className={tableHeadStyle}>XOR for buyback</th>
                )}
                <th className={tableHeadStyle}>Gross burn</th>
                {selectedToken === 'PSWAP' && (
                  <th className={tableHeadStyle}>Reminted for LP</th>
                )}
                <th className={tableHeadStyle}>Reminted for Parliament</th>
                <th className={tableHeadStyle}>Net burn</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.blockNum}>
                  <td className={tableRowStyle}>{`${
                    selectedToken === 'VAL' &&
                    block.blockNum === VAL_LATEST_BLOCK
                      ? 'until'
                      : 'block'
                  } #${formatNumber(format, block.blockNum, 0)}`}</td>
                  {selectedToken === 'VAL' && (
                    <td className={tableRowStyle}>
                      {formatNumber(format, block.xorDedicatedForBuyBack, 3)}
                    </td>
                  )}
                  <td className={tableRowStyle}>
                    {formatNumber(format, block.grossBurn, 3)}
                  </td>
                  {selectedToken === 'PSWAP' && (
                    <td className={tableRowStyle}>
                      {formatNumber(format, block.remintedLp, 3)}
                    </td>
                  )}
                  <td className={tableRowStyle}>
                    {formatNumber(format, block.remintedParliament, 3)}
                  </td>
                  <td className={tableRowStyle}>
                    {formatNumber(format, block.netBurn, 3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageMeta && pageMeta.pageCount > 1 && (
          <ListPagination
            currentPage={pageMeta.pageNumber - 1}
            totalPages={pageMeta.pageCount}
            goToFirstPage={goToFirstPage}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            goToLastPage={goToLastPage}
            small
          />
        )}
      </div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-20">
          <Spinner />
        </div>
      )}
    </div>
  );
}
