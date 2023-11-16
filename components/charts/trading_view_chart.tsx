import { NEW_API_URL } from '@constants/index';
import {
  IChartingLibraryWidget,
  ResolutionString,
  TimezoneId,
  widget,
} from '@public/static/charting_library';
import { useEffect, useRef } from 'react';

type Preferences = { [key: string]: object } | null;

const CHART_PREFERENCES = 'CHART_PREFERENCES';

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

  function saveChartPreferences() {
    try {
      const storedPreferences = localStorage.getItem(CHART_PREFERENCES);
      let preferences: Preferences = null;

      tvWidget.current?.save((state) => {
        const stringState = JSON.stringify(state);
        const stateFormatted = stringState.replaceAll('POLKASWAP:', '');

        if (storedPreferences) {
          preferences = JSON.parse(storedPreferences);
          preferences![symbol] = JSON.parse(stateFormatted);
        } else {
          preferences = { [symbol]: JSON.parse(stateFormatted) };
        }

        localStorage.setItem(CHART_PREFERENCES, JSON.stringify(preferences));
      });
    } catch (error) {
      console.error('Error saving chart preferences', error);
    }
  }

  function loadChartPreferences() {
    const storedPreferences = localStorage.getItem(CHART_PREFERENCES);

    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);

      if (preferences[symbol]) {
        tvWidget.current?.load(preferences[symbol]);
      }
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
      auto_save_delay: 2,
      locale: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimezoneId,
      container: chartContainerRef.current,
      disabled_features: ['header_fullscreen_button'],
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
      loadChartPreferences();

      tvWidget.current
        ?.activeChart()
        .onSymbolChanged()
        .subscribe(
          null,
          // @ts-ignore
          (symbolName) => changeCurrentToken(symbolName)
        );

      tvWidget.current?.subscribe('onAutoSaveNeeded', () => {
        saveChartPreferences();
      });
    });

    return () => {
      tvWidget.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  return <div ref={chartContainerRef} className="h-full" />;
}
