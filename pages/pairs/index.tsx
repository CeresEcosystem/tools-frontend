import Container from '@components/container';
import PairsFilter from '@components/filters/pairs_filter';
import Input from '@components/input';
import PairsList from '@components/list/pairs_list';
import PairsModal from '@components/modal/pairs_modal';
import ListPagination from '@components/pagination/list_pagination';
import PairsStats from '@components/stats/pairs_stats';
import { NEW_API_URL } from '@constants/index';
import useLocks from '@hooks/use_locks';
import usePairs from '@hooks/use_pairs';
import { Pair, ModalPairs } from '@interfaces/index';
import { scrollToTop } from '@utils/helpers';
import { useEffect, useState } from 'react';

export default function Pairs({ data }: { data?: Pair[] }) {
  const {
    pairs,
    totalPages,
    currentPage,
    totalLiquidity,
    totalVolume,
    baseAssets,
    selectedBaseAsset,
    handleBaseAssetChange,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    handlePairSearch,
    syntheticsFilter,
    handleSyntheticsFilter,
  } = usePairs(data);

  const { getLocks } = useLocks();

  const [showLocks, setShowLocks] = useState<ModalPairs>({
    show: false,
    item: null,
    locks: [],
  });

  useEffect(() => {
    scrollToTop();
  }, [pairs]);

  const fetchData = async (show: boolean, pair: Pair) => {
    const response = await getLocks(pair.baseAsset, pair.token);
    setShowLocks({
      show,
      item: pair,
      locks: response,
    });
  };

  return (
    <Container>
      <PairsStats totalLiquidity={totalLiquidity} totalVolume={totalVolume} />
      <Input handleChange={handlePairSearch} />
      <PairsFilter
        baseAssets={baseAssets}
        selectedBaseAsset={selectedBaseAsset}
        handleBaseAssetChange={handleBaseAssetChange}
        syntheticsFilter={syntheticsFilter}
        handleSyntheticsFilter={handleSyntheticsFilter}
      />
      <PairsList
        pairs={pairs}
        showModal={(show: boolean, pair: Pair) => fetchData(show, pair)}
      />
      {totalPages > 1 && (
        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToFirstPage={goToFirstPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToLastPage={goToLastPage}
        />
      )}
      <PairsModal
        showModal={showLocks.show}
        closeModal={() =>
          setShowLocks((oldState) => ({
            ...oldState,
            show: false,
          }))
        }
        pair={showLocks.item}
        locks={showLocks.locks}
      />
    </Container>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${NEW_API_URL}/pairs`);
  let data;

  if (res.ok) {
    data = (await res.json()) as Pair[];
  }

  return { props: { data } };
}
