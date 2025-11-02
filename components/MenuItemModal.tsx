import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../types';
import { Category, Status } from '../types';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose, onSave }) => {
    const initialFormState = {
        name: '',
        category: Category.CHICKEN,
        price: 0,
        status: Status.AVAILABLE,
        imageUrl: '',
    };
    
  const [formData, setFormData] = useState({ ...initialFormState });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price,
        status: item.status,
        imageUrl: item.imageUrl,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onSave({ ...item, ...formData });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{item ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary">
              {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (৳)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary">
              <option value={Status.AVAILABLE}>Available</option>
              <option value={Status.NOT_AVAILABLE}>Not Available</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;
