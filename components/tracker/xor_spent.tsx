import { Block } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import TimeTab from '@components/tracker/time_tab';
import useXORSpent from '@hooks/use_xor_spent';
import ListPagination from '@components/pagination/list_pagination';
import { VAL_LATEST_BLOCK } from '@constants/index';

function XorSpentData({
  blocks,
  last,
  selectedToken,
}: {
  blocks?: Block[];
  last?: number;
  selectedToken: string;
}) {
  const {
    blocksSlice,
    totalPages,
    currentPage,
    selectedTimeFrame,
    setSelectedTimeFrame,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  } = useXORSpent(blocks, last);

  const format = useFormatter();

  if (blocks) {
    return (
      <div className="flex flex-col space-y-4">
        <TimeTab
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
          label={`XOR ${selectedToken === 'PSWAP' ? 'spent' : 'fees'}`}
        />
        <table>
          <tbody>
            {blocksSlice.map((block) => (
              <tr key={block.blockNum}>
                <td className="text-white text-sm p-2">{`${
                  selectedToken === 'VAL' && block.blockNum === VAL_LATEST_BLOCK
                    ? 'until'
                    : 'block'
                } #${formatNumber(format, block.blockNum, 0)}`}</td>
                <td className="text-right text-white text-sm p-2">{`${formatNumber(
                  format,
                  block.xorSpent,
                  4
                )} XOR`}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default function XorSpent({
  blocks,
  last,
  selectedToken,
}: {
  blocks?: Block[];
  last?: number;
  selectedToken: string;
}) {
  return (
    <div className="px-4 py-8 rounded-xl w-full bg-backgroundItem">
      <XorSpentData blocks={blocks} last={last} selectedToken={selectedToken} />
    </div>
  );
}
