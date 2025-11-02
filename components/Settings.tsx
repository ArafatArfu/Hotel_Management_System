import React from 'react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
  const { taxRate, setTaxRate, serviceChargeRate, setServiceChargeRate, logo, setLogo } = useAppContext();

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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-primary font-serif">Settings</h2>
      <div className="bg-brand-surface p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="space-y-8">
          
          <div>
            <h3 className="text-xl font-bold text-brand-primary font-serif mb-4 border-b pb-2">Logo Management</h3>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-600">Current Logo:</p>
              <div className="p-4 border border-dashed rounded-lg">
                <img src={logo} alt="Current restaurant logo" className="max-h-40 max-w-xs object-contain" />
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
               <p className="text-xs text-gray-500">Recommended format: PNG with transparent background.</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-brand-primary font-serif mb-4 border-b pb-2">Billing Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                <input
                  type="number"
                  id="taxRate"
                  value={(taxRate * 100).toFixed(2)}
                  onChange={handleTaxChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
                  min="0"
                  step="0.01"
                  aria-describedby="tax-description"
                />
                 <p className="mt-2 text-sm text-gray-500" id="tax-description">This rate is applied to the subtotal of all new orders.</p>
              </div>
              <div>
                <label htmlFor="serviceChargeRate" className="block text-sm font-medium text-gray-700">Service Charge Rate (%)</label>
                <input
                  type="number"
                  id="serviceChargeRate"
                  value={(serviceChargeRate * 100).toFixed(2)}
                  onChange={handleServiceChargeChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
                  min="0"
                  step="0.01"
                  aria-describedby="sc-description"
                />
                <p className="mt-2 text-sm text-gray-500" id="sc-description">This rate is applied to the subtotal when enabled on a new order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;