import { useState, useRef, useEffect } from "react";

export default function Navbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="h-16 px-6 flex items-center justify-between w-full">
        <div className="flex items-center gap-4 flex-1">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 h-10 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-gray-50"
                placeholder="Search..."
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900">Photographer</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <img
              className="w-8 h-8 rounded-full object-cover"
              src="https://i.pravatar.cc/100?img=12"
              alt="avatar"
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm">Profile</button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm">Settings</button>
              <div className="h-px bg-gray-200" />
              <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
