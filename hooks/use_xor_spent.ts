import { Block } from '@interfaces/index';
import { useRef, useState } from 'react';
import usePagination from '@hooks/use_pagination';
import { getBlockLimiter } from '@utils/helpers';

const limiter = 5;

const useXORSpent = (
  selectedToken: string,
  blocks?: Block[],
  last?: number
) => {
  const allBlocks = useRef(
    blocks
      ? selectedToken === 'VAL'
        ? blocks.filter((block) => block.burnType === 'TBC')
        : blocks
      : []
  );
  const selectedTimeFrame = useRef('24');

  const getBlocksFiltered = () => {
    const blockLimiter = getBlockLimiter(selectedTimeFrame.current, last);

    if (blockLimiter !== -1) {
      return allBlocks.current.filter(
        (block) => block.blockNum >= blockLimiter
      );
    }

    return allBlocks.current;
  };

  const blocksTimeFiltered = useRef(getBlocksFiltered());

  const [blocksSlice, setBlocksSlice] = useState(
    blocksTimeFiltered.current.slice(0, limiter) ?? []
  );

  const currentPage = useRef(0);
  const totalPages = useRef(
    Math.ceil(blocksTimeFiltered.current.length / limiter)
  );

  const { goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage } =
    usePagination<Block>(
      currentPage.current,
      totalPages.current,
      blocksTimeFiltered.current,
      (cp: number) => (currentPage.current = cp),
      (array: Array<Block>) => setBlocksSlice(array),
      limiter
    );

  const setSelectedTimeFrame = (time: string) => {
    selectedTimeFrame.current = time;
    blocksTimeFiltered.current = getBlocksFiltered();
    currentPage.current = 0;
    totalPages.current = Math.ceil(blocksTimeFiltered.current.length / limiter);
    setBlocksSlice(blocksTimeFiltered.current.slice(0, limiter));
  };

  return {
    blocksSlice,
    totalPages: totalPages.current,
    currentPage: currentPage.current,
    selectedTimeFrame: selectedTimeFrame.current,
    setSelectedTimeFrame,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default useXORSpent;
