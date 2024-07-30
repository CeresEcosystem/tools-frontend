import Spinner from '@components/spinner';
import usePortfolioChart from '@hooks/use_portfolio_chart';
import { WalletAddress } from '@interfaces/index';
import { createChart, ColorType, ISeriesApi, Time } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

const colors = {
  backgroundColor: '#250936',
  lineColor: '#f0398c',
  textColor: 'white',
  areaTopColor: '#f0398c60',
  areaBottomColor: '#f0398c28',
};

export default function PortfolioChart({
  selectedWallet,
}: {
  selectedWallet: WalletAddress;
}) {
  const { loading, timeIntervals, timeInterval, setTimeInterval, chartData } =
    usePortfolioChart(selectedWallet);

  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const chartSeries = useRef<ISeriesApi<'Area', Time>>();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: colors.backgroundColor,
        },
        textColor: colors.textColor,
      },
      grid: {
        horzLines: { color: '#ffffff20' },
        vertLines: { color: '#ffffff20' },
      },
      crosshair: {
        horzLine: { labelBackgroundColor: '#4dd0e1' },
        vertLine: { labelBackgroundColor: '#4dd0e1' },
      },
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: true },
      timeScale: { timeVisible: true },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    chart.timeScale().fitContent();

    chartSeries.current = chart.addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (chartData.length > 0) {
      chartSeries.current?.setData(chartData);
    } else {
      chartSeries.current?.setData([]);
    }
  }, [chartData]);

  return (
    <div
      ref={chartContainerRef}
      className="h-[300px] relative bg-backgroundItem mb-8"
    >
      <div className="absolute flex z-10 top-2 right-2 bg-backgroundHeader rounded-3xl">
        {timeIntervals.map((interval) => (
          <button
            key={interval}
            onClick={() => setTimeInterval(interval)}
            className={`${
              timeInterval === interval
                ? 'bg-backgroundSidebar text-pink'
                : 'text-white'
            } px-2 py-2 rounded-3xl text-xs font-medium sm:px-4 sm:text-sm`}
          >
            {interval}
          </button>
        ))}
      </div>
      {loading && (
        <div className="absolute inset-0 z-20 bg-black bg-opacity-20 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
