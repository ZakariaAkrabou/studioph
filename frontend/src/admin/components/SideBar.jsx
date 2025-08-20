import { NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice.jsx";

const baseItem =
  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600";
const activeItem =
  "bg-gray-900 text-white hover:bg-gray-800";

function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    dashboard:
      "M3 12l2-2m0 0l7-7 7 7M13 5v6h6M5 10v10h14V10M9 21V12h6v9",
    gallery:
      "M4 5h16v14H4zM8 11l2 2 3-3 3 3",
    categories:
      "M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v6H4zM14 16h6v6h-6z",
    clients:
      "M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 13c3.866 0-7 2.239-7 5v2h10v-2c0-2.761-3.134-5-7-5zm8 0a8.96 8.96 0 00-4 .938A7.003 7.003 0 0121 20v0h-7v-2c0-1.117-.317-2.168-.862-3.062A6.99 6.99 0 0116 13z",
    settings:
      "M10.325 4.317a1 1 0 011.35 0l.9.78a1 1 0 00.73.23l1.16-.11a1 1 0 01.98.63l.45 1.07a1 1 0 00.59.55l1.08.36a1 1 0 01.64.93v1.22a1 1 0 01-.64.93l-1.08.36a1 1 0 00-.59.55l-.45 1.07a1 1 0 01-.98.63l-1.16-.11a1 1 0 00-.73.23l-.9.78a1 1 0 01-1.35 0l-.9-.78a1 1 0 00-.73-.23l-1.16.11a1 1 0 01-.98-.63l-.45-1.07a1 1 0 00-.59-.55l-1.08-.36A1 1 0 013 11.99v-1.22a1 1 0 01.64-.93l1.08-.36a1 1 0 00.59-.55l.45-1.07a1 1 0 01.98-.63l1.16.11a1 1 0 00.73-.23l.9-.78zM12 9a3 3 0 100 6 3 3 0 000-6z",
    logout:
      "M15 12H3m0 0l4-4m-4 4l4 4m6-9h2a2 2 0 012 2v10a2 2 0 01-2 2h-2",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export default function Sidebar({
  mobileOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const nav = useMemo(
    () => [
      { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
      { to: "/admin/portfolio", label: "Portfolio", icon: "gallery" },
      { to: "/admin/categories", label: "Categories", icon: "categories" },
      { to: "/admin/client-spaces", label: "Client Spaces", icon: "clients" },
      { to: "/admin/settings", label: "Settings", icon: "settings" },
    ],
    []
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const width = collapsed ? "w-20" : "w-64";
  const sidebarWidth = collapsed ? "5rem" : "16rem";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 inset-y-0 left-0 bg-white border-r border-gray-200 shadow-sm
          ${width} transform transition-all duration-300 md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:flex
          flex-col
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            {!collapsed && <span className="font-semibold text-gray-900 text-lg">Studio Admin</span>}
          </div>
          
          {/* Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* User Info removed to avoid duplication with navbar */}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${baseItem} ${isActive ? activeItem : ""}`
              }
              onClick={onClose}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <Icon name="logout" className="w-4 h-4" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
