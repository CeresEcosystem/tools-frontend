import Clipboard from '@components/clipboard';
import FallbackImage from '@components/image/fallback_image';
import ListPagination from '@components/pagination/list_pagination';
import { ASSET_URL, ETHSCAN_URL } from '@constants/index';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import {
  PageMeta,
  PortfolioTransferItem,
  TransferType,
  WalletAddress,
} from '@interfaces/index';
import {
  formatDateAndTime,
  formatNumber,
  formatNumberExceptDecimal,
} from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import Link from 'next/link';

const tableHeadStyle = 'text-white p-4 text-center text-xs font-bold';
const cellStyle =
  'relative text-center text-white px-2 py-4 text-xs font-medium whitespace-nowrap';

export default function TransfersTable({
  selectedWallet,
  transfers,
  pageMeta,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: {
  selectedWallet: WalletAddress;
  transfers: PortfolioTransferItem[];
  pageMeta: PageMeta | undefined;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}) {
  const format = useFormatter();

  const walletAddress = (
    type: string,
    address: string,
    addressFormatted?: string
  ) => {
    if (
      address !== selectedWallet.address &&
      (type === TransferType.SORA || type === TransferType.ETH)
    ) {
      const href = address.startsWith('0x')
        ? `${ETHSCAN_URL}${address}`
        : `/portfolio?address=${address}`;

      return (
        <Link
          target="_blank"
          className="cursor-pointer inline-block"
          href={href}
        >
          {addressFormatted}
        </Link>
      );
    }

    return addressFormatted;
  };

  return (
    <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
      <thead className="bg-white bg-opacity-10">
        <tr className="border-collapse border-4 border-backgroundHeader">
          <th className={tableHeadStyle}>Direction</th>
          <th className={tableHeadStyle}>Date</th>
          <th className={tableHeadStyle}>Asset</th>
          <th className={tableHeadStyle}>Sender</th>
          <th className={tableHeadStyle}>Receiver</th>
          <th className={tableHeadStyle}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transfers.map((transfer, index) => (
          <tr
            key={`${transfer.sender}${transfer.receiver}${index}`}
            className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10 hover:bg-backgroundHeader"
          >
            <td className={cellStyle}>{transfer.directionFormatted}</td>
            <td className={classNames(cellStyle, 'min-w-[150px]')}>
              {formatDateAndTime(transfer.transferredAt)}
            </td>
            <td className={classNames(cellStyle, 'min-w-[150px]')}>
              <Link
                href={{
                  pathname: '/charts',
                  query: { token: transfer.tokenFormatted },
                }}
              >
                <FallbackImage
                  src={`${ASSET_URL}/${transfer.tokenFormatted}.svg`}
                  fallback={`${ASSET_URL}/${transfer.tokenFormatted}.png`}
                  alt={transfer.tokenFormatted ?? ''}
                  className="w-8 h-8 mr-3 inline-block"
                />
                <span className="text-left min-w-[50px] inline-block">
                  {transfer.tokenFormatted}
                </span>
              </Link>
            </td>
            <td className={cellStyle}>
              {walletAddress(
                transfer.type,
                transfer.sender,
                transfer.senderFormatted
              )}
              <Clipboard id="sender" text={transfer.sender}>
                <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
              </Clipboard>
            </td>
            <td className={cellStyle}>
              <span>
                {walletAddress(
                  transfer.type,
                  transfer.receiver,
                  transfer.receiverFormatted
                )}
              </span>
              <Clipboard id="receiver" text={transfer.receiver}>
                <ClipboardIcon className="h-4 w-4 inline-block ml-1 cursor-pointer" />
              </Clipboard>
            </td>
            <td className={cellStyle}>
              {formatNumberExceptDecimal(format, transfer.amount)}
            </td>
          </tr>
        ))}
      </tbody>
      {pageMeta && pageMeta.pageCount > 1 && (
        <tfoot className="bg-backgroundHeader border-t-backgroundHeader">
          <tr>
            <td colSpan={3}>
              <span className="px-4 text-white font-medium">
                {`Total transfers: ${formatNumber(
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
  );
}
