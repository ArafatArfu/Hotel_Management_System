
import type { Employee } from '../types';
import { SalaryType, EmployeeStatus } from '../types';

export const initialEmployees: Employee[] = [
  { id: 1, name: 'Rahim Sheikh', role: 'Head Chef', salaryType: SalaryType.MONTHLY, salary: 40000, status: EmployeeStatus.ACTIVE },
  { id: 2, name: 'Karim Ahmed', role: 'Waiter', salaryType: SalaryType.MONTHLY, salary: 15000, status: EmployeeStatus.ACTIVE },
  { id: 3, name: 'Fatima Begum', role: 'Waiter', salaryType: SalaryType.MONTHLY, salary: 15000, status: EmployeeStatus.ACTIVE },
  { id: 4, name: 'Sultan Khan', role: 'Manager', salaryType: SalaryType.MONTHLY, salary: 50000, status: EmployeeStatus.ACTIVE },
  { id: 5, name: 'Jahanara Islam', role: 'Cleaner', salaryType: SalaryType.DAILY, salary: 500, status: EmployeeStatus.ACTIVE },
  { id: 6, name: 'Ali Hossain', role: 'Dishwasher', salaryType: SalaryType.DAILY, salary: 450, status: EmployeeStatus.INACTIVE },
];
