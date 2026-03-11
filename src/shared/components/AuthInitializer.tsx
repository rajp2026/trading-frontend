import { useEffect, useState } from "react";
import { useAuthStore } from "../../core/auth/authstore";
import { authService } from "../../core/auth/authservice";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setToken, setAuth, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Attempt to refresh the access token using the HttpOnly cookie
        const refreshResponse = await authService.refreshToken();
        
        // Temporarily set the access token in Zustand so the next request sends it
        setToken(refreshResponse.access_token);

        // 2. Fetch the user profile using the fresh access token
        const user = await authService.getCurrentUser();

        // 3. Populate full setAuth
        setAuth({ id: user.id, email: user.email, username: user.username }, refreshResponse.access_token);
        
      } catch (error) {
        // If the refresh fails (no valid cookie or expired), ensure Zustand is clean
        logout();
      } finally {
        // Always stop loading
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setToken, setAuth, logout]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
          </svg>
          <p className="text-gray-400 text-sm animate-pulse">Initializing session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
