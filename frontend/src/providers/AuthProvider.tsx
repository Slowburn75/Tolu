"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/hooks/useAuth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ReturnType<typeof useAuthStore.getState>["user"];
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, getMe, token } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      getMe();
    }
  }, [token, user, getMe]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
