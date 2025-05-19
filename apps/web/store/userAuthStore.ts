import { create } from "zustand";
import { User } from "@shared/types/user";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: async () => {
        set({ user: null });

        // localStorage에서 persist된 데이터 제거
        localStorage.removeItem("auth-storage");

        // 쿠키도 제거
        document.cookie = "isnow_access_token=; Max-Age=0; path=/;";
        document.cookie = "isnow_refresh_token=; Max-Age=0; path=/;";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
