# Premium APK - Mobile-First Android APK Distribution Platform

> **Apps • Games • Premium APKs**  
> Complete standalone web application with manual bKash & Nagad Send Money verification, Firebase Authentication, Cloud Firestore, and an Admin Dashboard (`/talha`).

---

## 🇧🇩 অ্যান্ড্রয়েড ফোন থেকে সরাসরি GitHub এবং Vercel-এ লাইভ করার নিয়ম (১ মিনিট গাইড)

আপনার কোনো কম্পিউটার না থাকলেও নিজের অ্যান্ড্রয়েড ফোন থেকেই ওয়েবসাইটটি Vercel-এ ফ্রিতে লাইভ করতে পারবেন। কোনো বিল্ড এরর বা `'This page doesn't exist'` (404 error) আসবে না, কারণ এতে `vercel.json` এবং `_redirects` প্রি-কনফিগার করা আছে।

### ধাপ ১: GitHub-এ ফাইল আপলোড
1. আপনার ফোনের ক্রোম (Chrome) ব্রাউজারে [github.com](https://github.com/) ওপেন করুন।
2. **New Repository** তৈরি করুন (যেমন: `premium-apk-store`) এবং **Public** সিলেক্ট করুন।
3. প্রজেক্টের জিপ ফাইলটি আনজিপ করে ভেতরের সমস্ত ফাইল ও ফোল্ডার (`src`, `public`, `index.html`, `package.json`, `vercel.json`, ইত্যাদি) রিপোজিটরির মূল ফোল্ডারে (Root Directory) আপলোড করুন।

### ধাপ ২: Vercel-এ ১-ক্লিকে ডিপ্লয় (Deploy)
1. ফোনে [vercel.com](https://vercel.com/) এ গিয়ে আপনার GitHub অ্যাকাউন্ট দিয়ে **Continue with GitHub** লগইন করুন।
2. **"Add New Project"** এ ক্লিক করে আপনার তৈরি করা `premium-apk-store` রিপোজিটরিটি সিলেক্ট করুন।
3. Framework Preset স্বয়ংক্রিয়ভাবে **Vite** ডিটেক্ট করবে।
4. কোনো সেটিং পরিবর্তন না করেই সরাসরি নীল রঙের **"Deploy"** বাটনে চাপ দিন।
5. মাত্র ৩০ সেকেন্ডের মধ্যে আপনার ওয়েবসাইট সম্পূর্ণ ফ্রিতে লাইভ হয়ে যাবে এবং একটি ফ্রি ডোমেন লিংক (যেমন: `premium-apk.vercel.app`) পেয়ে যাবেন!

---

## 🚀 Key Features

- **Mobile-First Layout:** Designed to look and feel like Google Play Store on Android mobile devices with a native bottom navigation bar.
- **Manual Send Money:**
  - bKash Recipient: `01733224349`
  - Nagad Recipient: `01794403914`
  - 1-click copy number button and Bengali instructions.
- **Admin Dashboard (`/talha`):**
  - Protected route for authorized administrator (`abnormaleditz80@gmail.com`).
  - Verify TrxIDs and approve/reject orders.
  - Add, edit, and publish Android APKs.
  - Manage Adsterra ads and site settings.
- **Zero 404 / Routing Errors:**
  - `vercel.json` provides rewrite fallback: `source: /(.*)` -> `destination: /index.html`
  - `public/_redirects` provides Netlify and Cloudflare fallback: `/* /index.html 200`
- **Database & Authentication:**
  - Powered by Firebase Auth and Cloud Firestore.
  - Configured via `firebase-applet-config.json` with secure ABAC rules.

---

## 🛠 Local Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build (creates production dist/ folder)
npm run build
```
