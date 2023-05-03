import { API } from '@constants/index';
import { createContext, useContext, useEffect, useState } from 'react';

interface Banner {
  sm: string;
  md: string;
  lg: string;
  link: string;
  title: string;
}

interface AppContextType {
  banners: Banner[];
}

const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetch(`${API}/banners`)
      .then(async (response) => {
        const json = await response.json();
        setBanners(json);
      })
      .catch(() => {});
  }, []);

  return (
    <AppContext.Provider value={{ banners }}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => useContext(AppContext);
