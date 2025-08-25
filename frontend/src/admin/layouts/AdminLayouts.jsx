import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-3 md:p-4 bg-white">
        
          <Outlet />
        </main>
      </div>
    </div>
  );
}
