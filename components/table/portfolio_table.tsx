import InputState from '@components/input/input_state';
import Spinner from '@components/spinner';
import PortfolioTabs from '@components/tabs/portfolio_tabs';
import usePortfolio from '@hooks/use_portfolio';
import {
  PortfolioItem,
  PortfolioLiquidityItem,
  PortfolioStakingRewardsItem,
} from '@interfaces/index';
import { ASSET_URL } from '@constants/index';
import {
  formatCurrencyWithDecimals,
  formatNumber,
  formatToCurrency,
} from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';
import { ChangeEvent } from 'react';

const tableHeadStyle = 'text-white p-4 text-center text-sm font-bold';
const cellStyle = 'text-center text-white px-4 py-6 text-sm font-medium';

function PriceInterval({ value }: { value: number }) {
  if (value < 0) {
    return <span className="text-red-400">{`${value}%`}</span>;
  }

  return <span className="text-green-400">{`${value}%`}</span>;
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
  walletAddress,
  handleWalletAddressChange,
  loading,
  fetchPortfolioItemsCallback,
}: {
  walletAddress: string;
  // eslint-disable-next-line no-unused-vars
  handleWalletAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  fetchPortfolioItemsCallback: () => void;
}) {
  return (
    <div className="flex space-x-4 mb-10 items-center max-w-lg mx-auto">
      <InputState
        value={walletAddress}
        handleChange={handleWalletAddressChange}
        showIcon={false}
      />
      <button
        onClick={() => fetchPortfolioItemsCallback()}
        disabled={loading}
        className="rounded-xl bg-pink min-w-[100px] py-2 text-white text-sm focus:outline-none focus:ring-0"
      >
        {loading ? <span>Loading</span> : <span>Fetch</span>}
      </button>
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
                <PriceInterval value={item.oneHour} />
              </td>
              <td className={cellStyle}>
                <PriceInterval value={item.oneDay} />
              </td>
              <td className={cellStyle}>
                <PriceInterval value={item.oneWeek} />
              </td>
              <td className={cellStyle}>
                <PriceInterval value={item.oneMonth} />
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
    inputWalletAddress,
    handleWalletAddressChange,
    portfolioItems,
    loading,
    totalValue,
    fetchPortfolioItems,
  } = usePortfolio();

  if (loadingStatus === 'Loading') {
    return <Spinner />;
  }

  if (loadingStatus === 'Not connected') {
    return (
      <span className="font-medium block text-opacity-50 mx-auto w-fit text-lg text-white">
        Waiting for wallet connection...
        <Spinner />
      </span>
    );
  }

  return (
    <>
      <PortfolioTabs
        tabs={tabs}
        selectedTab={selectedTab}
        changeSelectedTab={(tab) => changeSelectedTab(tab)}
      />
      {loadingStatus === 'No extension' && (
        <PortfolioInput
          walletAddress={inputWalletAddress}
          handleWalletAddressChange={handleWalletAddressChange}
          loading={loading}
          fetchPortfolioItemsCallback={() =>
            fetchPortfolioItems(inputWalletAddress)
          }
        />
      )}
      {loading ? (
        <Spinner />
      ) : !portfolioItems ? null : portfolioItems.length === 0 ? (
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
    </>
  );
}
