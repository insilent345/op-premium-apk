import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { AppItem } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { AppCard } from '../components/AppCard';

interface SearchResultsPageProps {
  onSelectApp: (app: AppItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  onSelectApp,
  searchQuery,
  onSearchChange,
}) => {
  const { apps, categories } = useStore();
  const { language, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'topRated'>('popular');

  const filteredApps = apps
    .filter((app) => {
      if (!app.isPublished) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = app.name.toLowerCase().includes(query);
        const matchDesc = app.description.toLowerCase().includes(query);
        const matchCat = app.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && app.category !== selectedCategory) {
        return false;
      }

      // Pricing filter
      if (selectedPricing === 'free' && app.isPaid) return false;
      if (selectedPricing === 'paid' && !app.isPaid) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloadCount - a.downloadCount;
      if (sortBy === 'latest') {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      if (sortBy === 'topRated') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="space-y-5 pb-12">
      {/* Search Bar & Stats */}
      <div className="space-y-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          {language === 'bn' ? 'অ্যাপস অনুসন্ধান' : 'Search Applications'}
        </h1>

        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 placeholder:text-slate-500 outline-none shadow-inner"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-cyan-400" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">{t('categories')}:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-cyan-500"
          >
            <option value="all">{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {language === 'bn' ? c.nameBn : c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedPricing('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${
              selectedPricing === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'সব' : 'All'}
          </button>
          <button
            onClick={() => setSelectedPricing('free')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${
              selectedPricing === 'free'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('free')}
          </button>
          <button
            onClick={() => setSelectedPricing('paid')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${
              selectedPricing === 'paid'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('paid')}
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-semibold">
            {language === 'bn' ? 'সর্ট করুন:' : 'Sort by:'}
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-cyan-500"
          >
            <option value="popular">{t('popularApps')}</option>
            <option value="latest">{t('latestApps')}</option>
            <option value="topRated">{t('topRatedApps')}</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="text-xs text-slate-400 flex items-center justify-between">
        <span>
          {language === 'bn' ? 'ফলাফল পাওয়া গেছে' : 'Found'}:{' '}
          <strong className="text-white">{filteredApps.length}</strong>{' '}
          {language === 'bn' ? 'টি অ্যাপ' : 'apps'}
        </span>
      </div>

      {/* Results Grid */}
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
