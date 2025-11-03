import React, { useState, useEffect, useMemo } from 'react';
import type { Employee } from '../types';
import { SalaryType, EmployeeStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'> | Employee) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, onSave }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    salaryType: SalaryType.MONTHLY,
    salary: 0,
    status: EmployeeStatus.ACTIVE,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        role: employee.role,
        salaryType: employee.salaryType,
        salary: employee.salary,
        status: employee.status,
      });
    } else {
      setFormData({
        name: '',
        role: '',
        salaryType: SalaryType.MONTHLY,
        salary: 0,
        status: EmployeeStatus.ACTIVE,
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      onSave({ ...employee, ...formData });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-brand-surface-dark p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">{employee ? t('employeeModal.editTitle') : t('employeeModal.addTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.name')}</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('employees.role')}</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('employeeModal.salaryType')}</label>
            <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary">
              <option value={SalaryType.MONTHLY}>{t('enums.salaryType.Monthly')}</option>
              <option value={SalaryType.DAILY}>{t('enums.salaryType.Daily')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('employeeModal.salaryAmount')}</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.status')}</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary">
              <option value={EmployeeStatus.ACTIVE}>{t('enums.employeeStatus.Active')}</option>
              <option value={EmployeeStatus.INACTIVE}>{t('enums.employeeStatus.Inactive')}</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('common.cancel')}</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">{t('common.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EmployeesProps {
  employees: Employee[];
  onAdd: (employee: Omit<Employee, 'id'>) => void;
  onUpdate: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
}

const Employees: React.FC<EmployeesProps> = ({ employees, onAdd, onUpdate, onDelete }) => {
  const { t, formatCurrency } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEmployees = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) return employees;
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(lowercasedFilter) ||
      employee.role.toLowerCase().includes(lowercasedFilter)
    );
  }, [employees, searchTerm]);


  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (employeeId: number) => {
    if (window.confirm(t('confirmations.deleteEmployee'))) {
        onDelete(employeeId);
    }
  };

  const handleSave = (employee: Omit<Employee, 'id'> | Employee) => {
    if ('id' in employee) {
      onUpdate(employee);
    } else {
      onAdd(employee);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-primary dark:text-gray-100 font-serif">{t('employees.title')}</h2>
        <button onClick={handleAdd} className="bg-brand-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-90">
          {t('employees.addNew')}
        </button>
      </div>

      <div className="bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-lg shadow-md">
        <div className="mb-4">
            <input
                type="text"
                placeholder={t('employees.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md p-2 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
                aria-label="Search employees"
            />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('common.name')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('employees.role')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('employees.salary')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('common.status')}</th>
                <th className="py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <tr key={employee.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{employee.name}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{employee.role}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{formatCurrency(employee.salary)} / {t(`enums.salaryType.${employee.salaryType}`)}</td>
                    <td className="py-3 px-4">
                       <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          employee.status === EmployeeStatus.ACTIVE ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                        }`}>
                        {t(`enums.employeeStatus.${employee.status}`)}
                      </span>
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:underline text-sm font-medium">{t('common.edit')}</button>
                      <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:underline text-sm font-medium">{t('common.delete')}</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {t('employees.noEmployees')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <EmployeeModal employee={editingEmployee} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
    </div>
  );
};

export default Employees;