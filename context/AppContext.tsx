
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  taxRate: number;
  setTaxRate: (rate: number) => void;
  serviceChargeRate: number;
  setServiceChargeRate: (rate: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [taxRate, setTaxRate] = useState(0.05); // 5%
  const [serviceChargeRate, setServiceChargeRate] = useState(0.1); // 10%

  return (
    <AppContext.Provider value={{ taxRate, setTaxRate, serviceChargeRate, setServiceChargeRate }}>
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
