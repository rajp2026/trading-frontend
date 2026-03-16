import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../../features/auth/Login";
import RegisterPage from "../../features/auth/Register";
import ForgotPasswordPage from "../../features/auth/ForgotPassword";
import ResetPasswordPage from "../../features/auth/ResetPassword";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProtectedRoute from "../../shared/components/ProtectedRoute";
import TradingPage from "../../pages/TradingPage";
import AuthInitializer from "../../shared/components/AuthInitializer";

export default function AppRouter() {
  return (
    <AuthInitializer>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected dashboard routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {" "}
            <Route path="/market" element={<TradingPage />} />
            <Route path="/trade" element={<PlaceholderPage title="trade" />} />
            <Route
              path="/portfolio"
              element={<PlaceholderPage title="Portfolio" />}
            />
            <Route
              path="/wallet"
              element={<PlaceholderPage title="Wallet" />}
            />
          </Route>

          {/* Redirect root to trade */}
          <Route path="/" element={<Navigate to="/market" replace />} />
          <Route path="*" element={<Navigate to="/market" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthInitializer>
  );
}

// Temporary placeholder for pages not yet built
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-sm">Coming soon</p>
      </div>
    </div>
  );
}
