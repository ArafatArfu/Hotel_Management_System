import type { MenuItem } from '../types';
import { Category, Status } from '../types';

export const menuItems: MenuItem[] = [
  // Biriyani & Kacchi (Indices 0-5)
  { id: 1, name: 'Chicken Biriyani', category: Category.BIRIYANI, price: 200, status: Status.AVAILABLE, imageUrl: 'Product_Image/chicken-biriyani.jpg' },
  { id: 2, name: 'Beef Biriyani', category: Category.BIRIYANI, price: 220, status: Status.AVAILABLE, imageUrl: 'Product_Image/beef-biriyani.jpg' },
  { id: 3, name: 'Mutton Biriyani', category: Category.BIRIYANI, price: 250, status: Status.AVAILABLE, imageUrl: 'Product_Image/mutton-biriyani.jpg' },
  { id: 4, name: 'Polaw', category: Category.RICE, price: 120, status: Status.AVAILABLE, imageUrl: 'Product_Image/Polaw.png' },
  { id: 5, name: 'Mutton Kacchi', category: Category.KACCHI, price: 280, status: Status.AVAILABLE, imageUrl: 'Product_Image/Mutton Kacchi.png' },
  { id: 6, name: 'Chicken Kacchi', category: Category.KACCHI, price: 240, status: Status.NOT_AVAILABLE, imageUrl: 'Product_Image/chicken-kacchi.jpg' },

  // Curries (Indices 6-14)
  { id: 7, name: 'Chicken Roast', category: Category.CHICKEN, price: 180, status: Status.AVAILABLE, imageUrl: 'Product_Image/chicken-roast.jpg' },
  { id: 8, name: 'Chicken Fry', category: Category.CHICKEN, price: 90, status: Status.AVAILABLE, imageUrl: 'Product_Image/chicken-fry.png' },
  { id: 9, name: 'Spicy Chicken Curry', category: Category.CHICKEN, price: 160, status: Status.AVAILABLE, imageUrl: 'Product_Image/Spicy Chicken Curry.png' },
  { id: 10, name: 'Beef Bhuna', category: Category.BEEF, price: 200, status: Status.AVAILABLE, imageUrl: 'Product_Image/beef-bhuna.jpg' },
  { id: 11, name: 'Beef Kala Bhuna', category: Category.BEEF, price: 240, status: Status.AVAILABLE, imageUrl: 'Product_Image/beef-kala-bhuna.jpg' },
  { id: 12, name: 'Mutton Curry', category: Category.MUTTON, price: 220, status: Status.AVAILABLE, imageUrl: 'Product_Image/Mutton Curry.png' },
  { id: 13, name: 'Mutton Rezala', category: Category.MUTTON, price: 260, status: Status.AVAILABLE, imageUrl: 'Product_Image/Mutton Rezala.png' },
  { id: 14, name: 'Rui Fish Curry', category: Category.FISH, price: 150, status: Status.AVAILABLE, imageUrl: 'Product_Image/Rui Fish Curry.png' },
  { id: 15, name: 'Ilish Fish Fry', category: Category.FISH, price: 250, status: Status.AVAILABLE, imageUrl: 'Product_Image/Ilish Fish Fry.png' },

  // Rice & Others (Indices 15-18)
  { id: 16, name: 'Plain Khichuri', category: Category.KHICHURI, price: 140, status: Status.AVAILABLE, imageUrl: 'Product_Image/Plain Khichuri.png' },
  { id: 17, name: 'Plain Rice', category: Category.RICE, price: 40, status: Status.AVAILABLE, imageUrl: 'Product_Image/Plain Rice.png' },
  { id: 18, name: 'Mixed Vegetables', category: Category.VEGETABLES, price: 80, status: Status.AVAILABLE, imageUrl: 'Product_Image/Mixed Vegetables.png' },
  { id: 19, name: 'Dal', category: Category.VEGETABLES, price: 30, status: Status.AVAILABLE, imageUrl: 'Product_Image/dal.jpg' },
  
  // Desserts & Drinks (Indices 19-23)
  { id: 20, name: 'Firni', category: Category.DESSERTS, price: 60, status: Status.AVAILABLE, imageUrl: 'Product_Image/firni.jpg' },
  { id: 21, name: 'Cold Drink', category: Category.DRINKS, price: 30, status: Status.AVAILABLE, imageUrl: 'Product_Image/cold-drink.jpg' },
  { id: 22, name: 'Borhani', category: Category.DRINKS, price: 50, status: Status.AVAILABLE, imageUrl: 'Product_Image/borhani.jpg' },
  { id: 23, name: 'Lassi', category: Category.DRINKS, price: 60, status: Status.AVAILABLE, imageUrl: 'Product_Image/Lassi.png' },
  { id: 24, name: 'Mineral Water', category: Category.DRINKS, price: 20, status: Status.AVAILABLE, imageUrl: 'Product_Image/Mineral Water.png' },
];
