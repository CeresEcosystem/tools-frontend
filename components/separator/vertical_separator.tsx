import classNames from 'classnames';

export default function VerticalSeparator({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={classNames(
        'border-l-2 h-18 border-white border-opacity-10 mx-3',
        className
      )}
    />
  );
}
