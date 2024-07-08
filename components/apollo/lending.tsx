import FarmingHeading from '@components/farming/farming_heading';
import FallbackImage from '@components/image/fallback_image';
import Table from '@components/table/table';
import { APOLLO_URL, ASSET_URL } from '@constants/index';
import { LendingInfo } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import Link from 'next/link';

const tableHeadStyle = 'text-white p-4 text-center text-sm font-bold';
const cellStyle = 'text-center text-white px-4 py-6 text-sm font-medium';
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

export default function ApolloLending({
  lendingInfo,
}: {
  lendingInfo: LendingInfo[];
}) {
  const format = useFormatter();

  return (
    <div className="mt-12">
      <FarmingHeading
        title="Lending"
        linkText="Lend on Apollo platform"
        link={APOLLO_URL}
      />
      {lendingInfo.length > 0 ? (
        <Table
          renderHeader={
            <>
              <th className={classNames(tableHeadStyle, 'text-start')}>
                Asset
              </th>
              <th className={tableHeadStyle}>Amount</th>
              <th className={tableHeadStyle}>Reward</th>
            </>
          }
          renderBody={
            <>
              {lendingInfo.map((item) => (
                <tr
                  key={item.poolAssetSymbol}
                  className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10"
                >
                  <td
                    className={classNames(
                      cellStyle,
                      'text-start min-w-[150px]'
                    )}
                  >
                    <Link
                      href={{
                        pathname: '/charts',
                        query: { token: item.poolAssetSymbol },
                      }}
                    >
                      <FallbackImage
                        src={`${ASSET_URL}/${item.poolAssetSymbol}.svg`}
                        fallback={`${ASSET_URL}/${item.poolAssetSymbol}.png`}
                        alt={item.poolAssetSymbol}
                        className="w-8 h-8 mr-4 inline-block"
                      />
                      <span>{item.poolAssetSymbol}</span>
                    </Link>
                  </td>
                  <td className={cellStyle}>
                    <PriceCell
                      info={`${formatNumber(format, item.amount, 3)} ${
                        item.poolAssetSymbol
                      }`}
                      priceValue={`$${formatNumber(
                        format,
                        item.amountPrice,
                        3
                      )}`}
                    />
                  </td>
                  <td className={cellStyle}>
                    <PriceCell
                      info={`${formatNumber(format, item.rewards, 3)} APOLLO`}
                      priceValue={`$${formatNumber(
                        format,
                        item.rewardPrice,
                        3
                      )}`}
                    />
                  </td>
                </tr>
              ))}
            </>
          }
        />
      ) : (
        <span className="text-white font-medium">No data</span>
      )}
    </div>
  );
}
