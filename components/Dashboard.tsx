import React, { useMemo, useState } from 'react';
import type { Order } from '../types';
import ReceiptModal from './ReceiptModal';
import { useAppContext } from '../context/AppContext';

interface DashboardProps {
  orders: Order[];
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

const Dashboard: React.FC<DashboardProps> = ({ orders, isAdmin, onDeleteOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { logo } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = useMemo(() => orders.filter(order => order.date.startsWith(today)), [orders, today]);

  const totalSales = useMemo(() => todaysOrders.reduce((sum, order) => sum + order.grandTotal, 0), [todaysOrders]);
  const totalOrders = useMemo(() => todaysOrders.length, [todaysOrders]);
  const totalCustomers = useMemo(() => todaysOrders.length, [todaysOrders]); // Assuming 1 order = 1 customer for simplicity

  const sortedOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [orders]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif">Today's Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Sales" value={`৳${totalSales.toFixed(2)}`} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
        <StatCard title="Total Orders" value={String(totalOrders)} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <StatCard title="Total Customers" value={String(totalCustomers)} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
      </div>

      <div className="bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4">Order History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Receipt No</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Date & Time</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Items</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Total Amount</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{order.id}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{new Date(order.date).toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">৳{order.grandTotal.toFixed(2)}</td>
                  <td className="py-3 px-4 space-x-3">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-brand-primary dark:text-brand-secondary hover:underline text-sm font-medium"
                    >
                      View Receipt
                    </button>
                    {isAdmin && (
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="text-red-600 hover:underline text-sm font-medium"
                        >
                          Delete
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