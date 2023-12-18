import classNames from 'classnames';

export default function Title({
  title,
  subtitle,
  topMargin = false,
  titleStyle,
}: {
  title: string;
  subtitle?: string;
  topMargin?: boolean;
  titleStyle?: string;
}) {
  return (
    <div className={`${topMargin && 'mt-24'}`}>
      <h2
        className={classNames(
          'text-3xl text-white font-bold text-center',
          titleStyle
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-center mt-1 text-white text-opacity-50 text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
