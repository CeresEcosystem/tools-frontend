import classNames from 'classnames';
import { StarIcon } from '@heroicons/react/24/solid';

export default function TokensFavoriteFilter({
  showOnlyFavorites,
  toggleFavorites,
}: {
  showOnlyFavorites: boolean;
  // eslint-disable-next-line no-unused-vars
  toggleFavorites: (favorites: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap mt-2">
      <div
        onClick={() => toggleFavorites(false)}
        className={classNames(
          'bg-backgroundHeader mx-1 mt-2 px-4 py-2 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-2',
          !showOnlyFavorites ? 'opacity-100' : 'opacity-50',
          'hover:opacity-100'
        )}
      >
        <span className="text-sm text-white font-medium md:text-base">All</span>
      </div>
      <div
        onClick={() => toggleFavorites(true)}
        className={classNames(
          'bg-backgroundHeader mx-1 mt-2 px-4 py-2 rounded-3xl text-center cursor-pointer flex items-center justify-center space-x-2',
          showOnlyFavorites ? 'opacity-100' : 'opacity-50',
          'hover:opacity-100'
        )}
      >
        <StarIcon className="h-6 w-6 rounded-full text-white" />
        <span className="hidden sm:block text-sm text-white font-medium md:text-base">
          Show only favorites
        </span>
      </div>
    </div>
  );
}
