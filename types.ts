export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  spicy?: boolean;
  vegan?: boolean;
  ingredients: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem extends MenuItem {
  cartId: string; // Unique ID for this instance in cart
  quantity: number;
  notes?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  PAID = 'PAID'
}

export interface Order {
  id: string;
  tableId: number;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  timestamp: number;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}