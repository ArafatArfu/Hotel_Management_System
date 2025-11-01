
import type { Expense } from '../types';
import { ExpenseCategory } from '../types';

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

export const initialExpenses: Expense[] = [
  { id: 1, date: new Date(currentYear, currentMonth, 1).toISOString(), category: ExpenseCategory.RENT, description: 'Monthly Rent', amount: 80000 },
  { id: 2, date: new Date(currentYear, currentMonth, 5).toISOString(), category: ExpenseCategory.SUPPLIES, description: 'Vegetables & Groceries', amount: 15000 },
  { id: 3, date: new Date(currentYear, currentMonth, 10).toISOString(), category: ExpenseCategory.UTILITIES, description: 'Electricity Bill', amount: 12000 },
  { id: 4, date: new Date(currentYear, currentMonth, 12).toISOString(), category: ExpenseCategory.SUPPLIES, description: 'Meat & Fish', amount: 25000 },
  { id: 5, date: new Date(currentYear, currentMonth, 15).toISOString(), category: ExpenseCategory.MAINTENANCE, description: 'Kitchen Equipment Repair', amount: 5000 },
  { id: 6, date: new Date(currentYear, currentMonth, 20).toISOString(), category: ExpenseCategory.UTILITIES, description: 'Gas Bill', amount: 3000 },
];
