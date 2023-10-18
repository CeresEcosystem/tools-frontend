import Clipboard from '@components/clipboard';
import Modal from '@components/modal';
import ListPagination from '@components/pagination/list_pagination';
import Spinner from '@components/spinner';
import { ASSET_URL } from '@constants/index';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import usePairsLiquidity from '@hooks/use_pairs_liquidity';
import { Pair } from '@interfaces/index';
import { formatNumber, formatNumberExceptDecimal } from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import Link from 'next/link';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'text-center text-white px-2 py-4 text-xs font-medium whitespace-nowrap';

export default function PairsLiquidityModal({
  showModal,
  closeModal,
  pair,
}: {
  showModal: boolean;
  closeModal: () => void;
  pair: Pair | null;
}) {
  const format = useFormatter();

  const {
    loading,
    liquidity,
    pageMeta,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  } = usePairsLiquidity(pair, showModal);

  return (
    <Modal showModal={showModal} closeModal={closeModal} fullScreen>
      <div className="flex-grow overflow-y-auto">
        <div className="flex items-center mb-8">
          <div className="mr-4 flex flex-shrink-0">
            <img
              className="rounded-full w-12 h-12 -mr-4 z-10"
              src={`${ASSET_URL}/${pair?.baseAsset}.svg`}
              alt={pair?.baseAsset}
            />
            <img
              className="rounded-full left-8 w-12 h-12"
              src={`${ASSET_URL}/${pair?.token}.svg`}
              alt={pair?.baseAsset}
            />
          </div>
          <h4 className="text-base font-bold text-white line-clamp-1 sm:text-lg">
            {`${pair?.baseAsset} / ${pair?.token}`}
          </h4>
        </div>
        {loading ? (
          <Spinner />
        ) : liquidity.length === 0 ? (
          <span className="block text-white text-base text-center mb-12">
            Pair has no liquidity transactions.
          </span>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
              <thead className="bg-white bg-opacity-10">
                <tr className="border-collapse border-4 border-backgroundHeader">
                  <th className={tableHeadStyle}>Date</th>
                  <th className={tableHeadStyle}>Type</th>
                  <th className={tableHeadStyle}>Account</th>
                  <th
                    className={tableHeadStyle}
                  >{`${pair?.baseAsset} Amount`}</th>
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
                      <Link href={`/portfolio/${liq.signerId}`}>
                        {liq.accountIdFormatted}
                      </Link>
                      <Clipboard text={liq.signerId}>
                        <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
                      </Clipboard>
                    </td>
                    <td className={cellStyle}>
                      {liq.firstAssetAmountFormatted
                        ? formatNumberExceptDecimal(
                            format,
                            liq.firstAssetAmountFormatted
                          )
                        : '/'}
                    </td>
                    <td className={cellStyle}>
                      {liq.secondAssetAmountFormatted
                        ? formatNumberExceptDecimal(
                            format,
                            liq.secondAssetAmountFormatted
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
        )}
      </div>
    </Modal>
  );
}
