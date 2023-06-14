import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const usePersistState = <T>(
  initialValue: T,
  localStorageKey: string
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const valueFromLS = localStorage.getItem(localStorageKey);

      return valueFromLS ? (JSON.parse(valueFromLS) as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);

  return [value, setValue];
};

export default usePersistState;
