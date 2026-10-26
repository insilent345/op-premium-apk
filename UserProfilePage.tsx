import React from 'react';
import { User, Mail, Shield, ShoppingBag, Heart, Clock, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

interface UserProfilePageProps {
  onNavigate: (route: string) => void;
  onOpenAuth: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onNavigate, onOpenAuth }) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { language, t } = useLanguage();
  const { paymentRequests, userFavorites, downloadHistory } = useStore();

  if (!currentUser) {
    return (
      <div className="text-center py-20 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 max-w-md mx-auto my-12">
        <User className="w-16 h-16 text-cyan-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">
          {language === 'bn' ? 'প্রোফাইল দেখতে সাইন ইন করুন' : 'Sign in to view profile'}
        </h2>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-cyan-600/30 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xl font-bold">
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white truncate">
              {currentUser.displayName || 'Android User'}
            </h1>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentUser.email}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold">
                Member
              </span>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                  Authorized Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Admin Shortcut Button */}
        {isAdmin && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-amber-300">Admin Control Panel</p>
                <p className="text-[11px] text-amber-200/70">Verify payments, upload APKs, manage ads</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/talha')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Enter /talha
            </button>
          </div>
        )}
      </div>

      {/* Account Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate('purchases')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs font-bold text-white">{t('purchases')}</p>
              <p className="text-[11px] text-slate-400">{paymentRequests.length} records</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('favorites')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-xs font-bold text-white">{t('favorites')}</p>
              <p className="text-[11px] text-slate-400">{userFavorites.length} apps</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('download-history')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs font-bold text-white">{t('downloadHistory')}</p>
              <p className="text-[11px] text-slate-400">{downloadHistory.length} logs</p>
            </div>
          </div>
        </button>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-2xl bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-950/30 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{t('logout')}</span>
      </button>
    </div>
  );
};
