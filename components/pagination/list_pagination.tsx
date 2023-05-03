import classNames from 'classnames';

const buttonStyle =
  'h-9 w-9 rounded-lg bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20';
const iconStyle = 'text-lg mt-1.5 text-white';

export default function ListPagination({
  currentPage,
  totalPages,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: {
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}) {
  return (
    <div className="flex gap-x-3 justify-center mt-8">
      <button onClick={() => goToFirstPage()} className={buttonStyle}>
        <i className={classNames(iconStyle, 'flaticon-left-arrow-1')}></i>
      </button>
      <button onClick={() => goToPreviousPage()} className={buttonStyle}>
        <i className={classNames(iconStyle, 'flaticon-left-arrow')}></i>
      </button>
      <div className="h-9 px-4 bg-pink rounded-lg flex items-center">
        <span className="text-white text-base">{`${
          currentPage + 1
        } / ${totalPages}`}</span>
      </div>
      <button onClick={() => goToNextPage()} className={buttonStyle}>
        <i className={classNames(iconStyle, 'flaticon-right-arrow-1')}></i>
      </button>
      <button onClick={() => goToLastPage()} className={buttonStyle}>
        <i className={classNames(iconStyle, 'flaticon-right-arrow')}></i>
      </button>
    </div>
  );
}
