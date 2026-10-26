import React from 'react';
import { ShieldCheck, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PoliciesPageProps {
  type: 'privacy' | 'terms' | 'refund' | 'disclaimer';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ type }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {type === 'privacy' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
            </h1>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pt-2">
            <p>
              {language === 'bn'
                ? 'প্রিমিয়াম এপিকে (Premium APK) আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে অঙ্গীকারবদ্ধ। আমাদের সাইট ব্যবহারের সময় আপনার কি ধরনের তথ্য সংরক্ষিত হয় এবং তা কিভাবে ব্যবহৃত হয় তা নিচে বর্ণিত হলো।'
                : 'Premium APK is committed to protecting your privacy. This policy outlines the information we collect and how it is used.'}
            </p>

            <h3 className="text-sm font-bold text-white pt-2">
              {language === 'bn' ? '১. সংগৃহীত তথ্য' : '1. Information We Collect'}
            </h3>
            <p>
              {language === 'bn'
                ? 'অ্যাকাউন্ট তৈরির সময় আপনার ইমেইল ও নাম এবং পেইড অ্যাপ ক্রয়ের সময় সেন্ড মানি যাচাইয়ের জন্য প্রেরক মোবাইল নম্বর ও ট্রানজেকশন আইডি (TrxID) গ্রহণ করা হয়। আমরা কখনোই আপনার কোনো ফিনান্সিয়াল পিন (PIN) বা ওটিপি চাই না এবং তা সংরক্ষণ করি না।'
                : 'We collect your email and name upon registration, and your sender mobile number and Transaction ID (TrxID) for manual Send Money verification. We NEVER collect or store financial PINs or OTPs.'}
            </p>

            <h3 className="text-sm font-bold text-white pt-2">
              {language === 'bn' ? '২. তথ্যের ব্যবহার' : '2. How Information is Used'}
            </h3>
            <p>
              {language === 'bn'
                ? 'আপনার প্রদত্ত তথ্য শুধুমাত্র অ্যাপ ডাউনলোড অনুমোদন, অর্ডার যাচাই এবং কাস্টমার সাপোর্টের কাজে ব্যবহৃত হয়। কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা হস্তান্তর করা হয় না।'
                : 'Your information is used solely to verify payment requests, grant download entitlements, and provide support. We do not sell or share private user data with third parties.'}
            </p>
          </div>
        </div>
      )}

      {type === 'terms' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <FileText className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms & Conditions)' : 'Terms & Conditions'}
            </h1>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pt-2">
            <p>
              {language === 'bn'
                ? 'প্রিমিয়াম এপিকে ওয়েবসাইটে প্রবেশের মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন।'
                : 'By accessing or using the Premium APK platform, you agree to comply with and be bound by the following terms.'}
            </p>

            <h3 className="text-sm font-bold text-white pt-2">
              {language === 'bn' ? '১. ম্যানুয়াল সেন্ড মানি নীতি' : '1. Manual Send Money Policy'}
            </h3>
            <p>
              {language === 'bn'
                ? 'আমাদের ওয়েবসাইটে প্রদর্শিত বিকাশ (01733224349) ও নগদ (01794403914) নম্বরে শুধুমাত্র নির্ধারিত পরিমাণ সেন্ড মানি করতে হবে। ভুল নম্বরে টাকা পাঠালে বা ভুল TrxID সাবমিট করলে ডাউনলোড অনুমোদন নিশ্চিত করা সম্ভব নয়।'
                : 'Payment for paid APKs is conducted via manual Send Money to the designated bKash (01733224349) and Nagad (01794403914) numbers. Submission of invalid or already-used TrxIDs will lead to rejection.'}
            </p>

            <h3 className="text-sm font-bold text-white pt-2">
              {language === 'bn' ? '২. ব্যক্তিগত ব্যবহার' : '2. Personal Use Only'}
            </h3>
            <p>
              {language === 'bn'
                ? 'ডাউনলোডকৃত সকল অ্যাপ্লিকেশন শুধুমাত্র ব্যক্তিগত পরীক্ষার উদ্দেশ্যে ব্যবহারযোগ্য। বাণিজ্যিক উদ্দেশ্যে পুনঃবিতরণ নিষিদ্ধ।'
                : 'All downloaded files are intended for personal educational and testing use.'}
            </p>
          </div>
        </div>
      )}

      {type === 'refund' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400">
            <RefreshCw className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'bn' ? 'রিফান্ড নীতি (Refund Policy)' : 'Refund Policy'}
            </h1>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pt-2">
            <p>
              {language === 'bn'
                ? 'ডিজিটাল প্রোডাক্ট ও ম্যানুয়াল সেন্ড মানি যাচাইকরণ ব্যবস্থার কারণে ডাউনলোড লিঙ্ক সফলভাবে আনলক হওয়ার পর সাধারণত টাকা ফেরত যোগ্য নয়।'
                : 'Due to the nature of digital APK downloads and manual peer-to-peer verification, payments are generally non-refundable once download entitlement is granted.'}
            </p>

            <h3 className="text-sm font-bold text-white pt-2">
              {language === 'bn' ? 'ব্যতিক্রমী রিফান্ড পরিস্থিতি' : 'Exceptions'}
            </h3>
            <p>
              {language === 'bn'
                ? 'যদি ভুলবশত অতিরিক্ত টাকা পাঠানো হয় অথবা ফাইল ক্ষতিগ্রস্ত থাকে এবং ২৪ ঘণ্টার মধ্যে সমাধানের বিকল্প প্রদান না করা যায়, তবে উপযুক্ত প্রমাণ সাপেক্ষে অ্যাডমিনের মাধ্যমে টাকা ফেরত বিবেচনা করা হবে।'
                : 'If an accidental duplicate transfer is verified in the financial statement, or if an APK is permanently corrupt without an available update, a manual refund may be arranged by contacting our helpline.'}
            </p>
          </div>
        </div>
      )}

      {type === 'disclaimer' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'bn' ? 'ডিসক্লেইমার ও আইনগত বিজ্ঞপ্তি' : 'Disclaimer & Legal Notice'}
            </h1>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pt-2">
            <p>
              {language === 'bn'
                ? 'প্রিমিয়াম এপিকে একটি স্বাধীন প্ল্যাটফর্ম। প্রদর্শিত সমস্ত ট্রেডমার্ক, ব্র্যান্ড ও লোগো সংশ্লিষ্ট মূল নির্মাতাদের সম্পত্তি।'
                : 'Premium APK is an independent distribution portal. All third-party trademarks and icons belong to their respective copyright holders.'}
            </p>

            <h3 className="text-sm font-bold text-white pt-2">
              {language === 'bn' ? 'ম্যালওয়্যার ও সুরক্ষা সতর্কতা' : 'Security & Malware Disclaimer'}
            </h3>
            <p>
              {language === 'bn'
                ? 'আমরা ফাইল আপলোড করার আগে প্রাথমিক পরীক্ষা করে থাকি। তবে ব্যবহারকারীকে সর্বদা ফাইলটি VirusTotal অথবা গুগল প্লে প্রটেক্টের মাধ্যমে স্ক্যান করে ইন্সটল করার অনুরোধ জানানো হচ্ছে। ডিভাইসের কোনো প্রযুক্তিগত অসঙ্গতির জন্য প্ল্যাটফর্ম দায়ী নয়।'
                : 'Files are scanned before release, but we do not guarantee third-party files are 100% free of vulnerabilities without verified scanning tools. Users install APKs at their own discretion.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
