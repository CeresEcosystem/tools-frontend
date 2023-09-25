import classNames from 'classnames';
import { StarIcon } from '@heroicons/react/24/solid';
import { ASSET_URL } from '@constants/index';

export default function TokensFavoriteFilter({
  showOnlyFavorites,
  toggleFavorites,
  syntheticsFilter,
  handleSyntheticsFilter,
}: {
  showOnlyFavorites: boolean;
  // eslint-disable-next-line no-unused-vars
  toggleFavorites: (favorites: boolean) => void;
  syntheticsFilter: boolean;
  handleSyntheticsFilter: () => void;
}) {
  return (
    <div className="flex flex-wrap mt-2">
      <div
        onClick={() => toggleFavorites(false)}
        className={classNames(
          'bg-backgroundHeader mx-1 mt-2 px-4 py-1 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-2',
          !showOnlyFavorites ? 'opacity-100' : 'opacity-50',
          'hover:opacity-100'
        )}
      >
        <span className="text-sm text-white font-medium md:text-base">All</span>
      </div>
      <div
        onClick={() => toggleFavorites(true)}
        className={classNames(
          'bg-backgroundHeader mx-1 mt-2 px-4 py-1 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-2',
          showOnlyFavorites ? 'opacity-100' : 'opacity-50',
          'hover:opacity-100'
        )}
      >
        <StarIcon className="h-6 w-6 rounded-full text-white" />
        <span className="hidden sm:block text-sm text-white font-medium md:text-base">
          Favorites
        </span>
      </div>
      <div
        onClick={() => handleSyntheticsFilter()}
        className={classNames(
          'bg-backgroundHeader mx-1 mt-2 px-4 py-1 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-2',
          syntheticsFilter ? 'opacity-100' : 'opacity-50',
          'hover:opacity-100'
        )}
      >
        <img
          src={`${ASSET_URL}/XST.svg`}
          alt="XST"
          className="h-8 w-8 rounded-full"
        />
        <span className="hidden sm:block text-sm text-white font-medium md:text-base">
          Synthetics
        </span>
      </div>
    </div>
  );
}
