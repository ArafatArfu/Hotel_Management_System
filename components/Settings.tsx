import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLanguage, Language, Currency } from '../context/LanguageContext';
import { flags } from '../data/flags';

type SettingsPage = 'appearance' | 'logo' | 'billing' | 'language';
type Theme = 'light' | 'dark';

// --- Reusable Confirmation Dialog ---
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-brand-surface-dark p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('common.cancel')}</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-opacity-90">{t('common.confirm')}</button>
        </div>
      </div>
    </div>
  );
};

// --- Props for controlled sub-components ---
interface AppearanceSettingsProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}
interface BillingSettingsProps {
  taxRate: number;
  serviceChargeRate: number;
  currency: Currency;
  onRateChange: (key: 'taxRate' | 'serviceChargeRate', value: number) => void;
  onCurrencyChange: (currency: Currency) => void;
}

// --- Sub-components for each settings panel ---

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, onChange }) => {
  const { t } = useLanguage();
  const handleThemeChange = () => {
    onChange(theme === 'light' ? 'dark' : 'light');
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

const BillingSettings: React.FC<BillingSettingsProps> = ({ taxRate, serviceChargeRate, currency, onRateChange, onCurrencyChange }) => {
  const { t } = useLanguage();

  const currencies: { code: string; symbol: string; name: string }[] = [
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  ];

  const handleRateChange = (key: 'taxRate' | 'serviceChargeRate', value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onRateChange(key, numericValue / 100);
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = currencies.find(c => c.code === e.target.value);
    if (selectedCurrency) {
      onCurrencyChange({ code: selectedCurrency.code, symbol: selectedCurrency.symbol });
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
            onChange={(e) => handleRateChange('taxRate', e.target.value)}
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
            onChange={(e) => handleRateChange('serviceChargeRate', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
            min="0"
            step="0.01"
            aria-describedby="sc-description"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id="sc-description">{t('settings.scDescription')}</p>
        </div>
        <div>
          <label htmlFor="currency" className="block font-medium text-gray-700 dark:text-gray-300">{t('settings.currency.title')}</label>
          <select
            id="currency"
            value={currency.code}
            onChange={handleCurrencyChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
            aria-describedby="currency-description"
          >
            {currencies.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}
          </select>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id="currency-description">{t('settings.currency.description')}</p>
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

const SidebarItem: React.FC<{ page: SettingsPage; label: string; currentPage: SettingsPage; setCurrentPage: (page: SettingsPage) => void; }> = ({ page, label, currentPage, setCurrentPage }) => {
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
  const { theme, setTheme, taxRate, setTaxRate, serviceChargeRate, setServiceChargeRate } = useAppContext();
  const { currency, setCurrency } = useLanguage();
  
  const [currentPage, setCurrentPage] = useState<SettingsPage>('appearance');
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [pendingSettings, setPendingSettings] = useState({
    theme,
    taxRate,
    serviceChargeRate,
    currency,
  });

  // Effect to sync pending state if context changes from elsewhere
  useEffect(() => {
    setPendingSettings({ theme, taxRate, serviceChargeRate, currency });
  }, [theme, taxRate, serviceChargeRate, currency]);

  // Effect to check if there are any changes
  useEffect(() => {
    const hasChanges =
      pendingSettings.theme !== theme ||
      pendingSettings.taxRate !== taxRate ||
      pendingSettings.serviceChargeRate !== serviceChargeRate ||
      pendingSettings.currency.code !== currency.code;
    setIsDirty(hasChanges);
  }, [pendingSettings, theme, taxRate, serviceChargeRate, currency]);

  const handlePendingChange = <K extends keyof typeof pendingSettings>(key: K, value: (typeof pendingSettings)[K]) => {
    setPendingSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDiscard = () => {
    setPendingSettings({ theme, taxRate, serviceChargeRate, currency });
  };
  
  const handleSave = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setTheme(pendingSettings.theme);
    setTaxRate(pendingSettings.taxRate);
    setServiceChargeRate(pendingSettings.serviceChargeRate);
    setCurrency(pendingSettings.currency);
    setIsConfirmOpen(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'appearance': 
        return <AppearanceSettings 
                    theme={pendingSettings.theme} 
                    onChange={(newTheme) => handlePendingChange('theme', newTheme)} 
               />;
      case 'logo': 
        return <LogoSettings />;
      case 'billing': 
        return <BillingSettings 
                    taxRate={pendingSettings.taxRate}
                    serviceChargeRate={pendingSettings.serviceChargeRate}
                    currency={pendingSettings.currency}
                    onRateChange={(key, value) => handlePendingChange(key, value)}
                    onCurrencyChange={(newCurrency) => handlePendingChange('currency', newCurrency)}
               />;
      case 'language': 
        return <LanguageSettings />;
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
              <SidebarItem key={item.page} page={item.page} label={item.label} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            ))}
          </div>
        </aside>
        <main className="flex-grow bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md relative pb-20">
          {renderContent()}
          
          {isDirty && ['appearance', 'billing'].includes(currentPage) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-brand-surface dark:bg-brand-surface-dark border-t dark:border-gray-700">
                <div className="flex justify-end items-center gap-4 max-w-4xl mx-auto">
                    <button onClick={handleDiscard} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">{t('settings.discardChanges')}</button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-medium bg-brand-primary text-white rounded-md shadow hover:bg-opacity-90">{t('settings.saveChanges')}</button>
                </div>
            </div>
          )}
        </main>
      </div>
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title={t('settings.unsavedChanges.title')}
        message={t('settings.unsavedChanges.message')}
      />
    </div>
  );
};

export default Settings;