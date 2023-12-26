import { ASSET_URL } from '@constants/index';
import Modal from '.';
import { PageMeta, Token, TokenHolder } from '@interfaces/index';
import useTokenHolders from '@hooks/use_token_holders';
import Spinner from '@components/spinner';
import ListPagination from '@components/pagination/list_pagination';
import { useFormatter } from 'next-intl';
import { formatNumber } from '@utils/helpers';
import Link from 'next/link';
import Clipboard from '@components/clipboard';
import { ClipboardIcon } from '@heroicons/react/24/outline';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'text-center text-white px-2 py-4 text-xs font-medium whitespace-nowrap';

function TokenHoldersTable({
  holders,
  pageMeta,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: {
  holders: TokenHolder[];
  pageMeta: PageMeta | undefined;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}) {
  const format = useFormatter();

  if (holders.length === 0) {
    return (
      <span className="block text-white text-base text-center mt-6">
        Token has no holders.
      </span>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="bg-backgroundItem w-full border-collapse border-hidden rounded-xl md:min-w-full xs:table-fixed">
        <thead className="bg-white bg-opacity-10">
          <tr className="border-collapse border-4 border-backgroundHeader">
            <th className={tableHeadStyle}>Holder</th>
            <th className={tableHeadStyle}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {holders.map((holder, index) => (
            <tr
              key={`${holder.holder}${index}`}
              className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
            >
              <td className={cellStyle}>
                <Link href={`/portfolio?address=${holder.holder}`}>
                  {holder.holderFormatted}
                </Link>
                <Clipboard text={holder.holder}>
                  <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
                </Clipboard>
              </td>
              <td className={cellStyle}>{holder.balanceFormatted}</td>
            </tr>
          ))}
        </tbody>
        {pageMeta && pageMeta.pageCount > 1 && (
          <tfoot className="bg-backgroundHeader border-t-backgroundHeader">
            <tr>
              <td>
                <span className="px-4 text-white font-medium">
                  {`Total holders: ${formatNumber(
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

export default function TokenHoldersModal({
  showModal,
  closeModal,
  token,
}: {
  showModal: boolean;
  closeModal: () => void;
  token: Token | null;
}) {
  const {
    holders,
    loading,
    pageMeta,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    pageLoading,
  } = useTokenHolders(token, showModal);

  return (
    <Modal showModal={showModal} closeModal={closeModal}>
      <div className="flex-grow">
        <div className="flex items-center">
          <div className="mr-4 flex flex-shrink-0">
            <img
              className="rounded-full w-12 h-12 -mr-4 z-10"
              src={`${ASSET_URL}/${token?.token}.svg`}
              alt={token?.token}
            />
          </div>
          <h4 className="text-base font-bold text-white line-clamp-1 sm:text-lg">
            {token?.fullName}
          </h4>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="relative">
            <TokenHoldersTable
              holders={holders}
              pageMeta={pageMeta}
              goToFirstPage={goToFirstPage}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
              goToLastPage={goToLastPage}
            />
            {pageLoading && (
              <div className="absolute inset-0 z-10 bg-black bg-opacity-20 flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
