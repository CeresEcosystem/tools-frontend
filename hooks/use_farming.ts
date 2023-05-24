import { DEMETER_API, HERMES_API, NEW_API_URL } from '@constants/index';
import { TVL, Tab } from '@interfaces/index';
import { formatCurrencyWithDecimals } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

const tabs: Tab[] = [
  { name: 'DEMETER' },
  { name: 'HERMES' },
  { name: 'PSWAP' },
];

const useFarming = () => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].name);
  const [loading, setLoading] = useState(true);
  const tvl = useRef<string>('$0');

  const format = useFormatter();

  const onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedTab(event.currentTarget.value);
  };

  const onTabSelected = useCallback((name: string) => {
    setSelectedTab(name);
  }, []);

  const onFetchError = () => {
    tvl.current = '$0';
    setLoading(false);
  };

  const fetchTVL = (url: string, formatResponse = true) => {
    fetch(url)
    .then(async (response) => {
      if (formatResponse) {
        const json = (await response.json()) as TVL;
        tvl.current = formatCurrencyWithDecimals(format, json.tvl);
      } else {
        const tvlResponse = await response.json();
        tvl.current = formatCurrencyWithDecimals(format, tvlResponse);
      }
      setLoading(false);
    })
    .catch(() => onFetchError());
  }

  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }

    switch (selectedTab) {
      case 'PSWAP':
        fetchTVL(`${NEW_API_URL}/pairs/tvl`, false);
        break;
      case 'DEMETER':
        fetchTVL(`${DEMETER_API}/get-supply-data`);
        break;
      case 'HERMES':
        fetchTVL(`${HERMES_API}/supply/supply-data`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  return {
    tabs,
    selectedTab,
    onChange,
    onTabSelected,
    tvl: tvl.current,
    loading,
  };
};

export default useFarming;
