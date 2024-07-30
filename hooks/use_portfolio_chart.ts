import { NEW_API_URL } from '@constants/index';
import { UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

type ChartData = { time: UTCTimestamp; value: number };

const timeIntervals = ['5m', '15m', '30m', '1h', '4h', '1D', 'All'];

const CACHE_DURATION = 5 * 60;

function getPastTimestamp(now: number, intervalInMinutes: number) {
  return now - intervalInMinutes * 60;
}

function getFromResolution(now: number, timeInterval: string) {
  switch (timeInterval) {
    case '5m':
      return { resolution: '5', from: getPastTimestamp(now, 1440) };
    case '15m':
      return { resolution: '15', from: getPastTimestamp(now, 1440) };
    case '30m':
      return { resolution: '30', from: getPastTimestamp(now, 2880) };
    case '1h':
      return { resolution: '60', from: getPastTimestamp(now, 2880) };
    case '4h':
      return { resolution: '4h', from: getPastTimestamp(now, 14400) };
    case '1D':
      return { resolution: '1d', from: getPastTimestamp(now, 129600) };
    case 'All':
      return { resolution: '1D', from: 1 };
    default:
      return { resolution: '1D', from: 1 };
  }
}

const usePortfolioChart = (walletAddress: string) => {
  const [timeInterval, setTimeInterval] = useState(timeIntervals[0]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const cacheRef = useRef<{
    [key: string]: { data: ChartData[]; timestamp: number };
  }>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

  useEffect(() => {
    setLoading(true);

    async function fetchChartData() {
      const now = Math.floor(Date.now() / 1000);
      const timeData = getFromResolution(now, timeInterval);
      const cacheKey = `${walletAddress}-${timeInterval}`;
      const cached = cacheRef.current[cacheKey];

      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setChartData(cached.data);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${NEW_API_URL}/portfolio/${walletAddress}/history?resolution=${timeData.resolution}&from=${timeData.from}&to=${now}`
      );

      if (response.ok) {
        const data = await response.json();
        setChartData(data);
        cacheRef.current[cacheKey] = { data, timestamp: now };
        setLoading(false);
      } else {
        setChartData([]);
        setLoading(false);
      }
    }

    fetchChartData();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchChartData();
      cacheRef.current = {};
    }, CACHE_DURATION * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeInterval, walletAddress]);

  return { timeInterval, timeIntervals, setTimeInterval, loading, chartData };
};

export default usePortfolioChart;
