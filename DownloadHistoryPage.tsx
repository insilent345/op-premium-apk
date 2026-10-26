import React, { useState } from 'react';
import { Clock, Download, CheckCircle, Smartphone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { AppItem } from '../types';
import { MalwareWarningModal } from '../components/MalwareWarningModal';

interface DownloadHistoryPageProps {
  onSelectApp: (app: AppItem) => void;
}

export const DownloadHistoryPage: React.FC<DownloadHistoryPageProps> = ({ onSelectApp }) => {
  const { downloadHistory, apps } = useStore();
  const { language, t } = useLanguage();
  const [downloadModalApp, setDownloadModalApp] = useState<AppItem | null>(null);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            <span>{t('downloadHistory')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'আপনার পূর্ববর্তী ডাউনলোড করা এপিকে ফাইল সমূহের হিস্টোরি।'
              : 'Record of your previously downloaded APK files with re-download options.'}
          </p>
        </div>
      </div>

      {downloadHistory.length > 0 ? (
        <div className="space-y-3">
          {downloadHistory.map((item) => {
            const matchedApp = apps.find((a) => a.id === item.appId);
            const downloadDate = new Date(item.downloadedAt).toLocaleString();

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {matchedApp?.icon ? (
                    <img
                      src={matchedApp.icon}
                      alt={item.appName}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 font-bold">
                      APK
                    </div>
                  )}

                  <div>
                    <h3
                      onClick={() => matchedApp && onSelectApp(matchedApp)}
                      className="text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {item.appName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Version: {item.appVersion} • {downloadDate}
                    </p>
                  </div>
                </div>

                {matchedApp && (
                  <button
                    onClick={() => setDownloadModalApp(matchedApp)}
                    className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                    title="Download Again"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Clock className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">
            {language === 'bn' ? 'কোনো ডাউনলোড হিস্টোরি নেই' : 'No download history yet'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'অ্যাপ ডাউনলোড শুরু করলে এখানে সেগুলোর হিস্টোরি সংরক্ষিত হবে।'
              : 'When you download APKs while signed in, they will be logged here.'}
          </p>
        </div>
      )}

      {downloadModalApp && (
        <MalwareWarningModal
          app={downloadModalApp}
          isOpen={!!downloadModalApp}
          onClose={() => setDownloadModalApp(null)}
        />
      )}
    </div>
  );
};
