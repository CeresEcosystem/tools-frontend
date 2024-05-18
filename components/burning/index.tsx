import Spinner from '@components/spinner';
// import KensetsuFilters from './filters';
import KensetsuTable from './table';
import useBurning from '@hooks/use_burning';
import BurningFilters from './filters';

export default function Burning({
  tokenFullName,
  tokenShortName,
}: {
  tokenFullName: string;
  tokenShortName: string;
}) {
  const {
    burns,
    pageMeta,
    summary,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    loading,
    pageLoading,
    filterBurningData,
  } = useBurning(tokenFullName);

  return (
    <>
      <BurningFilters
        filterBurns={filterBurningData}
        summary={summary}
        tokenFullName={tokenFullName}
        tokenShortName={tokenShortName}
      />
      <div className="max-w-full overflow-x-auto relative">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {burns.length === 0 ? (
              <div className="flex">
                <span className="text-white font-medium">No data</span>
              </div>
            ) : (
              <>
                <KensetsuTable
                  burns={burns}
                  pageMeta={pageMeta}
                  goToFirstPage={goToFirstPage}
                  goToPreviousPage={goToPreviousPage}
                  goToNextPage={goToNextPage}
                  goToLastPage={goToLastPage}
                  tokenShortName={tokenShortName}
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
    </>
  );
}
