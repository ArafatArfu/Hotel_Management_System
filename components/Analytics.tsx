import React, { useState, useMemo } from 'react';
import type { Order, MenuItem, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

const AnalyticsCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md ${className}`}>
    <h3 className="text-xl font-bold text-brand-primary dark:text-gray-100 font-serif mb-4">{title}</h3>
    {children}
  </div>
);

type TimePeriod = '7d' | '30d' | 'year' | 'all';

const Analytics: React.FC<{ orders: Order[]; menuItems: MenuItem[] }> = ({ orders }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');
  const { t, formatCurrency } = useLanguage();

  const filteredOrders = useMemo(() => {
    const now = new Date();
    if (timePeriod === 'all') {
      return orders;
    }
    if (timePeriod === 'year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return orders.filter(o => new Date(o.date) >= startOfYear);
    }
    const daysToSubtract = timePeriod === '7d' ? 7 : 30;
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - daysToSubtract);
    return orders.filter(o => new Date(o.date) >= startDate);
  }, [orders, timePeriod]);

  const salesTrendData = useMemo(() => {
    if (filteredOrders.length === 0) return [];

    if (timePeriod === 'year') {
      const monthlySales: { [key: string]: { value: number; year: number; month: number } } = {};
      filteredOrders.forEach(order => {
        const date = new Date(order.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlySales[monthKey]) {
          monthlySales[monthKey] = { value: 0, year: date.getFullYear(), month: date.getMonth() };
        }
        monthlySales[monthKey].value += order.grandTotal;
      });

      return Object.values(monthlySales)
        .sort((a, b) => a.year - b.year || a.month - b.month)
        .map(data => ({
          label: new Date(data.year, data.month).toLocaleString('default', { month: 'short' }),
          value: data.value
        }));
    }

    const dailySales: { [key: string]: number } = {};
    filteredOrders.forEach(order => {
      const day = new Date(order.date).toISOString().split('T')[0];
      dailySales[day] = (dailySales[day] || 0) + order.grandTotal;
    });

    return Object.entries(dailySales)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, value]) => ({
        label: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value
      }));
  }, [filteredOrders, timePeriod]);

  const peakHoursData = useMemo(() => {
    const hours = Array.from({ length: 24 }, () => 0);
    filteredOrders.forEach(order => {
      const hour = new Date(order.date).getHours();
      hours[hour]++;
    });
    return hours.map((count, i) => ({ label: `${i}:00`, value: count })).filter(h => h.value > 0);
  }, [filteredOrders]);

  const topSellingItems = useMemo(() => {
    const itemCounts: { [key: string]: { name: string, quantity: number } } = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = { name: item.name, quantity: 0 };
        }
        itemCounts[item.id].quantity += item.quantity;
      });
    });
    return Object.values(itemCounts).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [filteredOrders]);

  const salesByCategory = useMemo(() => {
    const categorySales: { [key in Category]?: number } = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity);
      });
    });
    return Object.entries(categorySales).map(([name, value]) => ({ name, value: value! })).sort((a, b) => b.value - a.value);
  }, [filteredOrders]);

  const totalRevenue = useMemo(() => filteredOrders.reduce((sum, order) => sum + order.grandTotal, 0), [filteredOrders]);

  const TimeFilterButton: React.FC<{ period: TimePeriod; label: string }> = ({ period, label }) => (
    <button
      onClick={() => setTimePeriod(period)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        timePeriod === period
          ? 'bg-brand-primary text-white'
          : 'bg-brand-surface dark:bg-brand-surface-dark dark:text-gray-200 hover:bg-brand-secondary hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const maxSaleValue = salesTrendData.length > 0 ? Math.max(...salesTrendData.map(d => d.value)) : 0;
  const maxPeakHourValue = peakHoursData.length > 0 ? Math.max(...peakHoursData.map(d => d.value)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif">{t('analytics.title')}</h2>
        <div className="flex items-center space-x-2">
          <TimeFilterButton period="7d" label={t('analytics.timeFilter.d7')} />
          <TimeFilterButton period="30d" label={t('analytics.timeFilter.d30')} />
          <TimeFilterButton period="year" label={t('analytics.timeFilter.year')} />
          <TimeFilterButton period="all" label={t('analytics.timeFilter.all')} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard title={t('analytics.salesTrend.title', { amount: formatCurrency(totalRevenue) })} className="lg:col-span-2">
          <div className="h-64 flex items-end space-x-2 overflow-x-auto p-2">
            {salesTrendData.length > 0 ? salesTrendData.map(({ label, value }) => (
              <div key={label} className="flex-1 min-w-[3rem] text-center group">
                <div className="relative flex items-end justify-center h-full">
                   <div className="absolute -top-6 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{formatCurrency(value)}</div>
                   <div className="w-full bg-brand-secondary rounded-t-md hover:bg-brand-primary transition-colors" style={{ height: `${maxSaleValue > 0 ? (value / maxSaleValue) * 100 : 0}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
              </div>
            )) : <p className="w-full text-center text-gray-500 dark:text-gray-400">{t('analytics.salesTrend.noData')}</p>}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title={t('analytics.topSelling.title')}>
          <ul className="space-y-3">
            {topSellingItems.length > 0 ? topSellingItems.map((item, index) => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{index + 1}. {item.name}</span>
                <span className="text-gray-600 dark:text-gray-400 font-bold">{t('analytics.topSelling.units', { count: item.quantity })}</span>
              </li>
            )) : <p className="text-center text-gray-500 dark:text-gray-400">{t('analytics.topSelling.noData')}</p>}
          </ul>
        </AnalyticsCard>
        
        <AnalyticsCard title={t('analytics.categorySales.title')}>
           <div className="space-y-2">
            {salesByCategory.length > 0 ? salesByCategory.map(({ name, value }) => (
                <div key={name} className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{formatCurrency(value)} ({totalRevenue > 0 ? ((value / totalRevenue) * 100).toFixed(1) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${totalRevenue > 0 ? (value / totalRevenue) * 100 : 0}%` }}></div>
                    </div>
                </div>
            )) : <p className="text-center text-gray-500 dark:text-gray-400">{t('analytics.categorySales.noData')}</p>}
           </div>
        </AnalyticsCard>

        <AnalyticsCard title={t('analytics.peakHours.title')} className="lg:col-span-2">
            <div className="h-48 flex items-end space-x-2 overflow-x-auto p-2">
                {peakHoursData.length > 0 ? peakHoursData.map(({ label, value }) => (
                <div key={label} className="flex-1 min-w-[2.5rem] text-center group">
                    <div className="relative flex items-end justify-center h-full">
                       <div className="absolute -top-6 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{t('analytics.peakHours.orders', { count: value })}</div>
                       <div className="w-full bg-brand-secondary rounded-t-md hover:bg-brand-primary transition-colors" style={{ height: `${maxPeakHourValue > 0 ? (value / maxPeakHourValue) * 100 : 0}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                </div>
                )) : <p className="w-full text-center text-gray-500 dark:text-gray-400">{t('analytics.peakHours.noData')}</p>}
            </div>
        </AnalyticsCard>

      </div>
    </div>
  );
};

export default Analytics;