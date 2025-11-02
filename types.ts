export enum Category {
  CHICKEN = 'Chicken',
  BEEF = 'Beef',
  MUTTON = 'Mutton',
  FISH = 'Fish',
  VEGETABLES = 'Vegetables',
  RICE = 'Rice',
  KHICHURI = 'Khichuri',
  BIRIYANI = 'Biriyani',
  KACCHI = 'Kacchi',
  DRINKS = 'Drinks',
  DESSERTS = 'Desserts',
}

export enum Status {
  AVAILABLE = 'Available',
  NOT_AVAILABLE = 'Not Available',
}

export interface MenuItem {
  id: number;
  name: string;
  category: Category;
  price: number;
  status: Status;
  imageUrl: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  serviceCharge: number;
  grandTotal: number;
}

// New Types for Employee and Expense Management
export enum SalaryType {
  MONTHLY = 'Monthly',
  DAILY = 'Daily',
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  salaryType: SalaryType;
  salary: number;
  status: EmployeeStatus;
}

export enum ExpenseCategory {
  UTILITIES = 'Utilities',
  SUPPLIES = 'Supplies',
  RENT = 'Rent',
  MAINTENANCE = 'Maintenance',
  OTHER = 'Other',
}

export interface Expense {
  id: number;
  date: string; // ISO string
  category: string;
  description: string;
  amount: number;
}