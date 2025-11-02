import React, { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Menu from './components/Menu';
import Order from './components/Order';
import Employees from './components/Employees';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import Footer from './components/Footer';
import { initialOrders } from './data/orders';
import { initialEmployees } from './data/employees';
import { initialExpenses } from './data/expenses';
import { menuItems as initialMenuItems } from './data/menu';
import type { Order as OrderType, Employee as EmployeeType, Expense as ExpenseType, MenuItem } from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

type Page = 'dashboard' | 'menu' | 'order' | 'employees' | 'expenses' | 'reports' | 'settings';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { logo, theme } = useAppContext();
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin';

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [employees, setEmployees] = useState<EmployeeType[]>(initialEmployees);
  const [expenses, setExpenses] = useState<ExpenseType[]>(initialExpenses);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Order CRUD
  const addOrder = useCallback((newOrder: OrderType) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCurrentPage('dashboard');
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    if (!isAdmin) return;
    if (window.confirm(t('confirmations.deleteOrder'))) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  }, [isAdmin, t]);

  // Menu Item CRUD
  const addMenuItem = useCallback((newItem: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => [...prev, { ...newItem, id: Date.now() }]);
  }, []);

  const updateMenuItem = useCallback((updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);

  const deleteMenuItem = useCallback((itemId: number) => {
    if (window.confirm(t('confirmations.deleteMenuItem'))) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }
  }, [t]);
  
  const handleImageChange = useCallback((itemId: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target?.result) {
            const imageUrl = e.target.result as string;
            setMenuItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, imageUrl } : item
                )
            );
        }
    };
    reader.readAsDataURL(file);
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

  if (!user) {
    return <Login />;
  }
  
  const adminPages: Page[] = ['employees', 'expenses', 'reports', 'settings'];

  const renderPage = () => {
    if (!isAdmin && adminPages.includes(currentPage)) {
        return (
            <div className="text-center p-8 bg-brand-surface dark:bg-brand-surface-dark rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-red-600 mb-2">{t('accessDenied.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300">{t('accessDenied.message')}</p>
            </div>
        );
    }
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard orders={orders} isAdmin={isAdmin} onDeleteOrder={deleteOrder} />;
      case 'menu':
        return <Menu menuItems={menuItems} onImageChange={handleImageChange} isAdmin={isAdmin} onAdd={addMenuItem} onUpdate={updateMenuItem} onDelete={deleteMenuItem} />;
      case 'order':
        return <Order addOrder={addOrder} menuItems={menuItems} />;
      case 'employees':
        return <Employees employees={employees} onAdd={addEmployee} onUpdate={updateEmployee} onDelete={deleteEmployee} />;
      case 'expenses':
        return <Expenses expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />;
      case 'reports':
        return <Reports orders={orders} employees={employees} expenses={expenses} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard orders={orders} isAdmin={isAdmin} onDeleteOrder={deleteOrder} />;
    }
  };

  const NavButton: React.FC<{ page: Page; label: string }> = ({ page, label }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentPage === page
          ? 'bg-brand-primary text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-brand-secondary hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <header className="bg-brand-surface dark:bg-brand-surface-dark shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Al Madina Restaurant logo" className="h-20 w-auto object-contain" />
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-end">
            <NavButton page="dashboard" label={t('nav.dashboard')} />
            <NavButton page="menu" label={t('nav.menu')} />
            <NavButton page="order" label={t('nav.newOrder')} />
            {isAdmin && (
              <>
                <NavButton page="employees" label={t('nav.employees')} />
                <NavButton page="expenses" label={t('nav.expenses')} />
                <NavButton page="reports" label={t('nav.reports')} />
                <NavButton page="settings" label={t('nav.settings')} />
              </>
            )}
            <button
              onClick={logout}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              {t('nav.logout')}
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
        <LanguageProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </LanguageProvider>
    </AppProvider>
  );
};


export default App;