import { NEW_API_URL } from '@constants/index';
import { Supply } from '@interfaces/index';

const useSupply = () => {
  const getSupply = async (token?: string): Promise<Supply[]> => {
    if (token) {
      const response = await fetch(`${NEW_API_URL}/tracker/supply/${token}`);

      if (response.ok) {
        return (await response.json()) as Supply[];
      }
    }

    return [];
  };

  return { getSupply };
};

export default useSupply;
