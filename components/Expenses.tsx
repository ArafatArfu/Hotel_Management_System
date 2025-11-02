import React, { useState } from 'react';
import type { Expense } from '../types';
import { ExpenseCategory } from '../types';

interface ExpensesProps {
  expenses: Expense[];
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  onDelete: (expenseId: number) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, onAdd, onDelete }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: ExpenseCategory.SUPPLIES,
    description: '',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert('Please fill all fields.');
      return;
    }
    onAdd({
      date: new Date(formData.date).toISOString(),
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: ExpenseCategory.SUPPLIES,
      description: '',
      amount: '',
    });
  };

  return (
    <div>
       <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-6">Expense Tracking</h2>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-1 bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary">
                {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (৳)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"/>
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">
              Save Expense
            </button>
          </form>
        </div>

        {/* Expense History */}
        <div className="lg:col-span-2 bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4">Expense History</h3>
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="border-b-2 border-gray-200 dark:border-gray-700 sticky top-0 bg-brand-surface dark:bg-brand-surface-dark">
                <tr>
                  <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                  <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Category</th>
                  <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Description</th>
                  <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Amount</th>
                  <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{expense.category}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{expense.description}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">৳{expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => onDelete(expense.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
       </div>
    </div>
  );
};

export default Expenses;