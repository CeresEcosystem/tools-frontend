import InputState from '@components/input/input_state';
import Spinner from '@components/spinner';
import { ASSET_URL } from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import usePortfolio from '@hooks/use_portfolio';
import usePortfolioWithoutPolkadotJS from '@hooks/use_portfolio_without_polkadotjs';
import { PortfolioItem } from '@interfaces/index';
import {
  formatCurrencyWithDecimals,
  formatNumber,
  formatToCurrency,
} from '@utils/helpers';
import classNames from 'classnames';
import { useFormatter } from 'next-intl';

function PriceInterval({ value }: { value: number }) {
  if (value < 0) {
    return <span className="text-red-400">{`${value}%`}</span>;
  }

  return <span className="text-green-400">{`${value}%`}</span>;
}

function Table({
  portfolioItems,
  totalValue,
}: {
  portfolioItems: PortfolioItem[];
  totalValue: number;
}) {
  const format = useFormatter();

  const tableHeadStyle = 'text-white p-4 text-center text-sm font-bold';
  const cellStyle = 'text-center text-white px-4 py-6 text-sm font-medium';
  const footerStyle = 'text-white px-4 py-2 text-left text-base font-bold';

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="min-w-[768px] bg-backgroundItem border-collapse border-hidden rounded-xl md:min-w-full">
        <thead className="bg-white bg-opacity-10">
          <tr className="border-collapse border-4 border-backgroundHeader">
            <th className={classNames(tableHeadStyle, 'text-start')}>Coin</th>
            <th className={tableHeadStyle}>Price</th>
            <th className={tableHeadStyle}>1h</th>
            <th className={tableHeadStyle}>24h</th>
            <th className={tableHeadStyle}>7d</th>
            <th className={tableHeadStyle}>30d</th>
            <th className={tableHeadStyle}>Balance</th>
            <th className={tableHeadStyle}>Value</th>
          </tr>
        </thead>
        <tbody>
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
                {formatNumber(format, item.balance, 2, true)}
              </td>
              <td className={cellStyle}>
                {formatCurrencyWithDecimals(format, item.value, 2, true)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-backgroundHeader border-t-4 border-t-backgroundHeader">
          <tr>
            <td colSpan={7} className={footerStyle}>
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

function PortfolioTablePolkadot() {
  const { loading, portfolioItems, totalValue } = usePortfolio();

  if (loading) {
    return <Spinner />;
  }

  if (typeof portfolioItems === 'string') {
    return (
      <span className="font-medium block text-opacity-50 mx-auto w-fit text-lg text-white">
        {portfolioItems}
        <Spinner />
      </span>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <span className="font-medium block text-opacity-50 mx-auto w-fit text-lg text-white">
        No tokens in portfolio.
      </span>
    );
  }

  return <Table portfolioItems={portfolioItems} totalValue={totalValue} />;
}

function PortfolioTableWithoutPolkadot() {
  const {
    loading,
    portfolioItems,
    totalValue,
    walletAddress,
    handleWalletAddressChange,
    fetchPortfolioItems,
  } = usePortfolioWithoutPolkadotJS();

  return (
    <>
      <div className="flex space-x-4 mb-10 items-center max-w-lg mx-auto">
        <InputState
          value={walletAddress}
          handleChange={handleWalletAddressChange}
          showIcon={false}
        />
        <button
          onClick={() => fetchPortfolioItems()}
          disabled={loading}
          className="rounded-xl bg-pink min-w-[100px] py-2 text-white text-sm focus:outline-none focus:ring-0"
        >
          {loading ? <span>Loading</span> : <span>Fetch</span>}
        </button>
      </div>
      {walletAddress !== '' ? (
        loading ? (
          <Spinner />
        ) : portfolioItems.length === 0 ? (
          <span className="font-medium block text-opacity-50 mx-auto w-fit text-lg text-white">
            No tokens in portfolio.
          </span>
        ) : (
          <Table portfolioItems={portfolioItems} totalValue={totalValue} />
        )
      ) : null}
    </>
  );
}

export default function PortfolioTable() {
  const polkadot = usePolkadot();

  if (polkadot?.accounts && polkadot?.accounts?.length > 0) {
    return <PortfolioTablePolkadot />;
  }

  return <PortfolioTableWithoutPolkadot />;
}
