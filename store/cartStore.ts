import { create } from "zustand";
import type { CartItem, ItemProduct } from "../type";

type CartState = {
  cart: CartItem[];
  addToCart: (product: ItemProduct) => void;
  removeFromCart: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, qty: 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  decreaseQty: (id: string) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === id);
      if (!existing) return state;

      // if qty more than 1, can decrease qty
      if (existing.qty > 1) {
        return {
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, qty: item.qty - 1 } : item,
          ),
        };
      }

      // if qty = 1, keep qty = 1 (item not removed from cart list)
      return state;
    }),

  clearCart: () => set({ cart: [] }),
}));
