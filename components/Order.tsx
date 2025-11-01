
import React, { useState, useMemo, useCallback } from 'react';
import { menuItems } from '../data/menu';
import type { Order as OrderType, OrderItem, MenuItem } from '../types';
import { Category, Status } from '../types';
import ReceiptModal from './ReceiptModal';
import { useAppContext } from '../context/AppContext';

interface OrderProps {
  addOrder: (newOrder: OrderType) => void;
}

const Order: React.FC<OrderProps> = ({ addOrder }) => {
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [discount, setDiscount] = useState(0);
  const [useServiceCharge, setUseServiceCharge] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [finalizedOrder, setFinalizedOrder] = useState<OrderType | null>(null);
  
  const { taxRate, serviceChargeRate } = useAppContext();
  
  const categories = ['All', ...Object.values(Category)];

  const availableMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const isAvailable = item.status === Status.AVAILABLE;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return isAvailable && matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

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

  const MenuItemCard: React.FC<{ item: MenuItem; onAdd: () => void }> = ({ item, onAdd }) => (
    <div className="bg-brand-surface rounded-lg shadow flex flex-col justify-between p-3 cursor-pointer hover:shadow-lg" onClick={onAdd}>
        <div>
          <h4 className="font-bold text-brand-primary">{item.name}</h4>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>
        <p className="text-lg font-semibold text-brand-secondary mt-1 self-end">৳{item.price}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Menu Selection */}
      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-2xl font-bold text-brand-primary font-serif">Add Items to Order</h2>
        <input
          type="text"
          placeholder="Search for a dish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as Category | 'All')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${selectedCategory === category ? 'bg-brand-primary text-white' : 'bg-white hover:bg-brand-secondary hover:text-white'}`}>
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {availableMenuItems.map(item => (
            <MenuItemCard key={item.id} item={item} onAdd={() => addToOrder(item)} />
          ))}
        </div>
      </div>

      {/* Current Order */}
      <div className="lg:col-span-2 bg-brand-surface p-4 rounded-lg shadow-md flex flex-col h-fit sticky top-24">
        <h2 className="text-2xl font-bold text-brand-primary font-serif mb-4 border-b pb-2">Current Bill</h2>
        <div className="flex-grow space-y-2 max-h-[40vh] overflow-y-auto pr-2">
          {currentOrderItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items added yet.</p>
          ) : (
            currentOrderItems.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">৳{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                    className="w-16 text-center border rounded border-gray-300 bg-white text-gray-900 p-1 focus:ring-brand-primary focus:border-brand-primary"
                  />
                  <p className="w-20 text-right font-semibold text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-800"><span>Subtotal</span><span>৳{calculations.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between items-center">
            <label className="text-gray-800">Discount</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 text-right border rounded p-1 border-gray-300 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div className="flex justify-between text-gray-800"><span>Tax ({taxRate * 100}%)</span><span>৳{calculations.tax.toFixed(2)}</span></div>
           <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-gray-800">
              <input type="checkbox" checked={useServiceCharge} onChange={(e) => setUseServiceCharge(e.target.checked)} className="rounded text-brand-primary focus:ring-brand-primary"/>
              Service Charge ({serviceChargeRate * 100}%)
            </label>
            <span className="text-gray-800">৳{calculations.serviceCharge.toFixed(2)}</span>
          </div>
          <div className="border-t mt-2 pt-2 text-xl font-bold flex justify-between text-brand-primary">
            <span>Grand Total</span>
            <span>৳{calculations.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={handleGenerateReceipt} 
          disabled={currentOrderItems.length === 0}
          className="w-full mt-4 bg-brand-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 disabled:bg-gray-400">
            Generate Receipt
        </button>
      </div>
      {showReceipt && finalizedOrder && (
        <ReceiptModal order={finalizedOrder} onClose={() => setShowReceipt(false)} onConfirm={handleConfirmOrder} />
      )}
    </div>
  );
};

export default Order;