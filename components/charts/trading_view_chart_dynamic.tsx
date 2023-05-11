import dynamic from 'next/dynamic';

const TradingViewChartDynamic = dynamic(() => import('./trading_view_chart'), {
  ssr: false,
});

export default TradingViewChartDynamic;
