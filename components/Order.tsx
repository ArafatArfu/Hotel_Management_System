import React, { useState, useMemo, useCallback } from 'react';
import type { Order as OrderType, OrderItem, MenuItem } from '../types';
import { Category, Status } from '../types';
import ReceiptModal from './ReceiptModal';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface OrderProps {
  addOrder: (newOrder: OrderType) => void;
  menuItems: MenuItem[];
}

const Order: React.FC<OrderProps> = ({ addOrder, menuItems }) => {
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [discount, setDiscount] = useState(0);
  const [useServiceCharge, setUseServiceCharge] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [finalizedOrder, setFinalizedOrder] = useState<OrderType | null>(null);
  
  const { taxRate, serviceChargeRate, logo } = useAppContext();
  const { t, formatCurrency } = useLanguage();

  const categories = ['All', ...Object.values(Category)];

  const availableMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const isAvailable = item.status === Status.AVAILABLE;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return isAvailable && matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, menuItems]);

  const addToOrder = (item: MenuItem) => {
    setCurrentOrderItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCurrentOrderItems(prevItems => prevItems.filter(i => i.id !== itemId));
    } else {
      setCurrentOrderItems(prevItems => prevItems.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i));
    }
  };

  const calculations = useMemo(() => {
    const subtotal = currentOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const serviceCharge = useServiceCharge ? subtotal * serviceChargeRate : 0;
    const grandTotal = subtotal + tax - discount + serviceCharge;
    return { subtotal, tax, serviceCharge, grandTotal };
  }, [currentOrderItems, discount, useServiceCharge, taxRate, serviceChargeRate]);

  const handleGenerateReceipt = () => {
    if (currentOrderItems.length === 0) return;
    const orderToFinalize: OrderType = {
      id: `#${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString(),
      items: currentOrderItems,
      subtotal: calculations.subtotal,
      tax: calculations.tax,
      discount: discount,
      serviceCharge: calculations.serviceCharge,
      grandTotal: calculations.grandTotal,
    };
    setFinalizedOrder(orderToFinalize);
    setShowReceipt(true);
  };

  const handleConfirmOrder = () => {
    if (finalizedOrder) {
      addOrder(finalizedOrder);
      setCurrentOrderItems([]);
      setDiscount(0);
      setUseServiceCharge(false);
      setShowReceipt(false);
      setFinalizedOrder(null);
    }
  };

  const MenuItemCard: React.FC<{ item: MenuItem; onAdd: () => void }> = ({ item, onAdd }) => {
    const getPlaceholderUrl = () => {
      return `https://via.placeholder.com/128x128.png/5D4037/FFFFFF?text=${encodeURIComponent(item.name)}`;
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null; // Prevents infinite loops
      target.src = getPlaceholderUrl();
    };

    return (
      <div className="bg-brand-surface dark:bg-brand-surface-dark rounded-lg shadow flex items-center p-2 cursor-pointer hover:shadow-lg transition-shadow" onClick={onAdd}>
          <img 
            src={item.imageUrl || getPlaceholderUrl()} 
            alt={item.name} 
            className="w-16 h-16 object-cover rounded-md me-3 bg-gray-200 dark:bg-gray-700"
            onError={handleImageError} 
          />
          <div className="flex-grow">
            <h4 className="font-bold text-brand-primary dark:text-gray-100 text-sm">{item.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
            <p className="text-md font-semibold text-brand-secondary dark:text-gray-300 mt-1">{formatCurrency(item.price)}</p>
          </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Menu Selection */}
      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-2xl font-bold text-brand-primary dark:text-gray-100 font-serif">{t('order.title')}</h2>
        <input
          type="text"
          placeholder={t('menu.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as Category | 'All')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${selectedCategory === category ? 'bg-brand-primary text-white' : 'bg-white dark:bg-brand-surface-dark dark:text-gray-200 hover:bg-brand-secondary hover:text-white'}`}>
              {category === 'All' ? t('menu.all') : category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pe-2">
          {availableMenuItems.map(item => (
            <MenuItemCard key={item.id} item={item} onAdd={() => addToOrder(item)} />
          ))}
        </div>
      </div>

      {/* Current Order */}
      <div className="lg:col-span-2 bg-brand-surface dark:bg-brand-surface-dark p-4 rounded-lg shadow-md flex flex-col h-fit sticky top-24">
        <h2 className="text-2xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4 border-b dark:border-gray-700 pb-2">{t('order.currentBill')}</h2>
        <div className="flex-grow space-y-2 max-h-[40vh] overflow-y-auto pe-2">
          {currentOrderItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('order.noItems')}</p>
          ) : (
            currentOrderItems.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                    className="w-16 text-center border rounded border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 p-1 focus:ring-brand-primary focus:border-brand-primary"
                  />
                  <p className="w-20 text-right font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item.price * item.quantity)}</p>
                  <button 
                    onClick={() => updateQuantity(item.id, 0)} 
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="border-t dark:border-gray-700 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-800 dark:text-gray-200"><span>{t('order.subtotal')}</span><span>{formatCurrency(calculations.subtotal)}</span></div>
          <div className="flex justify-between items-center">
            <label className="text-gray-800 dark:text-gray-200">{t('order.discount')}</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 text-right border rounded p-1 border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div className="flex justify-between text-gray-800 dark:text-gray-200"><span>{t('order.tax', { rate: (taxRate * 100).toFixed(0) })}</span><span>{formatCurrency(calculations.tax)}</span></div>
           <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <input type="checkbox" checked={useServiceCharge} onChange={(e) => setUseServiceCharge(e.target.checked)} className="rounded text-brand-primary focus:ring-brand-primary"/>
              {t('order.serviceCharge', { rate: (serviceChargeRate * 100).toFixed(0) })}
            </label>
            <span className="text-gray-800 dark:text-gray-200">{formatCurrency(calculations.serviceCharge)}</span>
          </div>
          <div className="border-t dark:border-gray-700 mt-2 pt-2 text-xl font-bold flex justify-between text-brand-primary dark:text-gray-100">
            <span>{t('order.grandTotal')}</span>
            <span>{formatCurrency(calculations.grandTotal)}</span>
          </div>
        </div>

        <button 
          onClick={handleGenerateReceipt} 
          disabled={currentOrderItems.length === 0}
          className="w-full mt-4 bg-brand-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 disabled:bg-gray-400 dark:disabled:bg-gray-600">
            {t('order.generateReceipt')}
        </button>
      </div>
      {showReceipt && finalizedOrder && (
        <ReceiptModal order={finalizedOrder} logo={logo} onClose={() => setShowReceipt(false)} onConfirm={handleConfirmOrder} />
      )}
    </div>
  );
};

export default Order;