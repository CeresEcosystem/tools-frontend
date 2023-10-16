import TradingViewChartClient from '@components/charts/trading_view_chart_dynamic';
import usePrices from '@hooks/use_prices';
import Script from 'next/script';
import { useState } from 'react';

export default function Trading() {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const { currentToken, changeCurrentToken } = usePrices();

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && currentToken && typeof currentToken !== 'string' && (
        <>
          <div className="h-[100vh] w-[100vw]">
            <TradingViewChartClient
              symbol={currentToken.token}
              changeCurrentToken={changeCurrentToken}
            />
          </div>
        </>
      )}
    </>
  );
}
