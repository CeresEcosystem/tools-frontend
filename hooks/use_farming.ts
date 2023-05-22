import { DEMETER_API, HERMES_API } from '@constants/index';
import { TVL, Tab } from '@interfaces/index';
import { formatCurrencyWithDecimals } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

const tabs: Tab[] = [
  { name: 'PSWAP' },
  { name: 'DEMETER' },
  { name: 'HERMES' },
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

  const fetchPSWAPTVL = useCallback(() => {
    // TODO: Pozvati novi api kad bude gotov za dobijanje TVL-a
  }, []);

  const fetchDemeterTVL = () => {
    fetch(`${DEMETER_API}/get-supply-data`)
      .then(async (response) => {
        const json = (await response.json()) as TVL;
        tvl.current = formatCurrencyWithDecimals(format, json.tvl);
        setLoading(false);
      })
      .catch(() => onFetchError());
  };

  const fetchHermesTVL = () => {
    fetch(`${HERMES_API}/supply/supply-data`)
      .then(async (response) => {
        const json = (await response.json()) as TVL;
        tvl.current = formatCurrencyWithDecimals(format, json.tvl);
        setLoading(false);
      })
      .catch(() => onFetchError());
  };

  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }

    switch (selectedTab) {
      case 'PSWAP':
        fetchPSWAPTVL();
        break;
      case 'DEMETER':
        fetchDemeterTVL();
        break;
      case 'HERMES':
        fetchHermesTVL();
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
