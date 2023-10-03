import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const usePersistState = <T>(
  initialValue: T,
  localStorageKey: string,
  // eslint-disable-next-line no-unused-vars
  condition?: (value: T) => boolean
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const valueFromLS = localStorage.getItem(localStorageKey);

      if (valueFromLS) {
        const v = JSON.parse(valueFromLS) as T;

        if (condition) {
          if (condition(v)) {
            return v;
          } else {
            localStorage.removeItem(localStorageKey);
          }
        }
      }

      return initialValue;
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
