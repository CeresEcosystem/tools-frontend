/* eslint-disable no-unused-vars */

const usePagination = <T>(
  currentPage: number,
  totalPages: number,
  array: Array<T>,
  setCurrentPage: (currentPage: number) => void,
  setArraySlice: (array: Array<T>) => void,
  limiter: number,
) => {
  const goToFirstPage = () => {
    if (currentPage > 0) {
      setCurrentPage(0);
      setArraySlice(array.slice(0, limiter));
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      setArraySlice(
        array.slice(previousPage * limiter, (previousPage + 1) * limiter)
      );
    }
  };

  const goToNextPage = () => {
    const nextLimit = (currentPage + 1) * limiter;

    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
      setArraySlice(array.slice(nextLimit, nextLimit + limiter));
    }
  };

  const goToLastPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(totalPages - 1);
      setArraySlice(array.slice((totalPages - 1) * limiter, array.length));
    }
  };

  return { goToFirstPage, goToPreviousPage, goToNextPage, goToLastPage };
};

export default usePagination;
