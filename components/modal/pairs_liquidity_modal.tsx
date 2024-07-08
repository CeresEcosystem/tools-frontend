import LineChart from '@components/charts/line_chart';
import Clipboard from '@components/clipboard';
import FallbackImage from '@components/image/fallback_image';
import Modal from '@components/modal';
import ListPagination from '@components/pagination/list_pagination';
import Spinner from '@components/spinner';
import { ASSET_URL } from '@constants/index';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import usePairsLiquidity from '@hooks/use_pairs_liquidity';
import {
  PageMeta,
  Pair,
  PairLiquidity,
  PairLiquidityChartData,
} from '@interfaces/index';
import { formatDate, formatNumber } from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import Link from 'next/link';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'text-center text-white px-2 py-4 text-xs font-medium whitespace-nowrap';

function LiquidityChart({
  pairLiquidityChartData,
  selectedChart,
}: {
  pairLiquidityChartData: PairLiquidityChartData[];
  selectedChart: number;
}) {
  const format = useFormatter();

  if (pairLiquidityChartData.length === 0) {
    return (
      <span className="block text-white text-base text-center mb-12">
        Pair has no liquidity transactions.
      </span>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-backgroundItem max-w-4xl mx-auto">
      {selectedChart === 2 ? (
        <LineChart
          data={pairLiquidityChartData.map((point) => point.tokenAssetLiq)}
          labels={pairLiquidityChartData?.map((point) =>
            formatDate(point.updatedAt)
          )}
          callbackTitle={(tooltipItems: any) => {
            const dataIndex = tooltipItems[0]?.dataIndex;
            if (dataIndex !== undefined) {
              const { updatedAt }: PairLiquidityChartData =
                pairLiquidityChartData![dataIndex];
              return `Date: ${formatDate(updatedAt)}`;
            }
            return '';
          }}
          callbackLabel={(context: any) => {
            const { dataIndex }: { dataIndex: number } = context;
            const { tokenAssetLiq }: PairLiquidityChartData =
              pairLiquidityChartData![dataIndex];
            return `Liquidity: ${formatNumber(format, tokenAssetLiq)}`;
          }}
        />
      ) : selectedChart === 1 ? (
        <LineChart
          data={pairLiquidityChartData.map((point) => point.baseAssetLiq)}
          labels={pairLiquidityChartData?.map((point) =>
            formatDate(point.updatedAt)
          )}
          callbackTitle={(tooltipItems: any) => {
            const dataIndex = tooltipItems[0]?.dataIndex;
            if (dataIndex !== undefined) {
              const { updatedAt }: PairLiquidityChartData =
                pairLiquidityChartData![dataIndex];
              return `Date: ${formatDate(updatedAt)}`;
            }
            return '';
          }}
          callbackLabel={(context: any) => {
            const { dataIndex }: { dataIndex: number } = context;
            const { baseAssetLiq }: PairLiquidityChartData =
              pairLiquidityChartData![dataIndex];
            return `Liquidity: ${formatNumber(format, baseAssetLiq)}`;
          }}
        />
      ) : (
        <LineChart
          data={pairLiquidityChartData.map((point) => point.liquidity)}
          labels={pairLiquidityChartData?.map((point) =>
            formatDate(point.updatedAt)
          )}
          callbackTitle={(tooltipItems: any) => {
            const dataIndex = tooltipItems[0]?.dataIndex;
            if (dataIndex !== undefined) {
              const { updatedAt }: PairLiquidityChartData =
                pairLiquidityChartData![dataIndex];
              return `Date: ${formatDate(updatedAt)}`;
            }
            return '';
          }}
          callbackLabel={(context: any) => {
            const { dataIndex }: { dataIndex: number } = context;
            const { liquidity }: PairLiquidityChartData =
              pairLiquidityChartData![dataIndex];
            return `Liquidity: ${formatNumber(format, liquidity)}`;
          }}
        />
      )}
    </div>
  );
}

function LiquidityChanges({
  liquidity,
  pair,
  pageMeta,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: {
  liquidity: PairLiquidity[];
  pair: Pair | null;
  pageMeta: PageMeta | undefined;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}) {
  const format = useFormatter();

  if (liquidity.length === 0) {
    return (
      <span className="block text-white text-base text-center mb-12">
        Pair has no liquidity transactions.
      </span>
    );
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
        <thead className="bg-white bg-opacity-10">
          <tr className="border-collapse border-4 border-backgroundHeader">
            <th className={tableHeadStyle}>Date</th>
            <th className={tableHeadStyle}>Type</th>
            <th className={tableHeadStyle}>Account</th>
            <th className={tableHeadStyle}>{`${pair?.baseAsset} Amount`}</th>
            <th className={tableHeadStyle}>{`${pair?.token} Amount`}</th>
          </tr>
        </thead>
        <tbody>
          {liquidity.map((liq, index) => (
            <tr
              key={`${liq.signerId}${index}`}
              className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
            >
              <td className={cellStyle}>{liq.timestampFormatted}</td>

              <td
                className={classNames(
                  cellStyle,
                  liq.transactionTypeFormatted === 'Deposit'
                    ? '!text-green-400'
                    : '!text-red-400'
                )}
              >
                {liq.transactionTypeFormatted}
              </td>

              <td className={cellStyle}>
                <Link href={`/portfolio?address=${liq.signerId}`}>
                  {liq.accountIdFormatted}
                </Link>
                <Clipboard text={liq.signerId}>
                  <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
                </Clipboard>
              </td>
              <td className={cellStyle}>
                {liq.firstAssetAmountFormatted
                  ? formatNumber(format, liq.firstAssetAmountFormatted, 2, true)
                  : '/'}
              </td>
              <td className={cellStyle}>
                {liq.secondAssetAmountFormatted
                  ? formatNumber(
                      format,
                      liq.secondAssetAmountFormatted,
                      2,
                      true
                    )
                  : '/'}
              </td>
            </tr>
          ))}
        </tbody>
        {pageMeta && pageMeta.pageCount > 1 && (
          <tfoot className="bg-backgroundHeader border-t-backgroundHeader">
            <tr>
              <td colSpan={3}>
                <span className="px-4 text-white font-medium">
                  {`Total transactions: ${formatNumber(
                    format,
                    pageMeta.totalCount,
                    0
                  )}`}
                </span>
              </td>
              <td colSpan={4} className="py-2.5 px-4">
                <ListPagination
                  currentPage={pageMeta.pageNumber - 1}
                  totalPages={pageMeta.pageCount}
                  goToFirstPage={goToFirstPage}
                  goToPreviousPage={goToPreviousPage}
                  goToNextPage={goToNextPage}
                  goToLastPage={goToLastPage}
                  small
                  topMargin={false}
                  justifyEnd
                />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default function PairsLiquidityModal({
  showModal,
  closeModal,
  pair,
}: {
  showModal: boolean;
  closeModal: () => void;
  pair: Pair | null;
}) {
  const {
    loading,
    liquidity,
    pageMeta,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    tabs,
    selectedTab,
    handleTabChange,
    pairLiquidityChartData,
    selectedChart,
    setSelectedChart,
  } = usePairsLiquidity(pair, showModal);

  return (
    <Modal showModal={showModal} closeModal={closeModal} fullScreen>
      <div className="flex-grow">
        <div className="flex items-center">
          <div className="mr-4 flex flex-shrink-0">
            <FallbackImage
              className="rounded-full w-12 h-12 -mr-4 z-10"
              src={`${ASSET_URL}/${pair?.baseAsset}.svg`}
              alt={pair?.baseAsset ?? ''}
              fallback={`${ASSET_URL}/${pair?.baseAsset}.png`}
            />
            <FallbackImage
              className="rounded-full left-8 w-12 h-12"
              src={`${ASSET_URL}/${pair?.token}.svg`}
              alt={pair?.token ?? ''}
              fallback={`${ASSET_URL}/${pair?.token}.png`}
            />
          </div>
          <h4 className="text-base font-bold text-white line-clamp-1 sm:text-lg">
            {`${pair?.baseAsset} / ${pair?.token}`}
          </h4>
        </div>
        <div className="my-6 flex flex-wrap items-center gap-2">
          <nav className="flex gap-x-1 bg-backgroundItem w-min rounded-xl p-2">
            {tabs.map((tab) => {
              const current = tab === selectedTab;

              return (
                <div
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={classNames(
                    current
                      ? 'text-white bg-white bg-opacity-10'
                      : 'text-white text-opacity-50 hover:text-white',
                    'text-sm capitalize font-medium whitespace-nowrap py-2 px-4 cursor-pointer rounded-xl'
                  )}
                  aria-current={current ? 'page' : undefined}
                >
                  {tab}
                </div>
              );
            })}
          </nav>
          {selectedTab === tabs[1] && (
            <nav className="flex bg-white bg-opacity-5 w-min rounded-xl xs:gap-x-1 p-1">
              {[
                'Pair Liquidity',
                `${pair?.baseAsset} Liquidity`,
                `${pair?.token} Liquidity`,
              ].map((tab, index) => {
                const current = selectedChart === index;

                return (
                  <div
                    key={tab}
                    onClick={() => setSelectedChart(index)}
                    className={classNames(
                      current
                        ? 'text-white bg-pink'
                        : 'text-white text-opacity-50 hover:text-white',
                      'text-xs capitalize font-medium whitespace-nowrap py-1 px-2 cursor-pointer rounded-xl'
                    )}
                    aria-current={current ? 'page' : undefined}
                  >
                    {tab}
                  </div>
                );
              })}
            </nav>
          )}
        </div>
        {loading ? (
          <Spinner />
        ) : selectedTab === tabs[0] ? (
          <LiquidityChanges
            liquidity={liquidity}
            pair={pair}
            pageMeta={pageMeta}
            goToFirstPage={goToFirstPage}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            goToLastPage={goToLastPage}
          />
        ) : (
          <LiquidityChart
            pairLiquidityChartData={pairLiquidityChartData}
            selectedChart={selectedChart}
          />
        )}
      </div>
    </Modal>
  );
}
