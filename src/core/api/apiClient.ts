import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "../auth/authstore";

/* ------------------------------------------------ */
/* AXIOS INSTANCE */
/* ------------------------------------------------ */

export const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------------------------------ */
/* REQUEST INTERCEPTOR */
/* Attach access token from Zustand */
/* ------------------------------------------------ */

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ------------------------------------------------ */
/* RESPONSE INTERCEPTOR */
/* Handle access token refresh */
/* ------------------------------------------------ */

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    /* ------------------------------------------------ */
    /* HANDLE 401 TOKEN EXPIRED */
    /* ------------------------------------------------ */

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/logout")
    ) {
      if (isRefreshing) {
        /* wait for token refresh */
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }

              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        /* refresh token request
           refresh cookie is automatically sent */
        const { data } = await apiClient.post("/auth/refresh");

        const newAccessToken = data.access_token;

        /* update Zustand store */
        useAuthStore.getState().setToken(newAccessToken);

        /* resolve queued requests */
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        /* logout if refresh fails */
        useAuthStore.getState().logout();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);