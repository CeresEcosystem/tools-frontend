import FarmingHeading from '@components/farming/farming_heading';
import FallbackImage from '@components/image/fallback_image';
import Table from '@components/table/table';
import { APOLLO_URL, ASSET_URL } from '@constants/index';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { BorrowingInfo, Collateral } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import Link from 'next/link';
import { Fragment, useState } from 'react';

const tableHeadStyle =
  'text-white p-4 text-center text-sm font-bold whitespace-nowrap';
const cellStyle = 'text-center text-white px-4 py-6 text-sm font-medium';
const priceCellStyle = 'text-center text-white text-sm font-medium';
export const tableCellCollateralStyle = 'px-4 py-2 whitespace-nowrap lg:px-6';

function PriceCell({ info, priceValue }: { info: string; priceValue: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <span className={priceCellStyle}>{info}</span>
      <span className={classNames(priceCellStyle, 'text-xs')}>
        {priceValue}
      </span>
    </div>
  );
}

function Collaterals({
  asset,
  collaterals,
}: {
  asset: BorrowingInfo;
  collaterals: Collateral[];
}) {
  const format = useFormatter();

  return (
    <tr className="border-none">
      <td colSpan={5} className="p-4">
        <table className="bg-backgroundHeader rounded-2xl min-w-full">
          <thead>
            <tr>
              <th className={tableHeadStyle}>Asset</th>
              <th className={tableHeadStyle}>Collateral amount</th>
              <th className={tableHeadStyle}>Borrowed amount</th>
              <th className={tableHeadStyle}>Interest</th>
              <th className={tableHeadStyle}>Rewards</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white divide-opacity-10">
            {collaterals.map((collateral) => (
              <tr key={collateral.collateralAssetId} className="hover:bg-grey3">
                <td
                  className={classNames(
                    tableCellCollateralStyle,
                    'flex items-center justify-center'
                  )}
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full">
                    <FallbackImage
                      src={`${ASSET_URL}/${collateral.collateralAssetSymbol}.svg`}
                      fallback={`${ASSET_URL}/${collateral.collateralAssetSymbol}.png`}
                      alt={collateral.collateralAssetSymbol}
                    />
                  </div>
                  <span className="ml-4 text-white min-w-14 text-xs">
                    {collateral.collateralAssetSymbol}
                  </span>
                </td>
                <td className={tableCellCollateralStyle}>
                  <div className="flex flex-col">
                    <span className="text-white block text-center font-medium text-xs">
                      {`${formatNumber(
                        format,
                        collateral.collateralAmount,
                        3
                      )} ${collateral.collateralAssetSymbol}`}
                    </span>
                    <span className="text-white text-opacity-50 block font-medium text-center text-[10px]">
                      {`$${formatNumber(
                        format,
                        collateral.collateralAmountPrice,
                        3
                      )}`}
                    </span>
                  </div>
                </td>
                <td className={tableCellCollateralStyle}>
                  <div className="flex flex-col">
                    <span className="text-white block text-center font-medium text-xs">
                      {`${formatNumber(format, collateral.borrowedAmount, 3)} ${
                        asset.poolAssetSymbol
                      }`}
                    </span>
                    <span className="text-white text-opacity-50 font-medium block text-center text-[10px]">
                      {`$${formatNumber(
                        format,
                        collateral.borrowedAmountPrice,
                        3
                      )}`}
                    </span>
                  </div>
                </td>
                <td className={tableCellCollateralStyle}>
                  <div className="flex flex-col">
                    <span className="text-white block text-center font-medium text-xs">
                      {`${formatNumber(format, collateral.interest, 3)} ${
                        asset.poolAssetSymbol
                      }`}
                    </span>
                    <span className="text-white text-opacity-50 font-medium block text-center text-[10px]">
                      {`$${formatNumber(format, collateral.interestPrice, 3)}`}
                    </span>
                  </div>
                </td>
                <td className={tableCellCollateralStyle}>
                  <div className="flex flex-col">
                    <span className="text-white block font-medium text-center text-xs">
                      {`${formatNumber(format, collateral.rewards, 3)} APOLLO`}
                    </span>
                    <span className="text-white text-opacity-50 font-medium block text-center text-[10px]">
                      {`$${formatNumber(format, collateral.rewardPrice, 3)}`}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}

export default function ApolloBorrowing({
  borrowingInfo,
}: {
  borrowingInfo: BorrowingInfo[];
}) {
  const format = useFormatter();

  const [collateralId, setCollateralId] = useState<string | null>(null);

  const toggleCollateralView = (id: string) => {
    if (collateralId === id) {
      setCollateralId(null);
    } else {
      setCollateralId(id);
    }
  };

  return (
    <div className="mt-12">
      <FarmingHeading
        title="Borrowing"
        linkText="Borrow on Apollo platform"
        link={APOLLO_URL}
      />
      {borrowingInfo.length > 0 ? (
        <Table
          renderHeader={
            <>
              <th className={classNames(tableHeadStyle, 'text-start')}>
                Asset
              </th>
              <th className={tableHeadStyle}>Amount</th>
              <th className={tableHeadStyle}>Interest</th>
              <th className={tableHeadStyle}>Reward</th>
              <th className={tableHeadStyle}>Collaterals</th>
            </>
          }
          renderBody={
            <>
              {borrowingInfo.map((item) => {
                const selected = collateralId === item.poolAssetId;

                return (
                  <Fragment key={item.poolAssetId}>
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
                          info={`${formatNumber(format, item.interest, 3)} ${
                            item.poolAssetSymbol
                          }`}
                          priceValue={`$${formatNumber(
                            format,
                            item.interestPrice,
                            3
                          )}`}
                        />
                      </td>
                      <td className={cellStyle}>
                        <PriceCell
                          info={`${formatNumber(
                            format,
                            item.rewards,
                            3
                          )} APOLLO`}
                          priceValue={`$${formatNumber(
                            format,
                            item.rewardPrice,
                            3
                          )}`}
                        />
                      </td>
                      <td className={cellStyle}>
                        <button
                          onClick={() => toggleCollateralView(item.poolAssetId)}
                          className="text-pink font-semibold text-sm outline-none"
                        >
                          {selected ? 'Hide collaterals' : 'Show collaterals'}
                          <ChevronRightIcon className="h-4 inline-block text-white text-opacity-50 ml-2" />
                        </button>
                      </td>
                    </tr>
                    {item.collaterals.length > 0 && selected && (
                      <Collaterals
                        asset={item}
                        collaterals={item.collaterals}
                      />
                    )}
                  </Fragment>
                );
              })}
            </>
          }
        />
      ) : (
        <span className="text-white font-medium">No data</span>
      )}
    </div>
  );
}
