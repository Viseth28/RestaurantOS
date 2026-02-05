import { Category, MenuItem } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'starters', name: 'Starters', icon: 'Utensils' },
  { id: 'mains', name: 'Mains', icon: 'Pizza' },
  { id: 'drinks', name: 'Drinks', icon: 'Coffee' },
  { id: 'dessert', name: 'Dessert', icon: 'IceCream' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    categoryId: 'starters',
    name: 'Truffle Arancini',
    description: 'Crispy risotto balls infused with black truffle oil, served with garlic aioli.',
    price: 12,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Rice', 'Truffle Oil', 'Parmesan', 'Breadcrumbs', 'Garlic', 'Egg']
  },
  {
    id: '2',
    categoryId: 'starters',
    name: 'Spicy Calamari',
    description: 'Flash-fried squid tossed in chili flakes and parsley.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    spicy: true,
    ingredients: ['Squid', 'Chili Flakes', 'Flour', 'Lemon', 'Parsley']
  },
  {
    id: '3',
    categoryId: 'mains',
    name: 'Wagyu Beef Burger',
    description: 'Premium Wagyu patty, brioche bun, aged cheddar, caramelized onions.',
    price: 24,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Wagyu Beef', 'Brioche Bun', 'Cheddar', 'Onion', 'Lettuce', 'Tomato']
  },
  {
    id: '4',
    categoryId: 'mains',
    name: 'Wild Mushroom Risotto',
    description: 'Creamy arborio rice with porcini mushrooms and thyme.',
    price: 21,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80',
    vegan: true,
    ingredients: ['Arborio Rice', 'Porcini Mushrooms', 'Vegetable Stock', 'Thyme', 'White Wine']
  },
  {
    id: '5',
    categoryId: 'mains',
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon fillet with asparagus and lemon butter sauce.',
    price: 26,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Salmon', 'Asparagus', 'Butter', 'Lemon', 'Dill']
  },
  {
    id: '6',
    categoryId: 'drinks',
    name: 'Artisan Espresso',
    description: 'Single origin bean espresso.',
    price: 4,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Coffee Beans', 'Water']
  },
  {
    id: '7',
    categoryId: 'drinks',
    name: 'Craft IPA',
    description: 'Locally brewed Indian Pale Ale with citrus notes.',
    price: 8,
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Hops', 'Malt', 'Yeast', 'Water']
  },
  {
    id: '8',
    categoryId: 'dessert',
    name: 'Dark Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.',
    price: 10,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Dark Chocolate', 'Butter', 'Sugar', 'Eggs', 'Flour', 'Vanilla Ice Cream']
  }
];
