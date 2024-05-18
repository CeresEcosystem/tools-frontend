import { FireIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import Link from 'next/link';

export default function BurningInfo({
  description,
  link,
  bottomSpace = true,
}: {
  description: string;
  link: string;
  bottomSpace?: boolean;
}) {
  return (
    <div
      className={classNames(
        'bg-backgroundSidebar p-4 rounded-xl flex items-center gap-x-3',
        bottomSpace ? 'mb-16' : 'mb-4'
      )}
    >
      <FireIcon
        aria-hidden="true"
        className="h-12 w-12 text-yellow flex-shrink-0"
      />
      <span className="text-white font-medium text-xs sm:text-sm">
        {`${description} Click `}
        <Link href={link} className="text-pink">
          here
        </Link>{' '}
        to track XOR burning.
      </span>
    </div>
  );
}
