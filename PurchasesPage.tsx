import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Copy,
  Check,
  Crown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AppItem } from '../types';
import { MalwareWarningModal } from '../components/MalwareWarningModal';

interface PurchasesPageProps {
  onSelectApp: (app: AppItem) => void;
  onOpenAuth: () => void;
}

export const PurchasesPage: React.FC<PurchasesPageProps> = ({ onSelectApp, onOpenAuth }) => {
  const { paymentRequests, userPurchases, apps } = useStore();
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);
  const [downloadModalApp, setDownloadModalApp] = useState<AppItem | null>(null);

  if (!currentUser) {
    return (
      <div className="text-center py-20 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">
          {language === 'bn' ? 'ক্রয়কৃত অ্যাপস দেখতে লগইন করুন' : 'Sign in to view your purchases'}
        </h2>
        <p className="text-xs text-slate-400">
          {language === 'bn'
            ? 'আপনার বিকাশ বা নগদ পেমেন্ট রিকোয়েস্ট ও অনুমোদিত ডাউনলোড দেখতে সাইন ইন করুন।'
            : 'Access your payment requests, approval statuses, and authorized APK downloads.'}
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  const handleCopyTrx = (trx: string) => {
    navigator.clipboard.writeText(trx);
    setCopiedTrx(trx);
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span>{t('myPurchasesTitle')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'আপনার বিকাশ ও নগদ সেন্ড মানি রিকোয়েস্টের অবস্থা ও অনুমোদিত ডাউনলোড সমূহ।'
              : 'Track your bKash & Nagad Send Money verification requests and downloads.'}
          </p>
        </div>
      </div>

      {paymentRequests.length === 0 && userPurchases.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">{t('noPurchasesYet')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'কোনো পেইড গেম বা ভিআইপি অ্যাপে গিয়ে "কিনুন / সেন্ড মানি" অপশন থেকে রিকোয়েস্ট পাঠান।'
              : 'Explore paid premium APKs and submit a manual Send Money request to unlock downloads.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentRequests.map((req) => {
            const matchedApp = apps.find((a) => a.id === req.appId);
            const isApproved = req.status === 'approved';
            const isPending = req.status === 'pending';
            const isRejected = req.status === 'rejected';

            return (
              <div
                key={req.id}
                className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {matchedApp?.icon ? (
                    <img
                      src={matchedApp.icon}
                      alt={req.appName}
                      className="w-14 h-14 rounded-2xl object-cover bg-slate-800 border border-slate-700 shadow flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-cyan-950 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
                      APK
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        onClick={() => matchedApp && onSelectApp(matchedApp)}
                        className="text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {req.appName}
                      </h3>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        ৳ {req.appPriceBDT} BDT
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span className="uppercase font-semibold text-slate-300">
                        {req.method === 'bkash' ? 'bKash' : 'Nagad'}
                      </span>
                      <span>•</span>
                      <span>From: {req.senderNumber}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300">
                        <span>TrxID: {req.trxId}</span>
                        <button
                          onClick={() => handleCopyTrx(req.trxId)}
                          className="p-1 hover:text-white"
                          title="Copy TrxID"
                        >
                          {copiedTrx === req.trxId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Admin response comments if available */}
                    {req.adminComment && (
                      <div className="text-[11px] text-slate-400 mt-1 italic">
                        Admin Note: "{req.adminComment}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Download Action */}
                <div className="flex flex-col sm:items-end gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Status Badge */}
                  {isApproved && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold w-fit">
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('approvedStatus')}</span>
                    </span>
                  )}
                  {isPending && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold w-fit">
                      <Clock className="w-4 h-4" />
                      <span>{t('pendingStatus')}</span>
                    </span>
                  )}
                  {isRejected && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold w-fit">
                      <XCircle className="w-4 h-4" />
                      <span>{t('rejectedStatus')}</span>
                    </span>
                  )}

                  {/* If Approved: Direct Download button */}
                  {isApproved && matchedApp && (
                    <button
                      onClick={() => setDownloadModalApp(matchedApp)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs hover:from-emerald-400 hover:to-cyan-400 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'APK ডাউনলোড' : 'Download APK'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Download Modal */}
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
