
import React, { useState, useMemo } from 'react';
import type { Order, Employee, Expense } from '../types';
import { EmployeeStatus, SalaryType } from '../types';

interface ReportsProps {
  orders: Order[];
  employees: Employee[];
  expenses: Expense[];
}

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-brand-surface p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-brand-primary text-white p-3 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-brand-primary">{value}</p>
    </div>
  </div>
);

const Reports: React.FC<ReportsProps> = ({ orders, employees, expenses }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

  const monthlyData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = getDaysInMonth(year, month);

    const filteredOrders = orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate.getFullYear() === year && orderDate.getMonth() + 1 === month;
    });

    const filteredExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
    });
    
    const activeEmployees = employees.filter(e => e.status === EmployeeStatus.ACTIVE);

    const revenue = filteredOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const otherExpensesTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const employeeSalaries = activeEmployees.map(e => {
        const monthlySalary = e.salaryType === SalaryType.MONTHLY 
            ? e.salary 
            : e.salary * daysInMonth;
        return { ...e, calculatedSalary: monthlySalary };
    });

    const salaryExpensesTotal = employeeSalaries.reduce((sum, e) => sum + e.calculatedSalary, 0);
    const totalExpenses = otherExpensesTotal + salaryExpensesTotal;
    const netProfit = revenue - totalExpenses;

    return {
      revenue,
      otherExpensesTotal,
      salaryExpensesTotal,
      totalExpenses,
      netProfit,
      filteredExpenses,
      employeeSalaries
    };
  }, [selectedMonth, orders, expenses, employees]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-brand-primary font-serif">Monthly Profit Report</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`৳${monthlyData.revenue.toFixed(2)}`} icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        <StatCard title="Total Expenses" value={`৳${monthlyData.totalExpenses.toFixed(2)}`} icon="M9 14l6-6m-5.5.5h.01" />
        <StatCard title="Net Profit" value={`৳${monthlyData.netProfit.toFixed(2)}`} icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-brand-surface p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-brand-primary font-serif mb-4">Expense Breakdown (৳{monthlyData.otherExpensesTotal.toFixed(2)})</h3>
          <div className="overflow-x-auto max-h-[40vh] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-gray-200">
                <tr><th className="py-2 px-2 text-gray-600 font-medium">Date</th><th className="py-2 px-2 text-gray-600 font-medium">Description</th><th className="py-2 px-2 text-gray-600 font-medium">Amount</th></tr>
              </thead>
              <tbody>
                {monthlyData.filteredExpenses.map(e => (
                  <tr key={e.id} className="border-b border-gray-100">
                    <td className="py-2 px-2 text-gray-800">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="py-2 px-2 text-gray-800">{e.description}</td>
                    <td className="py-2 px-2 font-semibold text-gray-900">৳{e.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="bg-brand-surface p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-brand-primary font-serif mb-4">Salary Breakdown (৳{monthlyData.salaryExpensesTotal.toFixed(2)})</h3>
           <div className="overflow-x-auto max-h-[40vh] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-gray-200">
                <tr><th className="py-2 px-2 text-gray-600 font-medium">Employee</th><th className="py-2 px-2 text-gray-600 font-medium">Salary Details</th><th className="py-2 px-2 text-gray-600 font-medium">Amount</th></tr>
              </thead>
              <tbody>
                 {monthlyData.employeeSalaries.map(e => (
                  <tr key={e.id} className="border-b border-gray-100">
                    <td className="py-2 px-2 text-gray-900">{e.name}<br/><span className="text-xs text-gray-500">{e.role}</span></td>
                    <td className="py-2 px-2 text-gray-800">৳{e.salary.toFixed(2)} / {e.salaryType}</td>
                    <td className="py-2 px-2 font-semibold text-gray-900">৳{e.calculatedSalary.toFixed(2)}</td>
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

export default Reports;
