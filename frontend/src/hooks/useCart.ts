import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/lib/api";
import type { CartItem, Product } from "@/types";

interface LocalCartItem {
  id?: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  savedForLater: boolean;
}

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;
  isLoading: boolean;
  setOpen: (open: boolean) => void;
  toggleCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  toggleSaveForLater: (productId: string, size?: string, color?: string) => void;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      setOpen: (open: boolean) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      fetchCart: async () => {
        const token = localStorage.getItem("tolumak-auth");
        if (!token) return;
        set({ isLoading: true });
        try {
          const res = await cartApi.getCart() as { success: boolean; data: { items: LocalCartItem[] } };
          const items = (res as any).data?.items || (res as any).items;
          if (items) {
            set({ items, isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      addItem: (product: Product, quantity = 1, size?: string, color?: string) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id && item.size === size && item.color === color
          );
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }
          return {
            items: [...state.items, { productId: product.id, product, quantity, size, color, savedForLater: false }],
          };
        });
        cartApi.addToCart({ productId: product.id, quantity, size, color }).catch(() => {});
      },

      removeItem: (productId: string, size?: string, color?: string) => {
        const item = get().items.find((i) => i.productId === productId && i.size === size && i.color === color);
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size && item.color === color)
          ),
        }));
        if (item?.id) cartApi.removeCartItem(item.id).catch(() => {});
      },

      updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => {
        if (quantity < 1) return;
        const item = get().items.find((i) => i.productId === productId && i.size === size && i.color === color);
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        }));
        if (item?.id) cartApi.updateCartItem(item.id, { quantity }).catch(() => {});
      },

      toggleSaveForLater: (productId: string, size?: string, color?: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size && item.color === color
              ? { ...item, savedForLater: !item.savedForLater }
              : item
          ),
        }));
      },

      clearCart: async () => {
        set({ items: [] });
      },

      getItemCount: () => get().items.filter((i) => !i.savedForLater).length,

      getSubtotal: () =>
        get()
          .items.filter((i) => !i.savedForLater)
          .reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal;
      },
    }),
    {
      name: "tolumak-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function useCart() {
  return useCartStore();
}
