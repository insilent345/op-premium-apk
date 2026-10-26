import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Brand & Navigation
    siteName: 'প্রিমিয়াম এপিকে',
    tagline: 'অ্যাপস • গেমস • প্রিমিয়াম APK',
    home: 'হোম',
    categories: 'ক্যাটাগরি',
    search: 'অনুসন্ধান',
    favorites: 'পছন্দের তালিকা',
    purchases: 'ক্রয়কৃত অ্যাপস',
    downloadHistory: 'ডাউনলোড হিস্টোরি',
    profile: 'প্রোফাইল',
    adminDashboard: 'অ্যাডমিন প্যানেল',
    login: 'লগইন',
    register: 'রেজিস্ট্রেশন',
    logout: 'লগআউট',
    contact: 'যোগাযোগ',
    privacyPolicy: 'গোপনীয়তা নীতি',
    terms: 'শর্তাবলী',
    refundPolicy: 'রিফান্ড নীতি',
    disclaimer: 'ডিসক্লেইমার',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',

    // App sections
    featuredApps: 'ফিচার্ড অ্যাপস',
    popularApps: 'জনপ্রিয় অ্যাপস',
    latestApps: 'নতুন রিলিজ',
    topRatedApps: 'শীর্ষ রেটিংপ্রাপ্ত',
    viewAll: 'সবগুলো দেখুন',
    free: 'ফ্রি',
    paid: 'পেইড',
    version: 'ভার্সন',
    size: 'সাইজ',
    rating: 'রেটিং',
    downloads: 'ডাউনলোড',
    whatsNew: 'নতুন কি এসেছে',
    description: 'বিস্তারিত বিবরণ',
    screenshots: 'স্ক্রিনশট সমূহ',
    downloadNow: 'এখনই ডাউনলোড করুন',
    buyNow: 'কিনুন / সেন্ড মানি',
    reviews: 'রিভিউ ও মতামত',
    writeReview: 'রিভিউ লিখুন',
    noAppsFound: 'কোনো অ্যাপ খুঁজে পাওয়া যায়নি।',
    loading: 'লোড হচ্ছে...',
    searchPlaceholder: 'অ্যাপ বা গেম খুঁজুন...',

    // Payment & Send Money
    sendMoneyTitle: 'ম্যানুয়াল সেন্ড মানি পেমেন্ট',
    sendMoneySubtitle: 'বিকাশ অথবা নগদ অ্যাপের মাধ্যমে টাকা পাঠিয়ে অ্যাপ ডাউনলোড আনলক করুন।',
    step1: '১. পেমেন্ট মেথড নির্বাচন করুন',
    step2: '২. নিচের নম্বরে নির্দিষ্ট পরিমাণ টাকা সেন্ড মানি (Send Money) করুন',
    recipientNumber: 'প্রাপক নম্বর:',
    copyNumber: 'নম্বর কপি করুন',
    copied: 'কপি হয়েছে!',
    amountToPay: 'প্রদেয় পরিমাণ:',
    step3: '৩. ট্রানজেকশন তথ্য সাবমিট করুন',
    senderNumberLabel: 'আপনার বিকাশ/নগদ নম্বর (১১ ডিজিট):',
    trxIdLabel: 'ট্রানজেকশন আইডি (TrxID):',
    notesLabel: 'মন্তব্য (ঐচ্ছিক):',
    submitPayment: 'পেমেন্ট রিকোয়েস্ট পাঠান',
    submitting: 'জমা দেওয়া হচ্ছে...',
    paymentPendingNotice: 'পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই করার পর অ্যাপটি ডাউনলোড করার অনুমতি দেওয়া হবে।',
    pendingStatus: 'যাচাই প্রক্রিয়াধীন (Pending)',
    approvedStatus: 'অনুমোদিত (Approved)',
    rejectedStatus: 'বাতিল (Rejected)',

    // Profile & Entitlements
    myPurchasesTitle: 'আমার ক্রয়কৃত পেইড অ্যাপস',
    noPurchasesYet: 'আপনি এখনও কোনো পেইড অ্যাপ ক্রয় করেননি।',
    verifiedToDownload: 'ডাউনলোড আনলক হয়েছে! নিচে ক্লিক করে APK ফাইল সংরক্ষণ করুন।',
    downloadApk: 'APK ফাইল ডাউনলোড করুন',
    freeDownloadNotice: 'ফ্রি অ্যাপস ডাউনলোড করতে শুধুমাত্র লগইন করলেই চলবে।',

    // Admin & Security
    adminAccessOnly: 'শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য।',
    adminLoginPrompt: 'অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে অনুমোদিত ইমেইল দিয়ে লগইন করুন।',
    unauthorized: 'অননুমোদিত প্রবেশাধিকার!',
    setupGuide: 'মোবাইল অ্যাডমিন গাইড (বাংলা)',
  },
  en: {
    // Brand & Navigation
    siteName: 'Premium APK',
    tagline: 'Apps • Games • Premium APKs',
    home: 'Home',
    categories: 'Categories',
    search: 'Search',
    favorites: 'Favorites',
    purchases: 'Purchased Apps',
    downloadHistory: 'Download History',
    profile: 'Profile',
    adminDashboard: 'Admin Panel',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    contact: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    refundPolicy: 'Refund Policy',
    disclaimer: 'Disclaimer',
    allRightsReserved: 'All rights reserved.',

    // App sections
    featuredApps: 'Featured Apps',
    popularApps: 'Popular Apps',
    latestApps: 'Latest Releases',
    topRatedApps: 'Top Rated',
    viewAll: 'View All',
    free: 'Free',
    paid: 'Paid',
    version: 'Version',
    size: 'Size',
    rating: 'Rating',
    downloads: 'Downloads',
    whatsNew: "What's New",
    description: 'Description',
    screenshots: 'Screenshots',
    downloadNow: 'Download Now',
    buyNow: 'Buy Now / Send Money',
    reviews: 'Ratings & Reviews',
    writeReview: 'Write a Review',
    noAppsFound: 'No applications found.',
    loading: 'Loading...',
    searchPlaceholder: 'Search apps or games...',

    // Payment & Send Money
    sendMoneyTitle: 'Manual Send Money Payment',
    sendMoneySubtitle: 'Send exact BDT amount via bKash or Nagad Send Money to unlock download.',
    step1: '1. Select Payment Method',
    step2: '2. Send Money to recipient number below',
    recipientNumber: 'Recipient Number:',
    copyNumber: 'Copy Number',
    copied: 'Copied!',
    amountToPay: 'Amount to Pay:',
    step3: '3. Submit Transaction Details',
    senderNumberLabel: 'Sender Phone Number (11 digits):',
    trxIdLabel: 'Transaction ID (TrxID):',
    notesLabel: 'Notes (Optional):',
    submitPayment: 'Submit Payment Request',
    submitting: 'Submitting...',
    paymentPendingNotice: 'Payment request submitted! Admin will verify in their bKash/Nagad app and grant download access.',
    pendingStatus: 'Pending Verification',
    approvedStatus: 'Approved & Ready',
    rejectedStatus: 'Rejected',

    // Profile & Entitlements
    myPurchasesTitle: 'My Purchased Apps',
    noPurchasesYet: 'You have not purchased any paid apps yet.',
    verifiedToDownload: 'Verified & Unlocked! Click below to download the APK file.',
    downloadApk: 'Download APK File',
    freeDownloadNotice: 'Free apps only require logging in to download.',

    // Admin & Security
    adminAccessOnly: 'Authorized Administrator Only.',
    adminLoginPrompt: 'Please sign in with the authorized admin email address to access.',
    unauthorized: 'Unauthorized Access!',
    setupGuide: 'Mobile Setup Guide',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('premium_apk_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('premium_apk_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
