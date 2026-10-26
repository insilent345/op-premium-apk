import React from 'react';
import { Star, Download, Heart, Crown, Sparkles } from 'lucide-react';
import { AppItem } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface AppCardProps {
  app: AppItem;
  onSelect: (app: AppItem) => void;
  layout?: 'grid' | 'list';
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelect, layout = 'grid' }) => {
  const { isFavorite, toggleFavorite } = useStore();
  const { t } = useLanguage();
  const favorite = isFavorite(app.id);

  if (layout === 'list') {
    return (
      <div
        onClick={() => onSelect(app)}
        className="group relative flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer active:scale-[0.99]"
      >
        <img
          src={app.icon}
          alt={app.name}
          className="w-14 h-14 rounded-2xl object-cover bg-slate-800 border border-slate-700/60 shadow-md flex-shrink-0 group-hover:scale-105 transition-transform"
          loading="lazy"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
              {app.name}
            </h3>
            {app.isPaid && (
              <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>{app.category}</span>
            <span>•</span>
            <span>{app.fileSize}</span>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{app.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {app.downloadCount.toLocaleString()} {t('downloads')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              app.isPaid
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {app.isPaid ? `৳ ${app.priceBDT}` : t('free')}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(app);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`}
            />
          </button>
        </div>
      </div>
    );
  }

  // Grid layout (Play Store card style)
  return (
    <div
      onClick={() => onSelect(app)}
      className="group relative flex flex-col p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-800 mb-2.5">
        <img
          src={app.icon}
          alt={app.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(app);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-rose-400 transition-colors"
        >
          <Heart
            className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Free / Price tag pill */}
        <div className="absolute bottom-2 left-2">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm ${
              app.isPaid
                ? 'bg-amber-500/90 text-slate-950 font-extrabold'
                : 'bg-emerald-500/90 text-slate-950 font-extrabold'
            }`}
          >
            {app.isPaid ? `৳ ${app.priceBDT}` : t('free')}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {app.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{app.category}</p>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{app.rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {app.fileSize}
          </span>
        </div>
      </div>
    </div>
  );
};
