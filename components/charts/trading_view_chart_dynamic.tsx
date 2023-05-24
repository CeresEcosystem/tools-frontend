import dynamic from 'next/dynamic';

const TradingViewChartClient = dynamic(
  () => import('@components/charts/trading_view_chart'),
  { ssr: false }
);

export default TradingViewChartClient;
