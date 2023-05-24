import TradingViewChartClient from '@components/charts/trading_view_chart_dynamic';
import Script from 'next/script';
import { useState } from 'react';

export default function Charts() {
  const [isScriptReady, setIsScriptReady] = useState(false);

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      <div className="h-[calc(100vh-84px)] p-8">
        {isScriptReady && <TradingViewChartClient />}
      </div>
    </>
  );
}
