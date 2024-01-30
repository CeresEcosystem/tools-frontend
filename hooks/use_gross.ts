import { Block, BlockData, PageMeta } from '@interfaces/index';
import { useCallback, useRef, useState } from 'react';
import { NEW_API_URL } from '@constants/index';

const useGross = (selectedToken: string, blocksFees?: BlockData) => {
  const [loading, setLoading] = useState(false);

  const blocks = useRef<Block[]>(blocksFees?.data ?? []);
  const pageMeta = useRef<PageMeta | undefined>(blocksFees?.meta);

  const fetchBlocks = useCallback(
    async (page: number) => {
      await fetch(
        `${NEW_API_URL}/tracker/${selectedToken}/blocks/FEES?page=${page}&size=5`
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

export default useGross;
