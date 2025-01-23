// store/authStore.js
import { create } from "zustand";
import { API } from "@/utils/api";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (credentials) => {
    try {
      const res = await fetch(API.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      set({
        isAuthenticated: true,
        user: data.user,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  logout: async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        set({
          isAuthenticated: false,
          user: null,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },

  checkAuthStatus: async () => {
    try {
      const res = await fetch("/api/auth/verify");
      const data = await res.json();

      set({
        isAuthenticated: data.authenticated,
        user: data.authenticated ? data.user : null,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
      });
    }
  },
}));

export default useAuthStore;
