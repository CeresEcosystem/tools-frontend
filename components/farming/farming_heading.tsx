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
      <Link href={link} target="_blank">
        <span className="text-white text-opacity-50 text-base">{linkText}</span>
      </Link>
    </div>
  );
}
