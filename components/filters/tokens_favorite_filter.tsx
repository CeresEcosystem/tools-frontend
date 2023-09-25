import classNames from 'classnames';
import { StarIcon } from '@heroicons/react/24/solid';
import { ASSET_URL } from '@constants/index';

export default function TokensFavoriteFilter({
  filters,
  filter,
  toggleFilter,
}: {
  filters: string[];
  filter: string;
  // eslint-disable-next-line no-unused-vars
  toggleFilter: (filter: string) => void;
}) {
  return (
    <div className="flex flex-wrap mt-2">
      {filters.map((tokenFilter) => (
        <div
          key={tokenFilter}
          onClick={() => toggleFilter(tokenFilter)}
          className={classNames(
            'bg-backgroundHeader mx-1 mt-2 px-4 py-2 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-1',
            tokenFilter === filter ? 'opacity-100' : 'opacity-50',
            'hover:opacity-100'
          )}
        >
          {tokenFilter === 'Favorites' ? (
            <StarIcon className="h-6 w-6 rounded-full text-white" />
          ) : tokenFilter === 'Synthetics' ? (
            <img
              src={`${ASSET_URL}/XST.svg`}
              alt="XST"
              className="h-6 w-6 rounded-full"
            />
          ) : null}

          <span className="text-sm text-white font-medium md:text-base">
            {tokenFilter}
          </span>
        </div>
      ))}
    </div>
  );
}
