import React from 'react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
  const { taxRate, setTaxRate, serviceChargeRate, setServiceChargeRate, logo, setLogo, theme, setTheme } = useAppContext();

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
  
  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif">Settings</h2>
      <div className="bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="space-y-8">
          
          <div>
            <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">Appearance</h3>
            <div className="flex items-center justify-between">
              <label htmlFor="theme-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark Mode
              </label>
              <button
                id="theme-toggle"
                onClick={handleThemeChange}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  theme === 'dark' ? 'bg-brand-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">Logo Management</h3>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Logo:</p>
              <div className="p-4 border border-dashed rounded-lg dark:border-gray-600">
                <img src={logo} alt="Current restaurant logo" className="max-h-40 max-w-xs object-contain bg-white rounded" />
              </div>
              <div>
                <label htmlFor="logo-upload" className="cursor-pointer bg-brand-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-90 transition-colors">
                  Upload New Logo
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoChange}
                />
              </div>
               <p className="text-xs text-gray-500 dark:text-gray-400">Recommended format: PNG with transparent background.</p>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">Billing Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rate (%)</label>
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
                 <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id="tax-description">This rate is applied to the subtotal of all new orders.</p>
              </div>
              <div>
                <label htmlFor="serviceChargeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Charge Rate (%)</label>
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
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id="sc-description">This rate is applied to the subtotal when enabled on a new order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;