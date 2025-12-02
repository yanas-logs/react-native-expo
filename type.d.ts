export type ItemOffers = {
  id: string;
  title: string;
  color: string;
  image: any;
};

export type ItemProduct = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: any;
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: any;
  qty: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
};

export type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  status: "On Process" | "On-Transit" | "Out for Delivery" | "Delivered";
  total: number;
  date: string;
};

export interface Currency {
  value: number;
  currency: "IDR" | "USD" | "JPY";
}
