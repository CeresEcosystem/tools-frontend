const labelStyle =
  'text-sm text-white text-opacity-50 text-center tracking-wide sm:text-lg lg:leading-10 lg:text-xl';
const numberStyle =
  'text-xl text-white text-center font-bold tracking-wide sm:text-2xl lg:text-3xl';

export default function PairsStats({
  totalLiquidity,
  totalVolume,
}: {
  totalLiquidity: string;
  totalVolume: string;
}) {
  return (
    <div className="grid mb-8 gap-4 xxs:grid-cols-2 md:gap-x-8">
      <div className="flex-col bg-backgroundHeader bg-opacity-20 px-3 py-8 rounded-xl flex justify-center items-center">
        <span className={labelStyle}>Total liquidity</span>
        <h1 className={numberStyle}>{totalLiquidity}</h1>
      </div>
      <div className="flex-col bg-backgroundHeader bg-opacity-20 px-3 py-8 rounded-xl flex justify-center items-center">
        <span className={labelStyle}>Total volume</span>
        <h1 className={numberStyle}>{totalVolume}</h1>
      </div>
    </div>
  );
}
