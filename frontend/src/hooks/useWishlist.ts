import { create } from "zustand";
import { persist } from "zustand/middleware";
import { wishlistApi } from "@/lib/api";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const res = await wishlistApi.getWishlist() as { success: boolean; data: { product: Product }[] };
          if (res.data) {
            set({ items: res.data.map((i: { product: Product }) => i.product), isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      addItem: async (product: Product) => {
        set((state) => ({ items: [...state.items, product] }));
        try {
          await wishlistApi.addToWishlist(product.id);
        } catch {
          set((state) => ({ items: state.items.filter((i) => i.id !== product.id) }));
        }
      },

      removeItem: async (productId: string) => {
        const prev = get().items;
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
        try {
          await wishlistApi.removeFromWishlist(productId);
        } catch {
          set({ items: prev });
        }
      },

      isInWishlist: (productId: string) => get().items.some((i) => i.id === productId),
    }),
    {
      name: "tolumak-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function useWishlist() {
  return useWishlistStore();
}
