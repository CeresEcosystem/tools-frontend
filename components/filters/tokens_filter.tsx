import classNames from 'classnames';
import { StarIcon } from '@heroicons/react/24/solid';
import { ASSET_URL, XOR } from '@constants/index';

export default function TokensFilter({
  filters,
  filter,
  priceFilter,
  toggleFilter,
  togglePriceFilter,
}: {
  filters: string[];
  filter: string;
  priceFilter: string;
  // eslint-disable-next-line no-unused-vars
  toggleFilter: (filter: string) => void;
  // eslint-disable-next-line no-unused-vars
  togglePriceFilter: (priceFilter: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center mt-2 justify-between">
      <div className="flex">
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
      <div className="flex gap-x-1">
        <div
          onClick={() => togglePriceFilter('$')}
          className={classNames(
            'bg-backgroundHeader mt-2 w-10 rounded-full text-center cursor-pointer flex items-center justify-center space-x-1',
            priceFilter === '$' ? 'opacity-100' : 'opacity-50',
            'hover:opacity-100'
          )}
        >
          <span className="text-sm text-white font-medium md:text-base">$</span>
        </div>
        <div
          onClick={() => togglePriceFilter(XOR)}
          className={classNames(
            'bg-backgroundHeader mt-2 py-2 w-10 rounded-full text-center cursor-pointer flex items-center justify-center space-x-1',
            priceFilter === XOR ? 'opacity-100' : 'opacity-50',
            'hover:opacity-100'
          )}
        >
          <img
            src={`${ASSET_URL}/${XOR}.svg`}
            alt={XOR}
            className="h-6 w-6 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
