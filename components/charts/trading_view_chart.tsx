import { NEW_API_URL } from '@constants/index';
import {
  IChartingLibraryWidget,
  ResolutionString,
  TimezoneId,
  widget,
} from '@public/static/charting_library';
import { useEffect, useRef } from 'react';

export default function TradingViewChart({
  symbol,
  changeCurrentToken,
}: {
  symbol: string;
  // eslint-disable-next-line no-unused-vars
  changeCurrentToken: (symbolName: string) => void;
}) {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const tvWidget = useRef<IChartingLibraryWidget | undefined>();

  async function saveChartPreferences(userId: string, chartId: string) {
    try {
      tvWidget.current?.save((state) => {
        const preferencesKey = `chartPreferences_${chartId}`;
        localStorage.setItem(preferencesKey, JSON.stringify(state));
        console.log('Chart preferences saved to local storage');
      });
    } catch (error) {
      console.error('Error saving chart preferences', error);
    }
  }

  function loadChartPreferencesLocally(chartId: string) {
    const preferencesKey = `chartPreferences_${chartId}`;
    const storedPreferences = localStorage.getItem(preferencesKey);

    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);

      tvWidget.current?.load(preferences);
      // Apply the preferences to the TradingView chart here
      console.log('Loaded chart preferences from local storage:', preferences);
    } else {
      console.log('No chart preferences found in local storage.');
    }
  }

  useEffect(() => {
    tvWidget.current = new widget({
      debug: false,
      autosize: true,
      symbol,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        `${NEW_API_URL}/trading`,
        30000
      ),
      interval: '30' as ResolutionString,
      library_path: '/static/charting_library/',
      locale: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimezoneId,
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
    });

    tvWidget.current.onChartReady(() => {
      loadChartPreferencesLocally('chart456');
      tvWidget.current
        ?.activeChart()
        .onSymbolChanged()
        .subscribe(
          null,
          // @ts-ignore
          (symbolName) => changeCurrentToken(symbolName)
        );
      tvWidget.current?.subscribe('study_event', () => {
        saveChartPreferences('user123', 'chart456');
      });
      tvWidget.current?.subscribe('drawing_event', () => {
        saveChartPreferences('user123', 'chart456');
      });
    });

    return () => {
      tvWidget.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  return <div ref={chartContainerRef} className="h-full" />;
}
