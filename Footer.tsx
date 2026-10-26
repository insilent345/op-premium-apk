import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-10 pb-20 sm:pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <Logo />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {language === 'bn'
                ? 'প্রিমিয়াম এপিকে হলো অ্যান্ড্রয়েড ফোনের জন্য বিশ্বস্ত ও দ্রুততম মড ও প্রিমিয়াম এপিকে স্টোর। সহজ বিকাশ ও নগদ সেন্ড মানি সাপোর্টের সাথে সম্পূর্ণ মোবাইল ফ্রেন্ডলি ইন্টারফেস।'
                : 'Premium APK is a fast, safe Android APK distribution platform for Bangladeshi users with manual bKash & Nagad Send Money verification.'}
            </p>
            <div className="flex items-center gap-3 pt-1">
              {/* Payment badges */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-300 font-semibold text-[11px]">
                <div className="w-3.5 h-3.5 rounded-full bg-pink-600 flex items-center justify-center text-[8px] text-white font-bold">
                  b
                </div>
                <span>bKash Send Money</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-600 flex items-center justify-center text-[8px] text-white font-bold">
                  ন
                </div>
                <span>Nagad Send Money</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'bn' ? 'দরকারী লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('categories')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('purchases')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('purchases')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'bn' ? 'পলিসি ও শর্তাবলী' : 'Legal & Policies'}
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('privacyPolicy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('terms')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('refund-policy')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('refundPolicy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('disclaimer')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer note */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>
              {language === 'bn'
                ? 'সুরক্ষিত ও বিশ্বস্ত অ্যান্ড্রয়েড এপিকে বিতরণ প্ল্যাটফর্ম'
                : 'Secure & Verified Android APK Distribution'}
            </span>
          </div>
          <div>
            © {new Date().getFullYear()} Premium APK. {t('allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
};
