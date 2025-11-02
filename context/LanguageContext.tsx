import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations';

export type Language = 'en' | 'ar' | 'es' | 'fr' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
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

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
