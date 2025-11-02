import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { flags } from '../data/flags';

type SettingsPage = 'appearance' | 'logo' | 'billing' | 'language';

// --- Sub-components for each settings panel ---

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useAppContext();
  const { t } = useLanguage();

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">{t('settings.appearance')}</h3>
      <div className="flex items-center justify-between">
        <label htmlFor="theme-toggle" className="font-medium text-gray-700 dark:text-gray-300">
          {t('settings.darkMode')}
        </label>
        <button
          id="theme-toggle"
          onClick={handleThemeChange}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            theme === 'dark' ? 'bg-brand-primary' : 'bg-gray-200'
          }`}
        >
          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
};

const LogoSettings: React.FC = () => {
  const { logo, setLogo } = useAppContext();
  const { t } = useLanguage();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">{t('settings.logoManagement')}</h3>
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.currentLogo')}</p>
        <div className="p-4 border border-dashed rounded-lg dark:border-gray-600">
          <img src={logo} alt="Current restaurant logo" className="max-h-40 max-w-xs object-contain rounded" />
        </div>
        <div>
          <label htmlFor="logo-upload" className="cursor-pointer bg-brand-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-90 transition-colors">
            {t('settings.uploadLogo')}
          </label>
          <input
            id="logo-upload"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/svg+xml"
            onChange={handleLogoChange}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.logoRecommendation')}</p>
      </div>
    </div>
  );
};

const BillingSettings: React.FC = () => {
  const { taxRate, setTaxRate, serviceChargeRate, setServiceChargeRate } = useAppContext();
  const { t } = useLanguage();

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTaxRate(value / 100);
    }
  };

  const handleServiceChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setServiceChargeRate(value / 100);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">{t('settings.billingConfig')}</h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="taxRate" className="block font-medium text-gray-700 dark:text-gray-300">{t('settings.taxRate')}</label>
          <input
            type="number"
            id="taxRate"
            value={(taxRate * 100).toFixed(2)}
            onChange={handleTaxChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
            min="0"
            step="0.01"
            aria-describedby="tax-description"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id="tax-description">{t('settings.taxDescription')}</p>
        </div>
        <div>
          <label htmlFor="serviceChargeRate" className="block font-medium text-gray-700 dark:text-gray-300">{t('settings.scRate')}</label>
          <input
            type="number"
            id="serviceChargeRate"
            value={(serviceChargeRate * 100).toFixed(2)}
            onChange={handleServiceChargeChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
            min="0"
            step="0.01"
            aria-describedby="sc-description"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id="sc-description">{t('settings.scDescription')}</p>
        </div>
      </div>
    </div>
  );
};

const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'bn', name: 'বাংলা' },
];

const LanguageSettings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">{t('settings.language.title')}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('settings.language.description')}</p>
      <div className="space-y-2">
        {languages.map(({ code, name }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`w-full text-start flex items-center p-3 rounded-md transition-colors ${
              language === code
                ? 'bg-brand-primary bg-opacity-10 dark:bg-opacity-20 border-l-4 border-brand-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <span className="w-8 me-3 flex-shrink-0" dangerouslySetInnerHTML={{ __html: flags[code] || '' }} />
            <span className={`font-medium ${language === code ? 'text-brand-primary dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{name}</span>
            {language === code && (
              <svg className="ms-auto h-6 w-6 text-brand-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Sidebar ---

const sidebarIcons = {
    appearance: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
    ),
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ),
    billing: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    ),
    language: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m0 0a9 9 0 019-9m-9 9a9 9 0 009 9" /></svg>
    ),
};

const iconColors: { [key in SettingsPage]: string } = {
  appearance: 'text-purple-500',
  logo: 'text-green-500',
  billing: 'text-sky-500',
  language: 'text-amber-500',
};

const SidebarItem: React.FC<{
  page: SettingsPage;
  label: string;
  currentPage: SettingsPage;
  setCurrentPage: (page: SettingsPage) => void;
}> = ({ page, label, currentPage, setCurrentPage }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-start transition-colors ${
        isActive
          ? 'bg-brand-primary text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-brand-secondary hover:text-white'
      }`}
    >
        <span className={isActive ? 'text-white' : iconColors[page]}>{sidebarIcons[page]}</span>
        <span className="font-medium">{label}</span>
    </button>
  );
};

// --- Main Settings Component ---

const Settings: React.FC = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<SettingsPage>('appearance');

  const renderContent = () => {
    switch (currentPage) {
      case 'appearance': return <AppearanceSettings />;
      case 'logo': return <LogoSettings />;
      case 'billing': return <BillingSettings />;
      case 'language': return <LanguageSettings />;
      default: return null;
    }
  };

  const sidebarItems: { page: SettingsPage, label: string }[] = [
    { page: 'appearance', label: t('settings.sidebar.appearance') },
    { page: 'logo', label: t('settings.sidebar.logo') },
    { page: 'billing', label: t('settings.sidebar.billing') },
    { page: 'language', label: t('settings.sidebar.language') },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif">{t('settings.title')}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-brand-surface dark:bg-brand-surface-dark p-4 rounded-lg shadow-md space-y-2">
            {sidebarItems.map(item => (
              <SidebarItem
                key={item.page}
                page={item.page}
                label={item.label}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            ))}
          </div>
        </aside>
        <main className="flex-grow bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Settings;