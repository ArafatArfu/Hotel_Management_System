
import React, { useState, useMemo } from 'react';
import { menuItems } from '../data/menu';
import type { MenuItem } from '../types';
import { Category, Status } from '../types';

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <div className="bg-brand-surface rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
    <div className="p-4">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-bold text-brand-primary">{item.name}</h4>
        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
          item.status === Status.AVAILABLE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{item.category}</p>
      <p className="text-xl font-bold text-brand-secondary mt-2">৳{item.price.toFixed(2)}</p>
    </div>
  </div>
);

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const categories = ['All', ...Object.values(Category)];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-primary font-serif">Our Menu</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search for a dish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
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
                : 'bg-brand-surface hover:bg-brand-secondary hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => <MenuItemCard key={item.id} item={item} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">No menu items match your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;