import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiCamera, FiGlobe } from "react-icons/fi";
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem("lang") || "en");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem("lang", language);
    i18n.changeLanguage(language);
  }, [language]);

  const navItems = [
    { to: "/", label: t('nav.home'), end: true },
    { to: "/gallery", label: t('nav.gallery') },
    { to: "/client", label: t('nav.client') },
    { to: "/about", label: t('nav.about') },
    { to: "/contact", label: t('nav.contact') },
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

            {/* Language Selector */}
            <div className="relative ml-2">
              <button
                onClick={() => setLanguageMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[#B3B3B3] hover:text-[#FFD369] hover:bg-white/5 border border-transparent transition-all"
              >
                <FiGlobe className="w-4 h-4" />
                <span className="hidden lg:inline">{language === "en" ? t('nav.english') : t('nav.french')}</span>
                <span className="inline lg:hidden">{language === "en" ? "EN" : "FR"}</span>
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-md bg-[#141414] border border-white/10 shadow-lg z-50">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLanguageMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-t-md transition-colors ${
                      language === "en" ? "bg-white/5 text-white" : "text-[#B3B3B3] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span>{t('nav.english')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("fr");
                      setLanguageMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-b-md transition-colors ${
                      language === "fr" ? "bg-white/5 text-white" : "text-[#B3B3B3] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">🇫🇷</span>
                    <span>{t('nav.french')}</span>
                  </button>
                </div>
              )}
            </div>
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

              {/* Mobile Language Selector */}
              <div className="pt-2 border-t border-white/10">
                <p className="px-4 pb-1 text-xs uppercase tracking-wide text-[#808080]">{t('nav.language')}</p>
                <div className="flex gap-2 px-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm border transition-all ${
                      language === "en" ? "text-[#0D0D0D] bg-[#C5A46D] border-[#C5A46D]" : "text-[#B3B3B3] border-white/10 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span>{t('nav.english')}</span>
                  </button>
                  <button
                    onClick={() => setLanguage("fr")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm border transition-all ${
                      language === "fr" ? "text-[#0D0D0D] bg-[#C5A46D] border-[#C5A46D]" : "text-[#B3B3B3] border-white/10 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">🇫🇷</span>
                    <span>{t('nav.french')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
