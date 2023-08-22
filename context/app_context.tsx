import { NEW_API_URL } from '@constants/index';
import { AppContextType, Banner } from '@interfaces/index';
import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [banners, setBanners] = useState<Banner[] | null>(null);

  useEffect(() => {
    fetch(`${NEW_API_URL}/banners/desktop`)
      .then(async (response) => {
        const json = await response.json();
        setBanners(json);
      })
      .catch(() => setBanners([]));
  }, []);

  return (
    <AppContext.Provider value={{ banners }}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => useContext(AppContext);
