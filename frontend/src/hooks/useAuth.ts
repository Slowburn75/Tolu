import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api";
import type { User, LoginInput, RegisterInput } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;
  updateProfile: (data: FormData | Record<string, unknown>) => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (data: LoginInput) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login(data) as { accessToken: string; refreshToken?: string; user: User };
          set({
            user: res.user,
            token: res.accessToken,
            refreshToken: res.refreshToken || res.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterInput) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(data) as { message: string; user: User };
          set({
            user: res.user,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("cart");
      },

      getMe: async () => {
        try {
          const res = await authApi.getMe() as User | { data: User };
          set({ user: "data" in res ? res.data : res, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        }
      },

      updateProfile: async (data: FormData | Record<string, unknown>) => {
        const res = await authApi.updateProfile(data) as User | { data: User };
        set({ user: "data" in res ? res.data : res });
      },

      setUser: (user: User) => set({ user }),

      setToken: (token: string) => set({ token }),
    }),
    {
      name: "tolumak-auth",
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
    }
  )
);

export function useAuth() {
  const store = useAuthStore();
  return store;
}
