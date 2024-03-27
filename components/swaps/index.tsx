import Spinner from '@components/spinner';
import useSwaps from '@hooks/use_swaps';
import { Token } from '@interfaces/index';
import SwapsTable from './swaps_table';
import SwapsFilters from './swaps_filters';

export default function Swaps({
  address,
  tokens,
  token,
}: {
  address: string;
  tokens: Token[];
  token: Token | string;
}) {
  const {
    swaps,
    pageMeta,
    stats,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    loading,
    pageLoading,
    filterSwaps,
  } = useSwaps(tokens, address);

  if (swaps === undefined) return <Spinner />;

  return (
    <div className="my-8">
      <SwapsFilters
        tokens={tokens}
        token={token}
        filterSwaps={filterSwaps}
        stats={stats}
      />
      <div className="max-w-full overflow-x-auto relative sm:px-8">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {swaps.length === 0 ? (
              <div className="flex">
                <span className="p-8 text-white font-medium">No swaps</span>
              </div>
            ) : (
              <>
                <SwapsTable
                  token={token}
                  swaps={swaps}
                  pageMeta={pageMeta}
                  goToFirstPage={goToFirstPage}
                  goToPreviousPage={goToPreviousPage}
                  goToNextPage={goToNextPage}
                  goToLastPage={goToLastPage}
                />
                {pageLoading && (
                  <div className="absolute inset-0 z-10 bg-black bg-opacity-20 flex items-center justify-center">
                    <Spinner />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
