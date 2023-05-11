import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

export default function TradingViewChart() {
  return (
    <div className="h-[80vh]">
      <AdvancedRealTimeChart
        theme="light"
        autosize
        symbol="Ceres"
        style="8"
        range="1D"
      ></AdvancedRealTimeChart>
    </div>
  );
}
