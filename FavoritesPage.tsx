import React from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { AppItem } from '../types';
import { AppCard } from '../components/AppCard';

interface FavoritesPageProps {
  onSelectApp: (app: AppItem) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onSelectApp }) => {
  const { userFavorites, apps } = useStore();
  const { language, t } = useLanguage();

  const favoriteApps = apps.filter((a) => userFavorites.some((f) => f.appId === a.id));

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>{t('favorites')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'আপনার পছন্দের বুকমার্ক করা অ্যাপস তালিকা।'
              : 'Your saved favorite apps and games for quick access.'}
          </p>
        </div>
      </div>

      {favoriteApps.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {favoriteApps.map((app) => (
            <AppCard key={app.id} app={app} onSelect={onSelectApp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Heart className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">
            {language === 'bn' ? 'কোনো পছন্দের অ্যাপ নেই' : 'No favorites saved yet'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'যেকোনো অ্যাপে হার্ট আইকনে ক্লিক করে পছন্দের তালিকায় যোগ করুন।'
              : 'Tap the heart icon on any app to save it to your favorites list.'}
          </p>
        </div>
      )}
    </div>
  );
};
