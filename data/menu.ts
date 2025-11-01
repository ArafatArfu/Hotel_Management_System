
import type { MenuItem } from '../types';
import { Category, Status } from '../types';

export const menuItems: MenuItem[] = [
  // Biriyani
  { id: 1, name: 'Chicken Biriyani', category: Category.BIRIYANI, price: 180, status: Status.AVAILABLE },
  { id: 2, name: 'Mutton Biriyani', category: Category.BIRIYANI, price: 220, status: Status.AVAILABLE },
  { id: 3, name: 'Beef Biriyani', category: Category.BIRIYANI, price: 200, status: Status.NOT_AVAILABLE },
  
  // Kacchi
  { id: 4, name: 'Basmati Kacchi', category: Category.KACCHI, price: 250, status: Status.AVAILABLE },
  { id: 5, name: 'Mutton Kacchi', category: Category.KACCHI, price: 280, status: Status.AVAILABLE },

  // Chicken
  { id: 6, name: 'Chicken Fry', category: Category.CHICKEN, price: 90, status: Status.AVAILABLE },
  { id: 7, name: 'Chicken Roast', category: Category.CHICKEN, price: 120, status: Status.AVAILABLE },
  { id: 8, name: 'Spicy Chicken Curry', category: Category.CHICKEN, price: 150, status: Status.AVAILABLE },

  // Beef
  { id: 9, name: 'Beef Curry', category: Category.BEEF, price: 160, status: Status.AVAILABLE },
  { id: 10, name: 'Beef Bhuna', category: Category.BEEF, price: 180, status: Status.AVAILABLE },

  // Mutton
  { id: 11, name: 'Mutton Curry', category: Category.MUTTON, price: 200, status: Status.AVAILABLE },
  { id: 12, name: 'Mutton Rezala', category: Category.MUTTON, price: 220, status: Status.AVAILABLE },

  // Fish
  { id: 13, name: 'Rui Fish Curry', category: Category.FISH, price: 130, status: Status.AVAILABLE },
  { id: 14, name: 'Ilish Fish Fry', category: Category.FISH, price: 250, status: Status.AVAILABLE },

  // Vegetables
  { id: 15, name: 'Mixed Vegetables', category: Category.VEGETABLES, price: 80, status: Status.AVAILABLE },
  { id: 16, name: 'Dal Fry', category: Category.VEGETABLES, price: 50, status: Status.AVAILABLE },
  
  // Rice
  { id: 17, name: 'Plain Rice', category: Category.RICE, price: 30, status: Status.AVAILABLE },
  { id: 18, name: 'Polao', category: Category.RICE, price: 70, status: Status.AVAILABLE },

  // Khichuri
  { id: 19, name: 'Plain Khichuri', category: Category.KHICHURI, price: 80, status: Status.AVAILABLE },
  { id: 20, name: 'Beef Khichuri', category: Category.KHICHURI, price: 150, status: Status.AVAILABLE },

  // Drinks
  { id: 21, name: 'Cold Drink', category: Category.DRINKS, price: 30, status: Status.AVAILABLE },
  { id: 22, name: 'Mineral Water', category: Category.DRINKS, price: 20, status: Status.AVAILABLE },
  { id: 23, name: 'Lassi', category: Category.DRINKS, price: 60, status: Status.AVAILABLE },

  // Desserts
  { id: 24, name: 'Firni', category: Category.DESSERTS, price: 50, status: Status.AVAILABLE },
  { id: 25, name: 'Caramel Pudding', category: Category.DESSERTS, price: 70, status: Status.AVAILABLE },
];
