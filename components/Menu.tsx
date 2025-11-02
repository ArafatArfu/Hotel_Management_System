import React, { useState, useMemo } from 'react';
import type { MenuItem } from '../types';
import { Category, Status } from '../types';
import MenuItemModal from './MenuItemModal';

interface MenuItemCardProps {
  item: MenuItem;
  isAdmin: boolean;
  onImageChange: (itemId: number, file: File) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isAdmin, onImageChange, onEdit, onDelete }) => {
  const getPlaceholderUrl = () => {
    return `https://via.placeholder.com/400x240.png/5D4037/FFFFFF?text=${encodeURIComponent(item.name)}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; 
    target.src = getPlaceholderUrl();
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(item.id, e.target.files[0]);
    }
  };

  return (
    <div className="bg-brand-surface dark:bg-brand-surface-dark rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 flex flex-col group">
      <div className="relative">
        <img
          src={item.imageUrl || getPlaceholderUrl()}
          alt={item.name}
          className="w-full h-40 object-cover bg-gray-200 dark:bg-gray-700"
          onError={handleImageError}
        />
        {isAdmin && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex justify-center items-center">
                <label htmlFor={`upload-${item.id}`} className="cursor-pointer bg-white text-brand-primary px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Upload Image
                </label>
                <input 
                    type="file" 
                    id={`upload-${item.id}`} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-bold text-brand-primary dark:text-gray-100">{item.name}</h4>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
            item.status === Status.AVAILABLE ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
          }`}>
            {item.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.category}</p>
        <div className="mt-auto pt-2 flex justify-between items-center">
          <p className="text-xl font-bold text-brand-secondary dark:text-gray-300">৳{item.price.toFixed(2)}</p>
          {isAdmin && (
            <div className="space-x-2">
                <button onClick={() => onEdit(item)} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(item.id)} className="text-xs text-red-600 hover:underline">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface MenuProps {
  menuItems: MenuItem[];
  isAdmin: boolean;
  onImageChange: (itemId: number, file: File) => void;
  onAdd: (item: Omit<MenuItem, 'id'>) => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (itemId: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, isAdmin, onImageChange, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = ['All', ...Object.values(Category)];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, menuItems]);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const handleSave = (item: Omit<MenuItem, 'id'> | MenuItem) => {
    if ('id' in item) {
        onUpdate(item);
    } else {
        onAdd(item as Omit<MenuItem, 'id'>);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif">Our Menu</h2>
        {isAdmin && (
            <button onClick={handleAddNew} className="bg-brand-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-90">
                Add New Item
            </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search for a dish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as Category | 'All')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-brand-primary text-white'
                : 'bg-brand-surface dark:bg-brand-surface-dark dark:text-gray-200 hover:bg-brand-secondary hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => <MenuItemCard key={item.id} item={item} isAdmin={isAdmin} onImageChange={onImageChange} onEdit={handleEdit} onDelete={onDelete} />)
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No menu items match your criteria.</p>
        )}
      </div>
      {isModalOpen && <MenuItemModal item={editingItem} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
    </div>
  );
};

export default Menu;