import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  type?: string;
  customOptions?: Record<string, unknown>;
  customData?: Record<string, unknown>;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              (i.productId || i.id) === (newItem.productId || newItem.id) &&
              JSON.stringify(i.customOptions || i.customData) ===
                JSON.stringify(newItem.customOptions || newItem.customData)
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity;
            return { items: updated };
          }
          return { items: [...state.items, newItem] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cal-cart-storage",
    }
  )
);