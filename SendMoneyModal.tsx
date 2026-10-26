import React, { useState } from 'react';
import { Copy, Check, AlertCircle, ShieldCheck, X, Smartphone, ArrowRight } from 'lucide-react';
import { AppItem, PaymentMethod } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SendMoneyModalProps {
  app: AppItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: () => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  app,
  isOpen,
  onClose,
  onSuccessNavigate,
}) => {
  const { siteSettings, submitPaymentRequest } = useStore();
  const { currentUser } = useAuth();
  const { language } = useLanguage();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const recipientNumber =
    selectedMethod === 'bkash'
      ? siteSettings.bkashNumber || '01733224349'
      : siteSettings.nagadNumber || '01794403914';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(recipientNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanNumber = senderNumber.trim();
    const cleanTrx = trxId.trim().toUpperCase();

    // Validation
    if (!/^01\d{9}$/.test(cleanNumber)) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).'
      );
      return;
    }

    if (cleanTrx.length < 6) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন।'
          : 'Please enter a valid Transaction ID (TrxID).'
      );
      return;
    }

    setSubmitting(true);
    try {
      await submitPaymentRequest(
        app.id,
        app.name,
        app.priceBDT,
        selectedMethod,
        cleanNumber,
        cleanTrx,
        notes
      );

      setSuccessMsg(
        language === 'bn'
          ? 'পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই করার পর আপনার ডাউনলোড অপশন চালু হবে।'
          : 'Payment request submitted successfully! Admin will verify and unlock download.'
      );

      setTimeout(() => {
        if (onSuccessNavigate) {
          onSuccessNavigate();
        } else {
          onClose();
        }
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit payment request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={app.icon}
            alt={app.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
          />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 line-clamp-1">
              {app.name}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-cyan-400 font-extrabold text-sm sm:text-base">
                ৳ {app.priceBDT} BDT
              </span>
              <span className="text-slate-400">• {app.version}</span>
            </div>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="p-3 mb-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-cyan-300">
              {language === 'bn' ? 'ম্যানুয়াল সেন্ড মানি নির্দেশাবলী' : 'Manual Send Money Guide'}
            </p>
            <p className="text-[11px] text-cyan-100/80 mt-0.5">
              {language === 'bn'
                ? 'এটি কোনো অটোমেটিক পেমেন্ট গেটওয়ে নয়। অনুগ্রহ করে আপনার বিকাশ বা নগদ অ্যাপ থেকে "Send Money" করে নিচে ট্রানজেকশন তথ্য দিন।'
                : 'This is manual Send Money. Transfer via bKash or Nagad, then enter your TrxID below for admin verification.'}
            </p>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            {language === 'bn' ? '১. পেমেন্ট মেথড বেছে নিন:' : '1. Choose Payment Method:'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* bKash */}
            <button
              type="button"
              onClick={() => setSelectedMethod('bkash')}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                selectedMethod === 'bkash'
                  ? 'border-pink-500 bg-pink-500/10 text-pink-400 ring-2 ring-pink-500/30 font-bold'
                  : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] font-black">
                b
              </div>
              <span>bKash (বিকাশ)</span>
            </button>

            {/* Nagad */}
            <button
              type="button"
              onClick={() => setSelectedMethod('nagad')}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                selectedMethod === 'nagad'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-2 ring-amber-500/30 font-bold'
                  : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">
                ন
              </div>
              <span>Nagad (নগদ)</span>
            </button>
          </div>
        </div>

        {/* Recipient Number Card with Copy Button */}
        <div className="p-3.5 mb-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {selectedMethod === 'bkash' ? 'bKash Send Money' : 'Nagad Send Money'}{' '}
              {language === 'bn' ? 'প্রাপক নম্বর:' : 'Recipient Number:'}
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              Personal (ব্যক্তিগত)
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wider">
                {recipientNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyNumber}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'নম্বর কপি' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-0.5">
            {language === 'bn' ? (
              <>
                আপনার {selectedMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} অ্যাপে ঢুকে <b>Send Money</b>{' '}
                অপশনে গিয়ে ঠিক <b>৳ {app.priceBDT}</b> টাকা পাঠান।
              </>
            ) : (
              <>
                Open your {selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} app and{' '}
                <b>Send Money</b> exact <b>৳ {app.priceBDT}</b> BDT to the number above.
              </>
            )}
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'bn'
                ? '২. আপনার প্রেরক মোবাইল নম্বর (১১ ডিজিট):'
                : '2. Sender Mobile Number (11 digits):'}
            </label>
            <input
              type="tel"
              required
              maxLength={11}
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="017XXXXXXXX"
              className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-100 placeholder:text-slate-600 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'bn'
                ? '৩. ট্রানজেকশন আইডি (TrxID):'
                : '3. Transaction ID (TrxID):'}
            </label>
            <input
              type="text"
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value.toUpperCase())}
              placeholder="e.g. BL947K18X9"
              className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-100 placeholder:text-slate-600 outline-none font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'bn' ? 'মন্তব্য (ঐচ্ছিক):' : 'Notes (Optional):'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: আর্জেন্ট ডাউনলোড প্রয়োজন' : 'Optional note'}
              className="w-full h-9 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
            />
          </div>

          {/* Error & Success Feedback */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {submitting ? (
                <span>{language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...'}</span>
              ) : (
                <>
                  <span>
                    {language === 'bn' ? 'পেমেন্ট তথ্য সাবমিট করুন' : 'Submit Payment Info'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-3 text-[10px] text-center text-slate-500">
          🔒 {language === 'bn'
            ? 'আমরা কখনই আপনার পিন (PIN) বা ওটিপি (OTP) চাই না। সতর্ক থাকুন।'
            : 'We never ask for your bKash/Nagad PIN or OTP. Keep your account secure.'}
        </p>
      </div>
    </div>
  );
};
