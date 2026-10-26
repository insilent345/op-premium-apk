import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { siteSettings } = useStore();
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact Us'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? 'পেমেন্ট ভেরিফিকেশন, নতুন অ্যাপ রিকোয়েস্ট বা যেকোনো সহায়তায় আমাদের মেসেজ করুন।'
            : 'Get assistance with payment verification, app requests, or technical support.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Helpline */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <Phone className="w-5 h-5 text-cyan-400 mb-2" />
          <h3 className="text-xs font-bold text-white">
            {language === 'bn' ? 'হটলাইন নম্বর' : 'Helpline'}
          </h3>
          <p className="text-xs text-slate-400 font-mono">{siteSettings.contactPhone}</p>
        </div>

        {/* WhatsApp */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
          <h3 className="text-xs font-bold text-white">WhatsApp Support</h3>
          <p className="text-xs text-slate-400 font-mono">{siteSettings.contactWhatsapp}</p>
        </div>

        {/* Email */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <Mail className="w-5 h-5 text-purple-400 mb-2" />
          <h3 className="text-xs font-bold text-white">Email Address</h3>
          <p className="text-xs text-slate-400 truncate">{siteSettings.contactEmail}</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">
          {language === 'bn' ? 'মেসেজ পাঠান' : 'Send a Direct Message'}
        </h2>

        {sent ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>
              {language === 'bn'
                ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! শীঘ্রই আমরা যোগাযোগ করব।'
                : 'Thank you! Your message has been sent to the support team.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'আপনার নাম:' : 'Your Name:'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর:' : 'Email or Phone Number:'}
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com or 017XXXXXXXX"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'বার্তা লিখুন:' : 'Message:'}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'আপনার প্রশ্ন বা সমস্যার বিবরণ লিখুন...'
                    : 'Describe your query or transaction issue...'
                }
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
