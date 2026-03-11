import { Outlet } from "react-router-dom";
import Navbar from "../component/navbar/Navbar";

export default function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

    </div>
  );
}