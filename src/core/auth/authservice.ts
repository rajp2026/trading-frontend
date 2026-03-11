import { apiClient } from "../api/apiClient";

// ── Types ──────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
}

// ── API Functions ──────────────────────────────────────────

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  },

  getCurrentUser: async (): Promise<RegisterResponse> => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  refreshToken: async (): Promise<RefreshResponse> => {
    const res = await apiClient.post("/auth/refresh");
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post("/auth/logout-all");
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
  },
};
