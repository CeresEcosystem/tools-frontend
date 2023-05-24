import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  widget,
} from '@public/static/charting_library';
import { useEffect, useRef } from 'react';

export default function TradingViewChart() {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      debug: false,
      autosize: true,
      // timezone: 'Europe/Paris',
      symbol: 'AAPL',
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        'https://demo_feed.tradingview.com',
        undefined,
        {
          maxResponseLength: 1000,
          expectedOrder: 'latestFirst',
        }
      ),
      interval: '30' as ResolutionString,
      library_path: '/static/charting_library/',
      locale: 'en',
      charts_storage_api_version: '1.1',
      container: chartContainerRef.current,
      disabled_features: ['use_localstorage_for_settings'],
      loading_screen: {
        backgroundColor: 'rgb(43, 10, 57)',
      },
      custom_css_url: '/static/charting_library/themed.css',
      time_frames: [
        {
          text: '2d',
          resolution: '30' as ResolutionString,
          description: '2d',
          title: '2D',
        },
        {
          text: '1M',
          resolution: '30' as ResolutionString,
          description: 'All',
          title: 'All',
        },
      ],

      overrides: {
        'mainSeriesProperties.style': 8,
        'paneProperties.background': 'rgb(43, 10, 57)',
        'paneProperties.vertGridProperties.color': 'rgba(255, 255, 255, 0.05)',
        'paneProperties.horzGridProperties.color': 'rgba(255, 255, 255, 0.05)',
        'symbolWatermarkProperties.transparency': 0,
        'scalesProperties.textColor': '#fff',
        'mainSeriesProperties.haStyle.upColor': '#4dd0e1',
        'mainSeriesProperties.haStyle.downColor': '#ed145b',
        'mainSeriesProperties.haStyle.drawWick': true,
        'mainSeriesProperties.haStyle.drawBorder': true,
        'mainSeriesProperties.haStyle.borderColor': '#4dd0e1',
        'mainSeriesProperties.haStyle.borderUpColor': '#4dd0e1',
        'mainSeriesProperties.haStyle.borderDownColor': '#ed145b',
        'mainSeriesProperties.haStyle.wickColor': '#4dd0e1',
        'mainSeriesProperties.haStyle.wickUpColor': '#4dd0e1',
        'mainSeriesProperties.haStyle.wickDownColor': '#ed145b',
        'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.hiloStyle.color': '#000',
      },
      symbol_search_request_delay: 600,
    };

    const tvWidget = new widget(widgetOptions);

    return () => {
      tvWidget.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="h-full" />;
}
