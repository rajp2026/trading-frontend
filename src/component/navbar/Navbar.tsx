import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../core/auth/authstore";
import { authService } from "../../core/auth/authservice";

const navItems = [
  { label: "Markets", path: "/markets" },
  { label: "Trade", path: "/trade" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Wallet", path: "/wallet" },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {}
    logout();
    navigate("/login");
  };

  const handleLogoutAll = async () => {
    setLoggingOut(true);
    try {
      await authService.logoutAll();
    } catch {}
    logout();
    navigate("/login");
  };

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 h-14 border-b border-white/5 bg-[#0d0d14]/80 backdrop-blur-md">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          CryptoTrade
        </span>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right Section */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>

          {/* Username */}
          <span className="text-sm text-gray-300 hidden sm:block">
            {user?.username || "User"}
          </span>

          {/* Arrow */}
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showDropdown && (
          <>
            {/* Click outside */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#16161e] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                Logout
              </button>

              <button
                onClick={handleLogoutAll}
                disabled={loggingOut}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                Logout All Devices
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
