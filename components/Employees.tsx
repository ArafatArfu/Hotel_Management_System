import React, { useState, useEffect, useMemo } from 'react';
import type { Employee } from '../types';
import { SalaryType, EmployeeStatus } from '../types';

interface EmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'> | Employee) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, onSave }) => {
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
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Type</label>
            <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary">
              <option value={SalaryType.MONTHLY}>Monthly</option>
              <option value={SalaryType.DAILY}>Daily</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary (৳)</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary">
              <option value={EmployeeStatus.ACTIVE}>Active</option>
              <option value={EmployeeStatus.INACTIVE}>Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">Save</button>
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
    if (window.confirm('Are you sure you want to delete this employee?')) {
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
        <h2 className="text-3xl font-bold text-brand-primary font-serif">Employee Management</h2>
        <button onClick={handleAdd} className="bg-brand-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-90">
          Add New Employee
        </button>
      </div>

      <div className="bg-brand-surface p-6 rounded-lg shadow-md">
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
                aria-label="Search employees"
            />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="py-2 px-4 text-gray-600 font-medium">Name</th>
                <th className="py-2 px-4 text-gray-600 font-medium">Role</th>
                <th className="py-2 px-4 text-gray-600 font-medium">Salary</th>
                <th className="py-2 px-4 text-gray-600 font-medium">Status</th>
                <th className="py-2 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{employee.name}</td>
                    <td className="py-3 px-4 text-gray-800">{employee.role}</td>
                    <td className="py-3 px-4 text-gray-800">৳{employee.salary.toLocaleString()} / {employee.salaryType}</td>
                    <td className="py-3 px-4">
                       <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          employee.status === EmployeeStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No employees found matching your search.
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