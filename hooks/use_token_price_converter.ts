import { Token } from '@interfaces/index';
import { ChangeEvent, useState } from 'react';

const useTokenPriceConverter = () => {
  const [formData, setFormData] = useState({
    firstValue: '',
    secondValue: '',
  });

  const [firstToken, setFirstToken] = useState<Token | undefined>();
  const [secondToken, setSecondToken] = useState<Token | undefined>();

  const [result, setResult] = useState(0);

  const calculateTokenPrice = (
    value: string,
    token: Token,
    otherToken: Token
  ) => {
    if (value !== '') {
      const numberValue = Number(value);
      const valueInCurrency = numberValue * token.price;
      const otherValue = (valueInCurrency / otherToken.price).toString();

      return { v: otherValue, vInCurrency: valueInCurrency };
    }

    return { v: '', vInCurrency: 0 };
  };

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

  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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
  };

  return {
    formData,
    handleFormDataChange,
    firstToken,
    changeFirstToken,
    secondToken,
    changeSecondToken,
    result,
  };
};

export default useTokenPriceConverter;
