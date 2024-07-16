import FallbackImage from '@components/image/fallback_image';
import Spinner from '@components/spinner';
import { ASSET_URL } from '@constants/index';
import useKensetsuPortfolio from '@hooks/use_kensetsu_portfolio';
import { WalletAddress } from '@interfaces/index';
import { formatNumber, formatNumberExceptDecimal } from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'text-center text-white p-4 text-xs font-medium whitespace-nowrap';
const priceCellStyle = 'text-center text-white text-sm font-medium';

const PriceCell = ({
  info,
  priceValue,
}: {
  info: string;
  priceValue: string;
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <span className={priceCellStyle}>{info}</span>
      <span className={classNames(priceCellStyle, 'text-xs')}>
        {priceValue}
      </span>
    </div>
  );
};

export default function KensetsuPortfolio({
  selectedWallet,
}: {
  selectedWallet: WalletAddress;
}) {
  const format = useFormatter();

  const { loading, data } = useKensetsuPortfolio(selectedWallet);

  if (loading) {
    return <Spinner />;
  }

  if (data.length === 0) {
    return (
      <span className="font-medium block text-opacity-50 mx-auto w-fit text-lg text-white">
        {`No items in Kensetsu.`}
      </span>
    );
  }

  return (
    <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
      <thead className="bg-white bg-opacity-10">
        <tr className="border-collapse border-4 border-backgroundHeader">
          <th className={classNames(tableHeadStyle, 'text-start')}>
            Debt/Collateral
          </th>
          <th className={tableHeadStyle}>Interest</th>
          <th className={tableHeadStyle}>Collateral Amount</th>
          <th className={tableHeadStyle}>Debt Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((kp, index) => (
          <tr
            key={`${kp.collateralAssetId}${kp.stablecoinAssetId}${index}`}
            className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
          >
            <td className={classNames(cellStyle, 'text-start')}>
              <div className="flex items-center">
                <div className="mr-2 inline-flex sm:mr-4">
                  <FallbackImage
                    src={`${ASSET_URL}/${kp.stablecoinToken?.token}.svg`}
                    fallback={`${ASSET_URL}/${kp.stablecoinToken?.token}.png`}
                    alt={kp.stablecoinToken?.token ?? ''}
                    className="rounded-full w-8 h-8 -mr-4 z-10"
                  />
                  <FallbackImage
                    className="rounded-full left-8 w-8 h-8"
                    src={`${ASSET_URL}/${kp.collateralToken?.token}.svg`}
                    fallback={`${ASSET_URL}/${kp.collateralToken?.token}.png`}
                    alt={kp.collateralToken?.token ?? ''}
                  />
                </div>
                <span>{`${kp.stablecoinToken?.token} / ${kp.collateralToken?.token}`}</span>
              </div>
            </td>
            <td className={cellStyle}>
              {`${formatNumber(format, kp.interest)}%`}
            </td>
            <td className={cellStyle}>
              <PriceCell
                info={`${formatNumber(format, kp.collateralAmount)} ${
                  kp.collateralToken?.token
                }`}
                priceValue={`$${formatNumber(
                  format,
                  (kp.collateralToken?.price ?? 0) * kp.collateralAmount
                )}`}
              />
            </td>
            <td className={cellStyle}>
              <PriceCell
                info={`${formatNumberExceptDecimal(format, kp.debt)} ${
                  kp.stablecoinToken?.token
                }`}
                priceValue={`$${formatNumber(
                  format,
                  (kp.stablecoinToken?.price ?? 0) * kp.debt
                )}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
