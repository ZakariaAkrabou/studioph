import { NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice.jsx";
import { FiGrid, FiImage, FiTag, FiUsers, FiSettings, FiLogOut } from "react-icons/fi";

const baseItem =
  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600";
const activeItem =
  "bg-gray-900 text-white hover:bg-gray-800";

function Icon({ name, className = "w-5 h-5" }) {
  const map = {
    dashboard: <FiGrid className={className} />,
    gallery: <FiImage className={className} />,
    categories: <FiTag className={className} />,
    clients: <FiUsers className={className} />,
    settings: <FiSettings className={className} />,
    logout: <FiLogOut className={className} />,
  };
  return map[name] || <FiGrid className={className} />;
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
