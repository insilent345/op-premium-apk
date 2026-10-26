import React, { useState, useEffect } from 'react';
import {
  Download,
  Star,
  ShieldCheck,
  Calendar,
  Layers,
  HardDrive,
  Heart,
  Crown,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Send,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { AppItem, ReviewItem } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SendMoneyModal } from '../components/SendMoneyModal';
import { MalwareWarningModal } from '../components/MalwareWarningModal';
import { AdBanner } from '../components/AdBanner';

interface AppDetailsPageProps {
  app: AppItem;
  onBack: () => void;
  onOpenAuth: () => void;
  onNavigateToPurchases: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  app,
  onBack,
  onOpenAuth,
  onNavigateToPurchases,
}) => {
  const {
    isFavorite,
    toggleFavorite,
    isAppUnlocked,
    paymentRequests,
    submitReview,
    getAppReviews,
  } = useStore();
  const { currentUser, isAdmin } = useAuth();
  const { language, t } = useLanguage();

  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const favorite = isFavorite(app.id);
  const unlocked = isAppUnlocked(app.id);

  // Find user's payment request for this app
  const userRequest = paymentRequests.find(
    (pr) => pr.appId === app.id && pr.userId === currentUser?.uid
  );

  useEffect(() => {
    getAppReviews(app.id).then(setReviews);
  }, [app.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: app.name,
        text: `Download ${app.name} on Premium APK Store!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await submitReview(app.id, reviewRating, reviewComment.trim());
      setReviewComment('');
      const updated = await getAppReviews(app.id);
      setReviews(updated);
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
      </button>

      {/* Main Hero Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={app.icon}
            alt={app.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover bg-slate-800 border-2 border-cyan-500/30 shadow-lg flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold">
                {app.category}
              </span>
              {app.isPaid ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>৳ {app.priceBDT} BDT</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  {t('free')}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 line-clamp-2">
              {app.name}
            </h1>

            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{app.rating.toFixed(1)}</span>
                <span className="text-slate-500 font-normal">({app.reviewCount})</span>
              </div>
              <span>•</span>
              <span>
                {app.downloadCount.toLocaleString()} {t('downloads')}
              </span>
              <span>•</span>
              <span>{app.fileSize}</span>
            </div>
          </div>

          {/* Quick Actions (Favorite & Share) */}
          <div className="flex items-center gap-2 sm:self-start">
            <button
              onClick={() => toggleFavorite(app)}
              className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors"
              title="Bookmark"
            >
              <Heart
                className={`w-5 h-5 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Button Section based on Free / Paid / Approval Status */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Message or Warning */}
          <div className="text-xs">
            {!currentUser ? (
              <span className="text-amber-400">
                ⚠️ {language === 'bn' ? 'ডাউনলোড করতে লগইন করুন।' : 'Login required to download.'}
              </span>
            ) : app.isPaid ? (
              unlocked ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'পেমেন্ট অনুমোদিত! ডাউনলোড আনলক করা হয়েছে।'
                      : 'Payment Approved! Download Unlocked.'}
                  </span>
                </div>
              ) : userRequest?.status === 'pending' ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? `পেমেন্ট রিকোয়েস্ট (${userRequest.method.toUpperCase()}) যাচাই হচ্ছে...`
                      : `Payment request (${userRequest.method.toUpperCase()}) pending verification...`}
                  </span>
                </div>
              ) : userRequest?.status === 'rejected' ? (
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <XCircle className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? `পেমেন্ট বাতিল হয়েছে: ${userRequest.adminComment || 'ভুল TrxID'}`
                      : `Payment Rejected: ${userRequest.adminComment || 'Invalid TrxID'}`}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400">
                  {language === 'bn'
                    ? 'বিকাশ অথবা নগদ সেন্ড মানি করে ডাউনলোড আনলক করুন।'
                    : 'Send exact BDT via bKash or Nagad to unlock download.'}
                </span>
              )
            ) : (
              <span className="text-emerald-400 font-medium">
                ✓ {language === 'bn' ? 'ফ্রি লাইসেন্স - কোনো চার্জ নেই' : 'Free License - No Charge'}
              </span>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-extrabold text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>
                  {language === 'bn' ? 'লগইন করে ডাউনলোড করুন' : 'Sign In to Download'}
                </span>
              </button>
            ) : !app.isPaid || unlocked ? (
              <button
                onClick={() => setDownloadModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>
                  {unlocked && app.isPaid
                    ? language === 'bn' ? 'আনলকড APK ডাউনলোড করুন' : 'Download Unlocked APK'
                    : language === 'bn' ? 'ফ্রি APK ডাউনলোড করুন' : 'Download Free APK'}
                </span>
              </button>
            ) : userRequest?.status === 'pending' ? (
              <button
                onClick={onNavigateToPurchases}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>{language === 'bn' ? 'স্ট্যাটাস দেখুন' : 'Check Status'}</span>
              </button>
            ) : (
              <button
                onClick={() => setSendMoneyModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? `কিনুন / সেন্ড মানি (৳ ${app.priceBDT})`
                    : `Buy Now / Send Money (৳ ${app.priceBDT})`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meta Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <Layers className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">{t('version')}</div>
            <div className="font-semibold text-white mt-0.5">{app.version}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">{t('size')}</div>
            <div className="font-semibold text-white mt-0.5">{app.fileSize}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Release Date</div>
            <div className="font-semibold text-white mt-0.5">{app.releaseDate}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">OS Support</div>
            <div className="font-semibold text-white mt-0.5">Android 8.0+</div>
          </div>
        </div>
      </div>

      {/* Screenshots Gallery */}
      {app.screenshots && app.screenshots.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>{t('screenshots')}</span>
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {app.screenshots.map((shot, idx) => (
              <img
                key={idx}
                src={shot}
                alt={`Screenshot ${idx + 1}`}
                className="w-48 sm:w-60 h-72 sm:h-80 object-cover rounded-2xl border border-slate-800 bg-slate-900 shadow-md flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      {/* What's New Box */}
      {app.whatsNew && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-cyan-300">{t('whatsNew')}</h3>
          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
            {app.whatsNew}
          </p>
        </div>
      )}

      {/* Adsterra Native Placement */}
      <AdBanner placement="app_details" type="native_banner" />

      {/* Full Description */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-white">{t('description')}</h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {app.description}
        </div>
      </div>

      {/* Ratings & User Reviews */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">{t('reviews')}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(app.rating) ? 'fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-300 font-bold">{app.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-500">
                ({reviews.length} {language === 'bn' ? 'টি রিভিউ' : 'reviews'})
              </span>
            </div>
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">{t('writeReview')}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setReviewRating(s)}
                  className="p-1 text-slate-600 hover:text-amber-400"
                >
                  <Star
                    className={`w-4 h-4 ${
                      s <= reviewRating ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            rows={2}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'অ্যাপটি কেমন কাজ করছে? আপনার মতামত লিখুন...'
                : 'Share your experience with this app...'
            }
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-100 placeholder:text-slate-600 outline-none resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? '...' : language === 'bn' ? 'পোস্ট করুন' : 'Post Review'}</span>
            </button>
          </div>
        </form>

        {/* Review Items List */}
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      {rev.userName[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-white">{rev.userName}</span>
                  </div>
                  <div className="flex items-center text-amber-400 text-xs">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-800'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 pl-8">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">
            {language === 'bn' ? 'এখনও কোনো রিভিউ দেওয়া হয়নি।' : 'No reviews yet. Be the first to review!'}
          </p>
        )}
      </div>

      {/* Modals */}
      <SendMoneyModal
        app={app}
        isOpen={sendMoneyModalOpen}
        onClose={() => setSendMoneyModalOpen(false)}
        onSuccessNavigate={onNavigateToPurchases}
      />

      <MalwareWarningModal
        app={app}
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
};
