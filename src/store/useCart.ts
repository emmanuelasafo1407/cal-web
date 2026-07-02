import { create } from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
  customData?: Record<string, string | number | boolean>;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const existingIndex = state.items.findIndex(
      (item) => item.id === newItem.id && JSON.stringify(item.customData) === JSON.stringify(newItem.customData)
    );
    if (existingIndex > -1) {
      const updatedItems = [...state.items];
      updatedItems[existingIndex].quantity += newItem.quantity;
      return { items: updatedItems };
    }
    return { items: [...state.items, newItem] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));