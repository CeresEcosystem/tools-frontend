import Spinner from '@components/spinner';
import PortfolioTabs from '@components/tabs/portfolio_tabs';
import usePortfolio from '@hooks/use_portfolio';
import {
  PageMeta,
  PortfolioItem,
  PortfolioLiquidityItem,
  PortfolioModalData,
  PortfolioStakingRewardsItem,
  PortfolioTransferItem,
  Swap,
  WalletAddress,
} from '@interfaces/index';
import { ASSET_URL } from '@constants/index';
import {
  formatCurrencyWithDecimals,
  formatNumber,
  formatToCurrency,
  formatWalletAddress,
} from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import { useState } from 'react';
import {
  PencilIcon,
  UserPlusIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import PortfolioModal from '@components/modal/portfolio_modal';
import Select from 'react-select';
import Clipboard from '@components/clipboard';
import SwapsTable from '@components/swaps/swaps_table';
import Link from 'next/link';
import TransfersTable from '@components/transfers/transfers_table';

const tableHeadStyle = 'text-white p-4 text-center text-sm font-bold';
const cellStyle = 'text-center text-white px-4 py-6 text-sm font-medium';

function PriceInterval({
  valuePercentage,
  value,
}: {
  valuePercentage: number;
  value: number;
}) {
  const format = useFormatter();

  if (value === 0) {
    return <span className="text-white text-opacity-50">0%</span>;
  }

  if (value < 0) {
    return (
      <div className="flex flex-col space-y-1">
        <span className="text-red-400">{`${formatNumber(
          format,
          valuePercentage,
          2
        )}%`}</span>
        <span className="text-red-400 text-xs">
          {formatCurrencyWithDecimals(format, value, 2, true)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-green-400">{`${formatNumber(
        format,
        valuePercentage,
        2
      )}%`}</span>
      <span className="text-green-400 text-xs">
        {formatCurrencyWithDecimals(format, value, 2, true)}
      </span>
    </div>
  );
}

function Table({
  totalValue,
  renderHeader,
  renderBody,
  footerColSpan,
}: {
  totalValue?: number;
  renderHeader: React.ReactNode;
  renderBody: React.ReactNode;
  footerColSpan?: number;
}) {
  const format = useFormatter();

  const footerStyle = 'text-white px-4 py-2 text-left text-base font-bold';

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
        <thead className="bg-white bg-opacity-10">
          <tr className="border-collapse border-4 border-backgroundHeader">
            {renderHeader}
          </tr>
        </thead>
        <tbody>{renderBody}</tbody>
        {totalValue && (
          <tfoot className="bg-backgroundHeader border-t-4 border-t-backgroundHeader">
            <tr>
              <td colSpan={footerColSpan} className={footerStyle}>
                Total Value
              </td>
              <td className={classNames(footerStyle, 'text-center !text-pink')}>
                {formatCurrencyWithDecimals(format, totalValue, 2, true)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

function PortfolioInput({
  selectedWallet,
  walletAddresses,
  handleWalletChange,
  loading,
  showModal,
}: {
  selectedWallet: WalletAddress | null;
  walletAddresses: WalletAddress[];
  // eslint-disable-next-line no-unused-vars
  handleWalletChange: (newWallet?: string) => void;
  loading?: boolean;
  // eslint-disable-next-line no-unused-vars
  showModal: (item: WalletAddress | null) => void;
}) {
  const getItem = (w: WalletAddress | null) => {
    if (w) {
      if (w.name !== '') {
        const wf = `${w.name} (${formatWalletAddress(w.address, 6)})`;
        return { label: wf, value: w.address };
      }

      const wf = formatWalletAddress(w.address, 10);
      return { label: wf, value: w.address };
    }

    return { label: '', value: '' };
  };

  const options = walletAddresses.map((wallet) => {
    return getItem(wallet);
  });

  const selectedValue = getItem(selectedWallet);

  return (
    <div className="max-w-lg mx-auto mb-10">
      <div className="flex space-x-4 items-center">
        {walletAddresses.length > 0 ? (
          <div className="relative w-full bg-backgroundHeader flex items-center rounded-xl">
            <Select
              id="selectedWallet"
              name="selectedWallet"
              value={selectedValue}
              options={options}
              isSearchable
              // eslint-disable-next-line no-unused-vars
              onChange={(newValue, _actionMeta) =>
                handleWalletChange(newValue?.value)
              }
            />
            {selectedWallet && selectedWallet.address !== '' && (
              <Clipboard text={selectedWallet.address}>
                <div className="bg-white bg-opacity-10 mr-2 p-1 rounded-lg cursor-pointer">
                  <ClipboardIcon className="w-5 h-5 text-white" />
                </div>
              </Clipboard>
            )}
          </div>
        ) : (
          <span className="w-full text-white text-sm">
            No added wallets. Please, add one. <br /> If you have PolkadotJS
            extension installed and wallets are not showing up, please refresh
            the page.
          </span>
        )}
        <div className="flex items-center justify-end space-x-2">
          {walletAddresses.length > 0 &&
            !selectedWallet?.fromPolkadotExtension &&
            selectedWallet?.name !== '' && (
              <button
                onClick={() => showModal(selectedWallet)}
                disabled={loading}
                className="rounded-xl bg-pink p-2 text-white text-sm focus:outline-none focus:ring-0"
              >
                <PencilIcon className="w-5 h-5 text-white" />
              </button>
            )}
          <button
            onClick={() => showModal(null)}
            disabled={loading}
            className="rounded-xl bg-pink p-2 text-white text-sm focus:outline-none focus:ring-0"
          >
            <UserPlusIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      {walletAddresses.length > 0 && (
        <div className="px-4 pt-1">
          <small className="text-white text-opacity-50 text-xs leading-0">
            If you have PolkadotJS extension installed and wallets are not
            showing up, please refresh the page.
          </small>
        </div>
      )}
    </div>
  );
}

function PortfolioTabTable({
  totalValue,
  portfolioItems,
}: {
  totalValue: number;
  portfolioItems: PortfolioItem[];
}) {
  const format = useFormatter();

  return (
    <Table
      totalValue={totalValue}
      footerColSpan={7}
      renderHeader={
        <>
          <th className={classNames(tableHeadStyle, 'text-start')}>Coin</th>
          <th className={tableHeadStyle}>Price</th>
          <th className={tableHeadStyle}>1h</th>
          <th className={tableHeadStyle}>24h</th>
          <th className={tableHeadStyle}>7d</th>
          <th className={tableHeadStyle}>30d</th>
          <th className={tableHeadStyle}>Balance</th>
          <th className={tableHeadStyle}>Value</th>
        </>
      }
      renderBody={
        <>
          {portfolioItems.map((item) => (
            <tr
              key={item.token}
              className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10"
            >
              <td className={classNames(cellStyle, 'text-start min-w-[250px]')}>
                <Link
                  href={{
                    pathname: '/charts',
                    query: { token: item.token },
                  }}
                >
                  <img
                    src={`${ASSET_URL}/${item.token}.svg`}
                    alt=""
                    className="w-8 h-8 mr-4 inline-block"
                  />
                  <span>{item.fullName}</span>
                </Link>
              </td>
              <td className={cellStyle}>
                {formatToCurrency(format, item.price)}
              </td>
              <td className={cellStyle}>
                <PriceInterval
                  valuePercentage={item.oneHour}
                  value={item.oneHourValueDifference}
                />
              </td>
              <td className={cellStyle}>
                <PriceInterval
                  valuePercentage={item.oneDay}
                  value={item.oneDayValueDifference}
                />
              </td>
              <td className={cellStyle}>
                <PriceInterval
                  valuePercentage={item.oneWeek}
                  value={item.oneWeekValueDifference}
                />
              </td>
              <td className={cellStyle}>
                <PriceInterval
                  valuePercentage={item.oneMonth}
                  value={item.oneMonthValueDifference}
                />
              </td>
              <td className={cellStyle}>
                {formatNumber(format, item.balance, 3, true)}
              </td>
              <td className={cellStyle}>
                {formatCurrencyWithDecimals(format, item.value, 3, true)}
              </td>
            </tr>
          ))}
        </>
      }
    />
  );
}

function PortfolioStakingAndRewardTab({
  totalValue,
  portfolioItems,
}: {
  totalValue: number;
  portfolioItems: PortfolioStakingRewardsItem[];
}) {
  const format = useFormatter();

  return (
    <Table
      totalValue={totalValue}
      footerColSpan={3}
      renderHeader={
        <>
          <th className={classNames(tableHeadStyle, 'text-start')}>Coin</th>
          <th className={tableHeadStyle}>Price</th>
          <th className={tableHeadStyle}>Balance</th>
          <th className={tableHeadStyle}>Value</th>
        </>
      }
      renderBody={
        <>
          {portfolioItems.map((item) => (
            <tr
              key={item.token}
              className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10"
            >
              <td className={classNames(cellStyle, 'text-start')}>
                <Link
                  href={{
                    pathname: '/charts',
                    query: { token: item.token },
                  }}
                >
                  <img
                    src={`${ASSET_URL}/${item.token}.svg`}
                    alt=""
                    className="w-8 h-8 mr-4 inline-block"
                  />
                  <span>{item.fullName}</span>
                </Link>
              </td>
              <td className={cellStyle}>
                {formatToCurrency(format, item.price)}
              </td>
              <td className={cellStyle}>
                {formatNumber(format, item.balance, 3, true)}
              </td>
              <td className={cellStyle}>
                {formatCurrencyWithDecimals(format, item.value, 3, true)}
              </td>
            </tr>
          ))}
        </>
      }
    />
  );
}

function PortfolioLiquidityTab({
  totalValue,
  portfolioItems,
}: {
  totalValue: number;
  portfolioItems: PortfolioLiquidityItem[];
}) {
  const format = useFormatter();

  return (
    <Table
      totalValue={totalValue}
      footerColSpan={3}
      renderHeader={
        <>
          <th className={classNames(tableHeadStyle, 'text-start')}>
            Liquidity pair
          </th>
          <th className={tableHeadStyle}>Base asset</th>
          <th className={tableHeadStyle}>Target asset</th>
          <th className={tableHeadStyle}>Value</th>
        </>
      }
      renderBody={
        <>
          {portfolioItems.map((item) => (
            <tr
              key={item.token}
              className="[&>td]:border-2 [&>td]:border-collapse [&>td]:border-white [&>td]:border-opacity-10"
            >
              <td className={classNames(cellStyle, 'text-start')}>
                <div className="flex items-center">
                  <div className="mr-2 inline-flex sm:mr-4">
                    <img
                      className="rounded-full w-8 h-8 -mr-4 z-10"
                      src={`${ASSET_URL}/${item.baseAsset}.svg`}
                      alt={item.baseAsset}
                    />
                    <img
                      className="rounded-full left-8 w-8 h-8"
                      src={`${ASSET_URL}/${item.token}.svg`}
                      alt={item.baseAsset}
                    />
                  </div>
                  <span>{`${item.baseAsset} / ${item.token}`}</span>
                </div>
              </td>
              <td className={cellStyle}>
                {`${formatNumber(format, item.baseAssetLiqHolding, 3, true)} ${
                  item.baseAsset
                }`}
              </td>
              <td className={cellStyle}>
                {`${formatNumber(format, item.tokenLiqHolding, 3, true)} ${
                  item.token
                }`}
              </td>
              <td className={cellStyle}>
                {formatCurrencyWithDecimals(format, item.value, 3, true)}
              </td>
            </tr>
          ))}
        </>
      }
    />
  );
}

function TabRenderer({
  selectedWallet,
  selectedTab,
  totalValue,
  portfolioItems,
  pageMeta,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: {
  selectedWallet: WalletAddress | null;
  selectedTab: string;
  totalValue: number;
  portfolioItems: (
    | PortfolioItem
    | PortfolioStakingRewardsItem
    | PortfolioLiquidityItem
    | Swap
    | PortfolioTransferItem
  )[];
  pageMeta: PageMeta | undefined;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}) {
  if (selectedTab === 'portfolio') {
    return (
      <PortfolioTabTable
        portfolioItems={portfolioItems as PortfolioItem[]}
        totalValue={totalValue}
      />
    );
  }

  if (selectedTab === 'staking') {
    return (
      <PortfolioStakingAndRewardTab
        portfolioItems={portfolioItems as PortfolioStakingRewardsItem[]}
        totalValue={totalValue}
      />
    );
  }

  if (selectedTab === 'rewards') {
    return (
      <PortfolioStakingAndRewardTab
        portfolioItems={portfolioItems as PortfolioStakingRewardsItem[]}
        totalValue={totalValue}
      />
    );
  }

  if (selectedTab === 'swaps') {
    return (
      <div className="max-w-full overflow-x-auto">
        <SwapsTable
          token="Portfolio"
          swaps={portfolioItems as Swap[]}
          pageMeta={pageMeta}
          goToFirstPage={goToFirstPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToLastPage={goToLastPage}
          showAccount={false}
          linkToChart
        />
      </div>
    );
  }

  if (selectedTab === 'transfers') {
    return (
      <div className="max-w-full overflow-x-auto">
        <TransfersTable
          selectedWallet={selectedWallet}
          transfers={portfolioItems as PortfolioTransferItem[]}
          pageMeta={pageMeta}
          goToFirstPage={goToFirstPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToLastPage={goToLastPage}
        />
      </div>
    );
  }

  return (
    <PortfolioLiquidityTab
      portfolioItems={portfolioItems as PortfolioLiquidityItem[]}
      totalValue={totalValue}
    />
  );
}

export default function PortfolioTable() {
  const {
    loadingStatus,
    tabs,
    selectedTab,
    changeSelectedTab,
    selectedWallet,
    walletAddresses,
    handleWalletChange,
    portfolioItems,
    loading,
    totalValue,
    addEditWallet,
    removeWallet,
    pageMeta,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  } = usePortfolio();

  const [showModal, setShowModal] = useState<PortfolioModalData>({
    show: false,
    item: null,
  });

  if (loadingStatus) {
    return <Spinner />;
  }

  return (
    <>
      <PortfolioInput
        selectedWallet={selectedWallet}
        walletAddresses={walletAddresses}
        handleWalletChange={handleWalletChange}
        loading={loading}
        showModal={(item: WalletAddress | null) =>
          setShowModal({
            show: true,
            item,
          })
        }
      />
      {walletAddresses.length > 0 && (
        <PortfolioTabs
          tabs={tabs}
          selectedTab={selectedTab}
          changeSelectedTab={(tab) => changeSelectedTab(tab)}
          loading={loading}
        />
      )}
      {loading ? (
        <Spinner />
      ) : !portfolioItems || !selectedWallet ? null : portfolioItems ===
        'throttle error' ? (
        <span className="font-medium text-center block text-opacity-50 mx-auto w-fit text-lg text-white">
          To many requests. Please, try again in one minute.
        </span>
      ) : portfolioItems.length === 0 ? (
        <span className="font-medium block text-opacity-50 mx-auto w-fit text-lg text-white">
          {`No items in ${selectedTab}.`}
        </span>
      ) : (
        <TabRenderer
          key={selectedTab}
          selectedWallet={selectedWallet}
          portfolioItems={portfolioItems}
          totalValue={totalValue}
          selectedTab={selectedTab}
          pageMeta={pageMeta}
          goToFirstPage={goToFirstPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToLastPage={goToLastPage}
        />
      )}
      <PortfolioModal
        showModal={showModal.show}
        wallet={showModal.item}
        addEditWallet={(
          wallet: WalletAddress,
          previousWallet: WalletAddress | null
        ) => {
          addEditWallet(wallet, previousWallet);
          setShowModal((oldState) => ({
            ...oldState,
            show: false,
          }));
        }}
        removeWallet={(wallet: WalletAddress) => {
          removeWallet(wallet);
          setShowModal((oldState) => ({
            ...oldState,
            show: false,
          }));
        }}
        closeModal={() =>
          setShowModal((oldState) => ({
            ...oldState,
            show: false,
          }))
        }
      />
    </>
  );
}
