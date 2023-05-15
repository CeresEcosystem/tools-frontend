import { Block } from '@interfaces/index';
import { useRef, useState } from 'react';
import usePagination from '@hooks/use_pagination';

const limiter = 6;

const useGross = (blocks?: Block[]) => {
  const allBlocks = useRef(blocks ?? []);

  const [blocksSlice, setBlocksSlice] = useState(
    allBlocks.current.slice(0, limiter) ?? []
  );

  const currentPage = useRef(0);
  const totalPages = useRef(Math.ceil(allBlocks.current.length / limiter));

  const { goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage } =
    usePagination<Block>(
      currentPage.current,
      totalPages.current,
      allBlocks.current,
      (cp: number) => (currentPage.current = cp),
      (array: Array<Block>) => setBlocksSlice(array),
      limiter
    );

  return {
    blocksSlice,
    totalPages: totalPages.current,
    currentPage: currentPage.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default useGross;
