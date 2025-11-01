
import type { Order } from '../types';
import { menuItems } from './menu';

export const initialOrders: Order[] = [
  {
    id: '#1245',
    date: new Date('2025-10-31T10:00:00Z').toISOString(),
    items: [
      { ...menuItems[0], quantity: 2 }, // Chicken Biriyani
      { ...menuItems[20], quantity: 1 }, // Cold Drink
    ],
    subtotal: 410,
    tax: 20.5,
    discount: 0,
    serviceCharge: 0,
    grandTotal: 430.5,
  },
  {
    id: '#1246',
    date: new Date('2025-10-31T11:30:00Z').toISOString(),
    items: [
      { ...menuItems[4], quantity: 1 }, // Mutton Kacchi
      { ...menuItems[22], quantity: 1 }, // Lassi
    ],
    subtotal: 340,
    tax: 17,
    discount: 10,
    serviceCharge: 0,
    grandTotal: 347,
  },
  {
    id: '#1247',
    date: new Date().toISOString(),
    items: [
      { ...menuItems[9], quantity: 2 }, // Beef Bhuna
      { ...menuItems[16], quantity: 4 }, // Plain Rice
    ],
    subtotal: 480,
    tax: 24,
    discount: 0,
    serviceCharge: 48,
    grandTotal: 552,
  },
];
