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
  small = false,
}: {
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  small?: boolean;
}) {
  return (
    <div className={'flex space-x-2 justify-center mt-8'}>
      <button
        onClick={() => goToFirstPage()}
        className={classNames(buttonStyle, small && 'h-6 w-6')}
      >
        <i
          className={classNames(
            iconStyle,
            'flaticon-left-arrow-1',
            small && 'text-sm'
          )}
        ></i>
      </button>
      <button
        onClick={() => goToPreviousPage()}
        className={classNames(buttonStyle, small && 'h-6 w-6')}
      >
        <i
          className={classNames(
            iconStyle,
            'flaticon-left-arrow',
            small && 'text-sm'
          )}
        ></i>
      </button>
      <div
        className={classNames(
          'h-9 px-4 bg-pink rounded-lg flex items-center',
          small && 'h-6'
        )}
      >
        <span
          className={classNames('text-white text-base', small && 'text-sm')}
        >{`${currentPage + 1} / ${totalPages}`}</span>
      </div>
      <button
        onClick={() => goToNextPage()}
        className={classNames(buttonStyle, small && 'h-6 w-6')}
      >
        <i
          className={classNames(
            iconStyle,
            'flaticon-right-arrow-1',
            small && 'text-sm'
          )}
        ></i>
      </button>
      <button
        onClick={() => goToLastPage()}
        className={classNames(buttonStyle, small && 'h-6 w-6')}
      >
        <i
          className={classNames(
            iconStyle,
            'flaticon-right-arrow',
            small && 'text-sm'
          )}
        ></i>
      </button>
    </div>
  );
}
