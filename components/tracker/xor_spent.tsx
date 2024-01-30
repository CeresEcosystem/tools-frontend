import { BlockData } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import useXORSpent from '@hooks/use_xor_spent';
import ListPagination from '@components/pagination/list_pagination';
import Spinner from '@components/spinner';

export default function XorSpent({
  blocksFees,
  blocksTbc,
  selectedToken,
}: {
  blocksFees?: BlockData;
  blocksTbc?: BlockData;
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
  } = useXORSpent(selectedToken, blocksFees, blocksTbc);

  const format = useFormatter();

  return (
    <div className="px-4 py-8 rounded-xl w-full bg-backgroundItem relative">
      <div className="flex flex-col space-y-4">
        <span className="text-white px-2 text-opacity-50 text-base">
          {selectedToken === 'PSWAP' ? 'XOR spent' : 'TBC burns'}
        </span>
        <table>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.blockNum}>
                <td className="text-white text-sm p-2">{`block #${formatNumber(
                  format,
                  block.blockNum,
                  0
                )}`}</td>
                <td className="text-right text-white text-sm p-2">
                  {selectedToken === 'VAL'
                    ? `${formatNumber(format, block.grossBurn, 4)} VAL`
                    : `${formatNumber(format, block.xorSpent, 4)} XOR`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
