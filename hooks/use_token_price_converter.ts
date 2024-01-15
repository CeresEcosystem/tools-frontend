import { Currency, Token } from '@interfaces/index';
import { useCallback, useEffect, useState } from 'react';
import { NumberFormatValues, SourceInfo } from 'react-number-format';

const currencies: Currency[] = [
  { currency: 'USD', sign: '$' },
  { currency: 'EUR', sign: '€' },
];

const useTokenPriceConverter = () => {
  const [formData, setFormData] = useState({
    firstValue: '',
    secondValue: '',
  });

  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const [rates, setRates] = useState<number[] | undefined>();

  const [firstToken, setFirstToken] = useState<Token | undefined>();
  const [secondToken, setSecondToken] = useState<Token | undefined>();

  const [result, setResult] = useState(0);

  const calculateTokenPrice = useCallback(
    (value: string, token: Token, otherToken: Token) => {
      if (value !== '' && rates) {
        const currencyRate = rates[selectedCurrency];

        const numberValue = Number(value);
        const valueInCurrency = numberValue * token.price * currencyRate;
        const otherValue = (
          (valueInCurrency / otherToken.price) *
          currencyRate
        ).toString();

        return { v: otherValue, vInCurrency: valueInCurrency };
      }

      return { v: '', vInCurrency: 0 };
    },
    [rates, selectedCurrency]
  );

  const changeCurrency = useCallback(
    (index: number) => {
      if (index !== selectedCurrency) {
        setFormData({ firstValue: '', secondValue: '' });
        setResult(0);
        setSelectedCurrency(index);
      }
    },
    [selectedCurrency]
  );

  const changeFirstToken = (token: Token) => {
    if (token.token !== firstToken?.token) {
      setFirstToken(token);

      if (secondToken) {
        const res = calculateTokenPrice(
          formData.secondValue,
          secondToken,
          token
        );
        setFormData((prevData) => ({
          ...prevData,
          firstValue: res.v,
        }));
        setResult(res.vInCurrency);
      }
    }
  };

  const changeSecondToken = (token: Token) => {
    if (token.token !== secondToken?.token) {
      setSecondToken(token);

      if (firstToken) {
        const res = calculateTokenPrice(formData.firstValue, firstToken, token);
        setFormData((prevData) => ({
          ...prevData,
          secondValue: res.v,
        }));
        setResult(res.vInCurrency);
      }
    }
  };

  const handleFormDataChange = (
    values: NumberFormatValues,
    sourceInfo: SourceInfo
  ) => {
    const { value } = values;

    if (sourceInfo.source === 'event') {
      const { name } = sourceInfo!.event!.currentTarget;

      if (firstToken && secondToken) {
        if (name === 'firstValue') {
          const res = calculateTokenPrice(value, firstToken, secondToken);
          setFormData({
            firstValue: value,
            secondValue: res.v,
          });
          setResult(res.vInCurrency);
        } else {
          const res = calculateTokenPrice(value, secondToken, firstToken);
          setFormData({
            firstValue: res.v,
            secondValue: value,
          });
          setResult(res.vInCurrency);
        }
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  useEffect(() => {
    async function fetchRates() {
      try {
        const responseRates = await Promise.all(
          currencies.map(async (currency) => {
            const response = await fetch(
              `http://localhost:3004/api/currency-rate/${currency.currency}`
            );
            return await response.json();
          })
        );
        setRates(responseRates.map((responseRate) => responseRate['rate']));
      } catch (e) {
        setRates([]);
      }
    }

    fetchRates();
  }, []);

  return {
    formData,
    handleFormDataChange,
    firstToken,
    changeFirstToken,
    secondToken,
    changeSecondToken,
    result,
    currencies,
    currency: currencies[selectedCurrency],
    changeCurrency,
    rates,
  };
};

export default useTokenPriceConverter;
