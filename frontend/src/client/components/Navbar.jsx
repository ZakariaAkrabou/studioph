import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiCamera } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/gallery", label: "Gallery" },
    { to: "/client", label: "Client Area" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center ring-1 ring-white/10 bg-[#141414] group-hover:ring-[#FFD369]/40 transition-all">
              <FiCamera className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg md:text-xl font-bold text-white">StudioPH</span>
              <p className="text-[10px] md:text-xs text-[#B3B3B3] -mt-0.5">Photography Studio</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 border ${
                    isActive
                      ? "text-[#0D0D0D] bg-[#C5A46D] border-[#C5A46D]"
                      : "text-[#B3B3B3] border-transparent hover:text-[#FFD369] hover:bg-white/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/5 transition-all"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-white/10">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-base font-medium transition-all duration-300 border ${
                      isActive
                        ? "text-[#0D0D0D] bg-[#C5A46D] border-[#C5A46D]"
                        : "text-[#B3B3B3] border-transparent hover:text-[#FFD369] hover:bg-white/5"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
