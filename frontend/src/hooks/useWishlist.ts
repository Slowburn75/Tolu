import { create } from "zustand";
import { persist } from "zustand/middleware";
import { wishlistApi } from "@/lib/api";
import type { Product } from "@/types";

type WishlistProduct = Product & { wishlistItemId?: string };

interface WishlistState {
  items: WishlistProduct[];
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
        const token = typeof window !== "undefined" ? localStorage.getItem("tolumak-auth") : null;
        if (!token) return;
        set({ isLoading: true });
        try {
          const res = await wishlistApi.getWishlist() as { data?: { items?: { id: string; product: Product }[] }; items?: { id: string; product: Product }[] };
          const items = res.data?.items || res.items || [];
          if (items) {
            set({ items: items.map((i) => ({ ...i.product, wishlistItemId: i.id })), isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      addItem: async (product: Product) => {
        set((state) => ({ items: [...state.items, product] }));
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("tolumak-auth") : null;
          if (token) {
            await wishlistApi.addToWishlist(product.id);
            await get().fetchWishlist();
          }
        } catch {}
      },

      removeItem: async (productId: string) => {
        const prev = get().items;
        const item = prev.find((i) => i.id === productId);
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("tolumak-auth") : null;
          if (token && item?.wishlistItemId) {
            await wishlistApi.removeFromWishlist(item.wishlistItemId);
          }
        } catch {}
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
