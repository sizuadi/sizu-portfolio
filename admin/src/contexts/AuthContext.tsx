/**
 * Auth Context
 *
 * State auth disimpan hanya di React state (in-memory).
 * Token ada di HttpOnly cookie — kita tidak bisa baca isinya.
 * Kita hanya track apakah user sudah login atau belum.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek session saat pertama load (via /auth/me)
  // Jika cookie valid → user tersedia, jika tidak → null
  useEffect(() => {
    authApi.me()
      .then((res) => {
        if (res.success && res.data) {
          setUser({ id: res.data.sub, email: res.data.email, role: res.data.role });
        }
      })
      .catch(() => {}) // tidak ada session = bukan error
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const res = await authApi.login(email, password);
    if (!res.success || !res.data) {
      return { error: res.error ?? "Login gagal" };
    }
    setUser({ id: res.data.id, email: res.data.email, role: res.data.role });
    return {};
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}
