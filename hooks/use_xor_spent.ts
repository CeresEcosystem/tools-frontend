import { NEW_API_URL } from '@constants/index';
import { Block, BlockData, PageMeta } from '@interfaces/index';
import { useCallback, useRef, useState } from 'react';

const useXORSpent = (
  selectedToken: string,
  blocksFees?: BlockData,
  blocksTbc?: BlockData
) => {
  const [loading, setLoading] = useState(false);

  const blocks = useRef<Block[]>(
    selectedToken === 'PSWAP' ? blocksFees?.data ?? [] : blocksTbc?.data ?? []
  );
  const pageMeta = useRef<PageMeta | undefined>(
    selectedToken === 'PSWAP' ? blocksFees?.meta : blocksTbc?.meta
  );

  const fetchBlocks = useCallback(
    async (page: number) => {
      const type = selectedToken === 'PSWAP' ? 'FEES' : 'TBC';

      await fetch(
        `${NEW_API_URL}/tracker/${selectedToken}/blocks/${type}?page=${page}&size=5`
      )
        .then(async (response) => {
          if (response.ok) {
            const responseJson = (await response.json()) as BlockData;

            blocks.current = responseJson.data;
            pageMeta.current = responseJson.meta;
            setLoading(false);
          }
        })
        .catch(() => {
          blocks.current = [];
          setLoading(false);
        });
    },
    [selectedToken]
  );

  const goToFirstPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setLoading(true);
      fetchBlocks(1);
    }
  }, [fetchBlocks]);

  const goToPreviousPage = useCallback(() => {
    if (pageMeta.current?.hasPreviousPage) {
      setLoading(true);
      fetchBlocks(pageMeta.current.pageNumber - 1);
    }
  }, [fetchBlocks]);

  const goToNextPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setLoading(true);
      fetchBlocks(pageMeta.current.pageNumber + 1);
    }
  }, [fetchBlocks]);

  const goToLastPage = useCallback(() => {
    if (pageMeta.current?.hasNextPage) {
      setLoading(true);
      fetchBlocks(pageMeta.current.pageCount);
    }
  }, [fetchBlocks]);

  return {
    loading,
    blocks: blocks.current,
    pageMeta: pageMeta.current,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  };
};

export default useXORSpent;
