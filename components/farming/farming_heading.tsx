import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';

export default function FarmingHeading({
  title,
  link,
  linkText,
  topMargin = false,
}: {
  title: string;
  link: string;
  linkText: string;
  topMargin?: boolean;
}) {
  return (
    <div
      className={classNames(
        'flex justify-between pb-2 mb-8 items-center border-b-2 border-white border-opacity-10',
        topMargin && 'mt-16'
      )}
    >
      <h1 className="text-3xl text-white font-bold">{title}</h1>
      <Link href={link} target="_blank" className="group">
        <ArrowTopRightOnSquareIcon
          aria-hidden="true"
          className="h-6 w-6 sm:hidden text-white"
        />
        <span className="hidden text-white text-opacity-50 text-base sm:block group-hover:text-opacity-100">
          {linkText}
        </span>
      </Link>
    </div>
  );
}
