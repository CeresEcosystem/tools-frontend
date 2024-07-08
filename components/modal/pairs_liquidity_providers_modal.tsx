import { PageMeta, Pair, PairLiquidityProvider } from '@interfaces/index';
import Modal from '.';
import { ASSET_URL } from '@constants/index';
import usePairsLiquidityProviders from '@hooks/use_pairs_liquidity_providers';
import Spinner from '@components/spinner';
import Link from 'next/link';
import Clipboard from '@components/clipboard';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import ListPagination from '@components/pagination/list_pagination';
import FallbackImage from '@components/image/fallback_image';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'text-center text-white px-2 py-4 text-xs font-medium whitespace-nowrap';

function PairProvider({
  providers,
  pageMeta,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: {
  providers: PairLiquidityProvider[];
  pageMeta: PageMeta | undefined;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}) {
  const format = useFormatter();

  if (providers.length === 0) {
    return (
      <span className="mt-6 block text-white text-base text-center mb-12">
        Pair has no liquidity providers.
      </span>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="bg-backgroundItem w-full border-collapse border-hidden rounded-xl md:min-w-full xs:table-fixed">
        <thead className="bg-white bg-opacity-10">
          <tr className="border-collapse border-4 border-backgroundHeader">
            <th className={tableHeadStyle}>Account</th>
            <th className={tableHeadStyle}>Liquidity</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider, index) => (
            <tr
              key={`${provider.address}${index}`}
              className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
            >
              <td className={cellStyle}>
                <Link href={`/portfolio?address=${provider.address}`}>
                  {provider.accountIdFormatted}
                </Link>
                <Clipboard text={provider.address}>
                  <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
                </Clipboard>
              </td>
              <td className={cellStyle}>
                {formatNumber(format, provider.liquidity, 2, true)}
              </td>
            </tr>
          ))}
        </tbody>
        {pageMeta && pageMeta.pageCount > 1 && (
          <tfoot className="bg-backgroundHeader border-t-backgroundHeader">
            <tr>
              <td>
                <span className="px-4 text-white font-medium">
                  {`Total providers: ${formatNumber(
                    format,
                    pageMeta.totalCount,
                    0
                  )}`}
                </span>
              </td>
              <td className="py-2.5 px-4">
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

export default function PairsLiquidityProvidersModal({
  showModal,
  closeModal,
  pair,
}: {
  showModal: boolean;
  closeModal: () => void;
  pair: Pair | null;
}) {
  const {
    providers,
    loading,
    pageMeta,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  } = usePairsLiquidityProviders(pair, showModal);

  return (
    <Modal showModal={showModal} closeModal={closeModal}>
      <div>
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
        {loading ? (
          <Spinner />
        ) : (
          <PairProvider
            providers={providers}
            pageMeta={pageMeta}
            goToFirstPage={goToFirstPage}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            goToLastPage={goToLastPage}
          />
        )}
      </div>
    </Modal>
  );
}
