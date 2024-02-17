import { NEW_API_URL } from '@constants/index';
import {
  IChartingLibraryWidget,
  ResolutionString,
  TimezoneId,
  widget,
} from '@public/static/charting_library';
import { useEffect, useMemo, useRef } from 'react';

type Preferences = { [key: string]: object } | null;
type ChartData = { data: any; resolution: ResolutionString };

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

  const savedChart = useMemo<ChartData>(() => {
    const storedPreferences = localStorage.getItem(CHART_PREFERENCES);
    const chartData: ChartData = {
      data: undefined,
      resolution: '30' as ResolutionString,
    };

    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);

      chartData.data = preferences[symbol];

      if (
        preferences[symbol]?.charts &&
        preferences[symbol].charts[0].panes &&
        preferences[symbol].charts[0].panes[0].sources &&
        preferences[symbol].charts[0].panes[0].sources[0].state?.interval
      ) {
        chartData.resolution = preferences[
          symbol
        ].charts[0].panes[0].sources[0].state?.interval?.toString() as ResolutionString;
      }
    }

    return chartData;
  }, [symbol]);

  function saveChartPreferences() {
    try {
      const storedPreferences = localStorage.getItem(CHART_PREFERENCES);
      let preferences: Preferences = null;

      tvWidget.current?.save((state) => {
        const stringState = JSON.stringify(state);

        if (storedPreferences) {
          preferences = JSON.parse(storedPreferences);
          preferences![symbol] = JSON.parse(stringState);
        } else {
          preferences = { [symbol]: JSON.parse(stringState) };
        }

        localStorage.setItem(CHART_PREFERENCES, JSON.stringify(preferences));
      });
    } catch (error) {
      console.error('Error saving chart preferences', error);
    }
  }

  useEffect(() => {
    tvWidget.current = new widget({
      debug: false,
      autosize: true,
      symbol,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        `${NEW_API_URL}/trading`,
        60000
      ),
      interval: savedChart.resolution,
      library_path: '/static/charting_library/',
      auto_save_delay: 2,
      saved_data: savedChart.data,
      locale: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimezoneId,
      container: chartContainerRef.current,
      disabled_features: [
        'header_fullscreen_button',
        'use_localstorage_for_settings',
      ],
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
      tvWidget.current
        ?.activeChart()
        .onSymbolChanged()
        .subscribe(
          null,
          // @ts-ignore
          (symbolName) => changeCurrentToken(symbolName)
        );

      tvWidget.current?.applyOverrides({
        'paneProperties.legendProperties.showVolume': true,
      });

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
