import React, { useState } from 'react';
import {
  Smartphone,
  Gamepad2,
  Sparkles,
  Crown,
  Wrench,
  Film,
  MessageCircle,
  Grid,
  Filter
} from 'lucide-react';
import { AppItem } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { AppCard } from '../components/AppCard';
import { AdBanner } from '../components/AdBanner';

interface CategoriesPageProps {
  onSelectApp: (app: AppItem) => void;
  selectedCategoryName?: string | null;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone className="w-5 h-5 text-cyan-400" />;
    case 'Gamepad2':
      return <Gamepad2 className="w-5 h-5 text-amber-400" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-emerald-400" />;
    case 'Crown':
      return <Crown className="w-5 h-5 text-yellow-400" />;
    case 'Wrench':
      return <Wrench className="w-5 h-5 text-blue-400" />;
    case 'Film':
      return <Film className="w-5 h-5 text-purple-400" />;
    case 'MessageCircle':
      return <MessageCircle className="w-5 h-5 text-rose-400" />;
    default:
      return <Grid className="w-5 h-5 text-cyan-400" />;
  }
};

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onSelectApp,
  selectedCategoryName,
}) => {
  const { apps, categories } = useStore();
  const { language, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string | null>(
    selectedCategoryName || null
  );
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');

  const filteredApps = apps.filter((app) => {
    if (!app.isPublished) return false;

    // Filter by Category
    if (activeCategory) {
      if (activeCategory === 'Free Premium APK') {
        if (app.isPaid) return false;
      } else if (activeCategory === 'Paid Premium APK') {
        if (!app.isPaid) return false;
      } else if (app.category !== activeCategory) {
        return false;
      }
    }

    // Filter by Free/Paid
    if (filterType === 'free' && app.isPaid) return false;
    if (filterType === 'paid' && !app.isPaid) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {language === 'bn' ? 'অ্যাপ ক্যাটাগরি সমূহ' : 'App Categories'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'আপনার পছন্দের ক্যাটাগরি বেছে নিয়ে সেরা অ্যান্ড্রয়েড অ্যাপস ও গেমস এক্সপ্লোর করুন।'
              : 'Browse 7 curated categories of verified Android applications and games.'}
          </p>
        </div>
      </div>

      {/* Category Pills / Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <button
          onClick={() => setActiveCategory(null)}
          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeCategory === null
              ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Grid className="w-5 h-5 text-cyan-400 mb-2" />
          <span className="text-xs font-bold line-clamp-1">
            {language === 'bn' ? 'সব অ্যাপস' : 'All Apps'}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {apps.filter((a) => a.isPublished).length} apps
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = activeCategory === cat.name;
          const count = apps.filter((a) => {
            if (!a.isPublished) return false;
            if (cat.name === 'Free Premium APK') return !a.isPaid;
            if (cat.name === 'Paid Premium APK') return a.isPaid;
            return a.category === cat.name;
          }).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="mb-2">{getCategoryIcon(cat.icon)}</div>
              <span className="text-xs font-bold line-clamp-1">
                {language === 'bn' ? cat.nameBn : cat.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{count} apps</span>
            </button>
          );
        })}
      </div>

      {/* Adsterra Category Top Banner */}
      <AdBanner placement="category" type="social_bar" />

      {/* Filter Tabs (All / Free / Paid) */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span>{activeCategory || (language === 'bn' ? 'সব অ্যাপস' : 'All Apps')}</span>
          <span className="text-xs font-normal text-slate-400">
            ({filteredApps.length})
          </span>
        </h2>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'সব' : 'All'}
          </button>
          <button
            onClick={() => setFilterType('free')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'free'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('free')}
          </button>
          <button
            onClick={() => setFilterType('paid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'paid'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('paid')}
          </button>
        </div>
      </div>

      {/* Apps Grid */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onSelect={onSelectApp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
          <p className="text-slate-400 text-sm">{t('noAppsFound')}</p>
        </div>
      )}
    </div>
  );
};
