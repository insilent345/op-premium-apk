import React from 'react';
import { Home, Grid, ShoppingBag, Heart, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenAuth,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around safe-bottom">
      {/* Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
          currentRoute === 'home'
            ? 'text-cyan-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">{t('home')}</span>
      </button>

      {/* Categories */}
      <button
        onClick={() => onNavigate('categories')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
          currentRoute === 'categories'
            ? 'text-cyan-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">{t('categories')}</span>
      </button>

      {/* Purchased / Entitlements */}
      <button
        onClick={() => (currentUser ? onNavigate('purchases') : onOpenAuth())}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
          currentRoute === 'purchases'
            ? 'text-cyan-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px]">{t('purchases')}</span>
      </button>

      {/* Favorites */}
      <button
        onClick={() => (currentUser ? onNavigate('favorites') : onOpenAuth())}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
          currentRoute === 'favorites'
            ? 'text-cyan-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px]">{t('favorites')}</span>
      </button>

      {/* Admin or Profile */}
      {isAdmin ? (
        <button
          onClick={() => onNavigate('/talha')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            currentRoute === '/talha'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-amber-500/80 hover:text-amber-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      ) : (
        <button
          onClick={() => (currentUser ? onNavigate('profile') : onOpenAuth())}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            currentRoute === 'profile'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{currentUser ? t('profile') : t('login')}</span>
        </button>
      )}
    </nav>
  );
};
