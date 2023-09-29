import TradingViewChartClient from '@components/charts/trading_view_chart_dynamic';
import Price from '@components/stats/price';
import SwapsClient from '@components/swaps/swaps_client';
import usePrices from '@hooks/use_prices';
import Script from 'next/script';
import { useState, useRef } from 'react';

export default function Charts() {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const {
    currentToken,
    changeCurrentToken,
    prices,
    changeCurrentTokenFromModal,
  } = usePrices();

  const scrollToRef = useRef<HTMLDivElement | null>(null);

  const scrollToSwaps = () => {
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && currentToken && (
        <>
          <Price
            token={currentToken}
            prices={prices}
            changeCurrentTokenFromModal={changeCurrentTokenFromModal}
            scrollToSwaps={scrollToSwaps}
          />
          <div className="h-[calc(100vh-84px)] py-8 sm:px-8">
            <TradingViewChartClient
              symbol={currentToken.token}
              changeCurrentToken={changeCurrentToken}
            />
          </div>
          <div ref={scrollToRef}>
            <SwapsClient address={currentToken.assetId} tokens={prices} />
          </div>
        </>
      )}
    </>
  );
}
