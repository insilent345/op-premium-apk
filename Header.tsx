import React, { useState } from 'react';
import {
  Search,
  Globe,
  User as UserIcon,
  Shield,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  Heart,
  HelpCircle,
  LogOut,
  LogIn,
  FileDown
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
  onOpenAuth: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentRoute,
  onOpenAuth,
  searchQuery,
  onSearchChange,
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => handleNav('home')}
          className="cursor-pointer transition-transform active:scale-95"
        >
          <Logo />
        </div>

        {/* Search Bar (Desktop & Tablet) */}
        <div className="hidden sm:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => {
                if (currentRoute !== 'search') onNavigate('search');
              }}
              placeholder={t('searchPlaceholder')}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile search button */}
          <button
            onClick={() => handleNav('search')}
            className="sm:hidden p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/40 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Standalone Project ZIP Download Button */}
          <a
            href="/premium_apk_complete_standalone.zip"
            download="premium_apk_complete_standalone.zip"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/50 transition-colors shadow-sm active:scale-95"
            title="GitHub / Vercel এর জন্য সম্পূর্ণ সোর্স কোড ZIP ডাউনলোড করুন"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ZIP Download</span>
            <span className="sm:hidden">ZIP</span>
          </a>

          {/* Admin shortcut badge if authorized */}
          {isAdmin && (
            <button
              onClick={() => handleNav('/talha')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all shadow-sm shadow-amber-500/10"
              title="Admin Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin /talha</span>
            </button>
          )}

          {/* User Auth / Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-500/40 transition-colors"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User"
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[90px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-sm">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="font-semibold text-slate-200 truncate">
                      {currentUser.displayName || 'User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        Authorized Admin
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 text-xs font-medium"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span>{t('profile')}</span>
                  </button>

                  <button
                    onClick={() => handleNav('purchases')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 text-xs font-medium"
                  >
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    <span>{t('purchases')}</span>
                  </button>

                  <button
                    onClick={() => handleNav('favorites')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 text-xs font-medium"
                  >
                    <Heart className="w-4 h-4 text-cyan-400" />
                    <span>{t('favorites')}</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleNav('/talha')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-amber-300 hover:bg-amber-950/40 text-xs font-bold border-t border-slate-800 mt-1 pt-2"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>{t('adminDashboard')} (/talha)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 text-xs font-medium border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-900"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold ${
                currentRoute === 'home'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => handleNav('categories')}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold ${
                currentRoute === 'categories'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t('categories')}
            </button>
            <button
              onClick={() => handleNav('purchases')}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold ${
                currentRoute === 'purchases'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t('purchases')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => handleNav('favorites')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 text-xs text-slate-300"
            >
              <Heart className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('favorites')}</span>
            </button>
            <button
              onClick={() => handleNav('download-history')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 text-xs text-slate-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('downloadHistory')}</span>
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 text-xs text-slate-300"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('contact')}</span>
            </button>
            <a
              href="/premium_apk_complete_standalone.zip"
              download="premium_apk_complete_standalone.zip"
              className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/60 text-xs text-emerald-300 font-bold border border-emerald-500/40"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>GitHub/Vercel ZIP</span>
            </a>
            {isAdmin && (
              <button
                onClick={() => handleNav('/talha')}
                className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/20 text-xs text-amber-300 font-bold border border-amber-500/40"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin /talha</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
