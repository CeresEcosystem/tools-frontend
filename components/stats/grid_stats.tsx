import classNames from 'classnames';

const labelStyle =
  'text-sm text-white text-opacity-50 text-center tracking-wide sm:text-lg lg:leading-10 lg:text-xl';
const numberStyle =
  'text-xl text-white text-center font-bold tracking-wide sm:text-2xl lg:text-3xl';

export default function GridStats({
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
  smallInfo = false,
}: {
  firstLabel: string;
  firstValue: string;
  secondLabel: string;
  secondValue: string;
  smallInfo?: boolean;
}) {
  return (
    <div className="grid mb-8 gap-4 xxs:grid-cols-2 md:gap-x-8">
      <div className="flex-col bg-backgroundItem px-3 py-8 rounded-xl flex justify-center items-center">
        <span className={labelStyle}>{firstLabel}</span>
        <h1
          className={classNames(
            numberStyle,
            smallInfo && 'text-xs xs:text-lg sm:text-2xl lg:text-3xl'
          )}
        >
          {firstValue}
        </h1>
      </div>
      <div className="flex-col bg-backgroundItem px-3 py-8 rounded-xl flex justify-center items-center">
        <span className={labelStyle}>{secondLabel}</span>
        <h1
          className={classNames(
            numberStyle,
            smallInfo && 'text-xs xs:text-lg sm:text-2xl lg:text-3xl'
          )}
        >
          {secondValue}
        </h1>
      </div>
    </div>
  );
}
