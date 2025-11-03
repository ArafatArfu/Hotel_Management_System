import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations';

export type Language = 'en' | 'ar' | 'es' | 'fr' | 'bn';

export interface Currency {
  code: string; // e.g. 'BDT', 'USD'
  symbol: string; // e.g. '৳', '$'
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedTranslation = (language: Language, key: string): string | undefined => {
  return key.split('.').reduce((obj: any, k: string) => {
    return obj?.[k]?.[language] ?? obj?.[k];
  }, translations);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      return JSON.parse(savedCurrency);
    }
    return { code: 'BDT', symbol: '৳' }; // Default currency
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    let translation = getNestedTranslation(language, key);

    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found.`);
      // Fallback to English if translation is missing
      translation = getNestedTranslation('en', key) || key;
    }

    if (options && typeof translation === 'string') {
      Object.keys(options).forEach(k => {
        translation = translation!.replace(`{${k}}`, String(options[k]));
      });
    }

    return translation || key;
  }, [language]);

  const formatCurrency = useCallback((value: number) => {
    if (currency.code === 'BDT') {
      // Special handling for BDT to ensure the '৳' symbol is used, as Intl can be inconsistent.
      return new Intl.NumberFormat(language, { style: 'currency', currency: 'BDT' }).format(value).replace('BDT', '৳');
    }
    return new Intl.NumberFormat(language, { style: 'currency', currency: currency.code }).format(value);
  }, [language, currency]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currency, setCurrency, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
