import { create } from "zustand";

interface AuthState {
  user: { id: string; email: string; username: string } | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: AuthState["user"], token: string) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  setToken: (token) =>
    set({
      token,
      isAuthenticated: !!token,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));