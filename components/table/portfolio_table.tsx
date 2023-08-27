import Spinner from '@components/spinner';
import PortfolioTabs from '@components/tabs/portfolio_tabs';
import usePortfolio from '@hooks/use_portfolio';
import {
  PortfolioItem,
  PortfolioLiquidityItem,
  PortfolioModalData,
  PortfolioStakingRewardsItem,
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
import { ChangeEvent, useState } from 'react';
import { PencilIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import PortfolioModal from '@components/modal/portfolio_modal';

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
  totalValue: number;
  renderHeader: React.ReactNode;
  renderBody: React.ReactNode;
  footerColSpan: number;
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
  handleWalletChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  loading?: boolean;
  // eslint-disable-next-line no-unused-vars
  showModal: (item: WalletAddress | null) => void;
}) {
  return (
    <div className="max-w-lg mx-auto mb-10">
      <div className="flex space-x-4 items-center">
        {walletAddresses.length > 0 ? (
          <div className="relative w-full after:content-['▼'] after:top-3.5 after:text-white after:text-opacity-50 after:text-xs after:right-4 after:absolute">
            <select
              id="selectedWallet"
              name="selectedWallet"
              className="block relative w-full appearance-none bg-backgroundHeader border-backgroundHeader border-2 rounded-xl py-2 pl-4 pr-10 sm:pr-4 text-base text-white capitalize font-semibold focus:outline-none focus:border-pink focus:ring-0"
              value={
                selectedWallet
                  ? walletAddresses.findIndex(
                      (w) => w.address === selectedWallet.address
                    )
                  : 0
              }
              onChange={handleWalletChange}
            >
              {walletAddresses.map((wallet, index) => (
                <option key={index} value={index}>{`${
                  wallet.name
                } (${formatWalletAddress(wallet.address, 6)})`}</option>
              ))}
            </select>
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
            !selectedWallet?.fromPolkadotExtension && (
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
                <img
                  src={`${ASSET_URL}/${item.token}.svg`}
                  alt=""
                  className="w-8 h-8 mr-4 inline-block"
                />
                <span>{item.fullName}</span>
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
                <img
                  src={`${ASSET_URL}/${item.token}.svg`}
                  alt=""
                  className="w-8 h-8 mr-4 inline-block"
                />
                <span>{item.fullName}</span>
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
      footerColSpan={1}
      renderHeader={
        <>
          <th className={classNames(tableHeadStyle, 'text-start')}>
            Liquidity pair
          </th>
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
  selectedTab,
  totalValue,
  portfolioItems,
}: {
  selectedTab: string;
  totalValue: number;
  portfolioItems: (
    | PortfolioItem
    | PortfolioStakingRewardsItem
    | PortfolioLiquidityItem
  )[];
}) {
  if (selectedTab === 'Portfolio') {
    return (
      <PortfolioTabTable
        portfolioItems={portfolioItems as PortfolioItem[]}
        totalValue={totalValue}
      />
    );
  }

  if (selectedTab === 'Staking') {
    return (
      <PortfolioStakingAndRewardTab
        portfolioItems={portfolioItems as PortfolioStakingRewardsItem[]}
        totalValue={totalValue}
      />
    );
  }

  if (selectedTab === 'Rewards') {
    return (
      <PortfolioStakingAndRewardTab
        portfolioItems={portfolioItems as PortfolioStakingRewardsItem[]}
        totalValue={totalValue}
      />
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
        />
      )}
      {loading ? (
        <Spinner />
      ) : !portfolioItems ? null : portfolioItems === 'throttle error' ? (
        <span className="font-medium text-center block text-opacity-50 mx-auto w-fit text-lg text-white">
          To many requests. Please, try again in one minute.
        </span>
      ) : portfolioItems.length === 0 ? (
        <span className="font-medium block text-opacity-50 mx-auto w-fit text-lg text-white">
          {`No items in ${selectedTab.tab}.`}
        </span>
      ) : (
        <TabRenderer
          key={selectedTab.tab}
          portfolioItems={portfolioItems}
          totalValue={totalValue}
          selectedTab={selectedTab.tab}
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
