import React, { createContext, useContext, useState } from 'react';
import { initialLogo } from '../data/logo';

type Theme = 'light' | 'dark';

interface AppContextType {
  taxRate: number;
  setTaxRate: (rate: number) => void;
  serviceChargeRate: number;
  setServiceChargeRate: (rate: number) => void;
  logo: string;
  setLogo: (logo: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [taxRate, setTaxRate] = useState(0.05); // 5%
  const [serviceChargeRate, setServiceChargeRate] = useState(0.1); // 10%
  const [logo, setLogo] = useState(initialLogo);
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const setTheme = (theme: Theme) => {
    setThemeState(theme);
    localStorage.setItem('theme', theme);
  };


  return (
    <AppContext.Provider value={{ taxRate, setTaxRate, serviceChargeRate, setServiceChargeRate, logo, setLogo, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};