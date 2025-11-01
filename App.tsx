
import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Menu from './components/Menu';
import Order from './components/Order';
import Employees from './components/Employees';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import { initialOrders } from './data/orders';
import { initialEmployees } from './data/employees';
import { initialExpenses } from './data/expenses';
import type { Order as OrderType, Employee as EmployeeType, Expense as ExpenseType } from './types';
import { AppProvider } from './context/AppContext';

type Page = 'dashboard' | 'menu' | 'order' | 'employees' | 'expenses' | 'reports';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [employees, setEmployees] = useState<EmployeeType[]>(initialEmployees);
  const [expenses, setExpenses] = useState<ExpenseType[]>(initialExpenses);

  const addOrder = useCallback((newOrder: OrderType) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCurrentPage('dashboard');
  }, []);

  // Employee CRUD
  const addEmployee = useCallback((newEmployee: Omit<EmployeeType, 'id'>) => {
    setEmployees(prev => [...prev, { ...newEmployee, id: Date.now() }]);
  }, []);

  const updateEmployee = useCallback((updatedEmployee: EmployeeType) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  }, []);

  const deleteEmployee = useCallback((employeeId: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  }, []);

  // Expense CRUD
  const addExpense = useCallback((newExpense: Omit<ExpenseType, 'id'>) => {
    setExpenses(prev => [...prev, { ...newExpense, id: Date.now() }].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);
  
  const deleteExpense = useCallback((expenseId: number) => {
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard orders={orders} />;
      case 'menu':
        return <Menu />;
      case 'order':
        return <Order addOrder={addOrder} />;
      case 'employees':
        return <Employees employees={employees} onAdd={addEmployee} onUpdate={updateEmployee} onDelete={deleteEmployee} />;
      case 'expenses':
        return <Expenses expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />;
      case 'reports':
        return <Reports orders={orders} employees={employees} expenses={expenses} />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  const NavButton: React.FC<{ page: Page; label: string }> = ({ page, label }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentPage === page
          ? 'bg-brand-primary text-white shadow-md'
          : 'text-gray-700 hover:bg-brand-secondary hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <AppProvider>
      <div className="min-h-screen bg-brand-bg font-sans text-gray-800">
        <header className="bg-brand-surface shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-brand-primary font-serif">Al Madina Restaurant</h1>
            <nav className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-end">
              <NavButton page="dashboard" label="Dashboard" />
              <NavButton page="menu" label="Menu" />
              <NavButton page="order" label="New Order" />
              <NavButton page="employees" label="Employees" />
              <NavButton page="expenses" label="Expenses" />
              <NavButton page="reports" label="Reports" />
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
