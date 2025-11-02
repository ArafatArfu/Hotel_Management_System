import React, { useMemo, useState } from 'react';
import type { Order, Employee } from '../types';
import { EmployeeStatus } from '../types';
import ReceiptModal from './ReceiptModal';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  orders: Order[];
  employees: Employee[];
  isAdmin: boolean;
  onDeleteOrder: (orderId: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-brand-primary text-white p-3 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-brand-primary dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ orders, employees, isAdmin, onDeleteOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { logo } = useAppContext();
  const { t, language } = useLanguage();

  const todaysOrders = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(order => order.date.startsWith(today));
  }, [orders]);
  
  const monthlySales = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return orders
      .filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.grandTotal, 0);
  }, [orders]);
  
  const yearlySales = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return orders
      .filter(order => new Date(order.date).getFullYear() === currentYear)
      .reduce((sum, order) => sum + order.grandTotal, 0);
  }, [orders]);

  const totalSalesToday = useMemo(() => todaysOrders.reduce((sum, order) => sum + order.grandTotal, 0), [todaysOrders]);
  const totalOrdersToday = useMemo(() => todaysOrders.length, [todaysOrders]);
  const totalCustomersToday = useMemo(() => todaysOrders.length, [todaysOrders]); // Assuming 1 order = 1 customer for simplicity
  const totalActiveEmployees = useMemo(() => employees.filter(e => e.status === EmployeeStatus.ACTIVE).length, [employees]);

  const sortedOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [orders]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language, { style: 'currency', currency: 'BDT' }).format(value).replace('BDT', '৳');
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(language);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif">{t('dashboard.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={t('dashboard.todaysSales')} value={formatCurrency(totalSalesToday)} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
        <StatCard title={t('dashboard.monthlySales')} value={formatCurrency(monthlySales)} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <StatCard title={t('dashboard.yearlySales')} value={formatCurrency(yearlySales)} icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.072a2 2 0 01.714-1.414l.857-.857A2 2 0 0112.14 15.5h-.285a2 2 0 01-1.414-.586l-.857-.857A2 2 0 019 12.072V9z" />
        <StatCard title={t('dashboard.totalOrders')} value={String(totalOrdersToday)} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <StatCard title={t('dashboard.totalCustomers')} value={String(totalCustomersToday)} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
        <StatCard title={t('dashboard.totalEmployees')} value={String(totalActiveEmployees)} icon="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8zM17 8a4 4 0 11-8 0 4 4 0 018 0z" />
      </div>

      <div className="bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4">{t('dashboard.orderHistory')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('dashboard.receiptNo')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('dashboard.dateTime')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('dashboard.items')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('dashboard.totalAmount')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('dashboard.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{order.id}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{formatDateTime(order.date)}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(order.grandTotal)}</td>
                  <td className="py-3 px-4 space-x-3">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-brand-primary dark:text-brand-secondary hover:underline text-sm font-medium"
                    >
                      {t('dashboard.viewReceipt')}
                    </button>
                    {isAdmin && (
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="text-red-600 hover:underline text-sm font-medium"
                        >
                          {t('dashboard.delete')}
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && <ReceiptModal order={selectedOrder} logo={logo} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default Dashboard;
