import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  Star,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Crown
} from 'lucide-react';
import { AppItem, Category } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { AppCard } from '../components/AppCard';
import { AdBanner } from '../components/AdBanner';

interface HomePageProps {
  onSelectApp: (app: AppItem) => void;
  onSelectCategory: (catId: string) => void;
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectApp,
  onSelectCategory,
  onNavigate,
}) => {
  const { apps, categories, banners } = useStore();
  const { language, t } = useLanguage();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const publishedApps = apps.filter((a) => a.isPublished);

  const featuredApps = publishedApps.filter((a) => a.isFeatured);
  const popularApps = [...publishedApps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8);
  const latestApps = [...publishedApps].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  ).slice(0, 8);
  const topRatedApps = [...publishedApps].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const activeBanners = banners.filter((b) => b.active);

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Promotional Banner Carousel */}
      {activeBanners.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl mx-2 sm:mx-0">
          <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full max-h-72">
            <img
              src={activeBanners[activeBannerIndex]?.imageUrl || activeBanners[0]?.imageUrl}
              alt="Banner"
              className="w-full h-full object-cover brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 sm:p-8 flex flex-col justify-end">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] sm:text-xs font-bold w-fit mb-1.5 uppercase tracking-wider">
                ⚡ Featured
              </span>
              <h2 className="text-base sm:text-2xl font-extrabold text-white line-clamp-1">
                {activeBanners[activeBannerIndex]?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl mt-1">
                {activeBanners[activeBannerIndex]?.subtitle}
              </p>
            </div>
          </div>

          {activeBanners.length > 1 && (
            <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeBannerIndex ? 'bg-cyan-400 w-6' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Horizontal Scrollbar */}
      <div className="overflow-x-auto scrollbar-none py-1 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => onNavigate('categories')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition-all shadow-sm"
          >
            <span>{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all"
            >
              {language === 'bn' ? cat.nameBn : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Adsterra Home Banner */}
      <AdBanner placement="home" type="banner" />

      {/* Featured Apps Section */}
      {featuredApps.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                {t('featuredApps')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {featuredApps.slice(0, 5).map((app) => (
              <AppCard key={app.id} app={app} onSelect={onSelectApp} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Apps Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {t('popularApps')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {popularApps.map((app) => (
            <AppCard key={app.id} app={app} onSelect={onSelectApp} />
          ))}
        </div>
      </section>

      {/* Manual Send Money Trust Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'bn'
                ? 'বিকাশ ও নগদে ১০০% নিরাপদ ম্যানুয়াল সেন্ড মানি'
                : '100% Safe Manual Send Money via bKash & Nagad'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'পেইড অ্যাপ অর্ডার করার পর অ্যাডমিন নিজে ট্রানজেকশন যাচাই করে ডাউনলোড লিঙ্ক আনলক করেন।'
                : 'Admins personally verify your Send Money TrxID in their financial app.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('purchases')}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5"
        >
          <Crown className="w-4 h-4" />
          <span>{language === 'bn' ? 'ক্রয়কৃত অ্যাপস দেখুন' : 'My Purchases'}</span>
        </button>
      </div>

      {/* Latest Releases Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {t('latestApps')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {latestApps.map((app) => (
            <AppCard key={app.id} app={app} onSelect={onSelectApp} />
          ))}
        </div>
      </section>

      {/* Top Rated Apps Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {t('topRatedApps')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {topRatedApps.map((app) => (
            <AppCard key={app.id} app={app} onSelect={onSelectApp} />
          ))}
        </div>
      </section>
    </div>
  );
};
