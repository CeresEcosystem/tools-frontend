import Spinner from '@components/spinner';
import useKensetsuBurn from '@hooks/use_kensetsu_burn';
import KensetsuFilters from './filters';
import KensetsuTable from './table';

export default function Kensetsu() {
  const {
    kensetsuBurns,
    pageMeta,
    summary,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    loading,
    pageLoading,
    filterKensetsuBurns,
  } = useKensetsuBurn();

  return (
    <>
      <KensetsuFilters
        filterKensetsuBurns={filterKensetsuBurns}
        summary={summary}
      />
      <div className="max-w-full overflow-x-auto relative">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {kensetsuBurns.length === 0 ? (
              <div className="flex">
                <span className="text-white font-medium">No data</span>
              </div>
            ) : (
              <>
                <KensetsuTable
                  kensetsuBurns={kensetsuBurns}
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
    </>
  );
}
