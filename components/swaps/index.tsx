import Spinner from '@components/spinner';
import useSwaps from '@hooks/use_swaps';
import { Token } from '@interfaces/index';
import SwapsTable from './swaps_table';

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
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    pageLoading,
  } = useSwaps(tokens, address);

  if (swaps === undefined) return <Spinner />;

  if (swaps.length === 0)
    return (
      <span className="p-8 text-white font-medium">
        No swaps for selected token
      </span>
    );

  return (
    <div className="max-w-full overflow-x-auto relative my-8 sm:px-8">
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
    </div>
  );
}
