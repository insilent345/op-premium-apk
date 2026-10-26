import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import {
  AppItem,
  Category,
  SiteSettings,
  PaymentRequest,
  PurchaseEntitlement,
  DownloadHistoryItem,
  FavoriteItem,
  ReviewItem,
  BannerItem,
  AdItem,
  AdminNotification
} from '../types';
import {
  INITIAL_APPS,
  INITIAL_CATEGORIES,
  INITIAL_SITE_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_ADS
} from '../data/seedData';
import { useAuth } from './AuthContext';

interface StoreContextType {
  apps: AppItem[];
  categories: Category[];
  siteSettings: SiteSettings;
  banners: BannerItem[];
  ads: AdItem[];
  paymentRequests: PaymentRequest[];
  userPurchases: PurchaseEntitlement[];
  userFavorites: FavoriteItem[];
  downloadHistory: DownloadHistoryItem[];
  adminNotifications: AdminNotification[];
  loading: boolean;
  refreshApps: () => Promise<void>;
  seedInitialData: () => Promise<void>;
  submitPaymentRequest: (
    appId: string,
    appName: string,
    priceBDT: number,
    method: 'bkash' | 'nagad',
    senderNumber: string,
    trxId: string,
    notes?: string
  ) => Promise<string>;
  approvePaymentRequest: (requestId: string, adminComment?: string) => Promise<void>;
  rejectPaymentRequest: (requestId: string, adminComment: string) => Promise<void>;
  isAppUnlocked: (appId: string) => boolean;
  toggleFavorite: (app: AppItem) => Promise<void>;
  isFavorite: (appId: string) => boolean;
  recordDownload: (app: AppItem) => Promise<void>;
  submitReview: (appId: string, rating: number, comment: string) => Promise<void>;
  getAppReviews: (appId: string) => Promise<ReviewItem[]>;
  saveSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  saveApp: (app: AppItem, isNew?: boolean) => Promise<void>;
  deleteApp: (appId: string) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveBanner: (banner: BannerItem) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
  saveAd: (ad: AdItem) => Promise<void>;
  exportBackupJson: () => string;
  importBackupJson: (jsonData: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [ads, setAds] = useState<AdItem[]>(INITIAL_ADS);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [userPurchases, setUserPurchases] = useState<PurchaseEntitlement[]>([]);
  const [userFavorites, setUserFavorites] = useState<FavoriteItem[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load Settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsRef = doc(db, 'settings', 'site_config');
        const snap = await getDoc(settingsRef);
        if (snap.exists()) {
          setSiteSettings(snap.data() as SiteSettings);
        } else {
          // Initialize site settings with bKash: 01733224349 and Nagad: 01794403914
          await setDoc(settingsRef, INITIAL_SITE_SETTINGS);
        }
      } catch (err) {
        console.warn('Using default site settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Load Apps
  const refreshApps = async () => {
    try {
      const q = collection(db, 'apps');
      const snap = await getDocs(q);
      if (!snap.empty) {
        const loadedApps: AppItem[] = [];
        snap.forEach((d) => loadedApps.push({ ...d.data(), id: d.id } as AppItem));
        setApps(loadedApps);
      } else {
        setApps(INITIAL_APPS);
      }
    } catch (err) {
      console.warn('Fallback to demo apps:', err);
      setApps(INITIAL_APPS);
    }
  };

  useEffect(() => {
    refreshApps().finally(() => setLoading(false));
  }, []);

  // Listen to payment requests if Admin or User
  useEffect(() => {
    if (!currentUser) {
      setPaymentRequests([]);
      setUserPurchases([]);
      setUserFavorites([]);
      setDownloadHistory([]);
      return;
    }

    try {
      let prQuery;
      if (isAdmin) {
        prQuery = collection(db, 'paymentRequests');
      } else {
        prQuery = query(collection(db, 'paymentRequests'), where('userId', '==', currentUser.uid));
      }

      const unsubscribe = onSnapshot(prQuery, (snapshot) => {
        const list: PaymentRequest[] = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id } as PaymentRequest);
        });
        setPaymentRequests(list);
      }, (err) => {
        console.warn('Payment requests listener notice:', err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not attach paymentRequests listener:', err);
    }
  }, [currentUser, isAdmin]);

  // Listen to Purchases / Entitlements
  useEffect(() => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'purchases'), where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: PurchaseEntitlement[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as PurchaseEntitlement));
        setUserPurchases(list);
      }, (err) => {
        console.warn('Purchases listener notice:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not attach purchases listener:', err);
    }
  }, [currentUser]);

  // Listen to Favorites
  useEffect(() => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: FavoriteItem[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as FavoriteItem));
        setUserFavorites(list);
      }, (err) => {
        console.warn('Favorites listener notice:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not attach favorites listener:', err);
    }
  }, [currentUser]);

  // Listen to Download History
  useEffect(() => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'downloadHistory'), where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: DownloadHistoryItem[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as DownloadHistoryItem));
        setDownloadHistory(list);
      }, (err) => {
        console.warn('Download history listener notice:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not attach download history listener:', err);
    }
  }, [currentUser]);

  // Seed Initial Demo Data into Firestore
  const seedInitialData = async () => {
    try {
      for (const app of INITIAL_APPS) {
        await setDoc(doc(db, 'apps', app.id), app);
      }
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      for (const banner of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', banner.id), banner);
      }
      for (const ad of INITIAL_ADS) {
        await setDoc(doc(db, 'ads', ad.id), ad);
      }
      await setDoc(doc(db, 'settings', 'site_config'), INITIAL_SITE_SETTINGS);
      await refreshApps();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seed');
    }
  };

  // Submit manual Send Money payment request
  const submitPaymentRequest = async (
    appId: string,
    appName: string,
    priceBDT: number,
    method: 'bkash' | 'nagad',
    senderNumber: string,
    trxId: string,
    notes?: string
  ): Promise<string> => {
    if (!currentUser) {
      throw new Error('Please sign in to submit a payment request.');
    }

    const cleanTrxId = trxId.trim().toUpperCase();
    const cleanSender = senderNumber.trim();

    // Check duplicate TrxID locally & in existing records
    const existingMatch = paymentRequests.find(
      (pr) => pr.trxId.toUpperCase() === cleanTrxId && pr.status === 'approved'
    );
    if (existingMatch) {
      throw new Error('This Transaction ID has already been verified and approved.');
    }

    const newRequest: Omit<PaymentRequest, 'id'> = {
      userId: currentUser.uid,
      userEmail: currentUser.email || '',
      appId,
      appName,
      appPriceBDT: priceBDT,
      method,
      senderNumber: cleanSender,
      trxId: cleanTrxId,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'paymentRequests'), newRequest);
      // Create admin notification
      if (isAdmin) {
        await addDoc(collection(db, 'notifications'), {
          type: 'payment_pending',
          title: `New ৳${priceBDT} Send Money (${method.toUpperCase()})`,
          message: `${cleanSender} submitted TrxID: ${cleanTrxId} for ${appName}`,
          link: '/talha',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'paymentRequests');
    }
  };

  // Admin approves payment request
  const approvePaymentRequest = async (requestId: string, adminComment?: string) => {
    const target = paymentRequests.find((p) => p.id === requestId);
    if (!target) throw new Error('Payment request not found.');

    try {
      const now = new Date().toISOString();
      // 1. Update PaymentRequest to approved
      await updateDoc(doc(db, 'paymentRequests', requestId), {
        status: 'approved',
        adminComment: adminComment || 'Verified in bKash/Nagad app statement.',
        reviewedBy: currentUser?.email || 'admin',
        reviewedAt: now,
        updatedAt: now,
      });

      // 2. Grant verified Purchase Entitlement
      const entitlementDocId = `entitlement_${target.userId}_${target.appId}`;
      const entitlement: PurchaseEntitlement = {
        id: entitlementDocId,
        userId: target.userId,
        userEmail: target.userEmail,
        appId: target.appId,
        appName: target.appName,
        paymentRequestId: requestId,
        grantedAt: now,
      };
      await setDoc(doc(db, 'purchases', entitlementDocId), entitlement);

      // 3. Increment app download/purchase count
      try {
        const appRef = doc(db, 'apps', target.appId);
        const appSnap = await getDoc(appRef);
        if (appSnap.exists()) {
          const curCount = (appSnap.data().downloadCount || 0) + 1;
          await updateDoc(appRef, { downloadCount: curCount });
        }
      } catch (e) {
        console.warn('App counter increment notice:', e);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `paymentRequests/${requestId}`);
    }
  };

  // Admin rejects payment request
  const rejectPaymentRequest = async (requestId: string, adminComment: string) => {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'paymentRequests', requestId), {
        status: 'rejected',
        adminComment: adminComment.trim() || 'Transaction ID not found in financial app statement.',
        reviewedBy: currentUser?.email || 'admin',
        reviewedAt: now,
        updatedAt: now,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `paymentRequests/${requestId}`);
    }
  };

  // Check if an app is unlocked for the current user
  const isAppUnlocked = (appId: string): boolean => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return false;
    if (!app.isPaid) return true; // Free apps are unlocked
    if (isAdmin) return true; // Admin has preview download access
    return userPurchases.some((p) => p.appId === appId);
  };

  // Toggle Favorite
  const toggleFavorite = async (app: AppItem) => {
    if (!currentUser) throw new Error('Please sign in to save favorites.');
    const favId = `fav_${currentUser.uid}_${app.id}`;
    const exists = userFavorites.some((f) => f.appId === app.id);

    try {
      if (exists) {
        await deleteDoc(doc(db, 'favorites', favId));
      } else {
        const item: FavoriteItem = {
          id: favId,
          userId: currentUser.uid,
          appId: app.id,
          appName: app.name,
          appIcon: app.icon,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'favorites', favId), item);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `favorites/${favId}`);
    }
  };

  const isFavorite = (appId: string): boolean => {
    return userFavorites.some((f) => f.appId === appId);
  };

  // Record Download History
  const recordDownload = async (app: AppItem) => {
    if (!currentUser) return;
    try {
      const docId = `dl_${currentUser.uid}_${app.id}_${Date.now()}`;
      const item: DownloadHistoryItem = {
        id: docId,
        userId: currentUser.uid,
        appId: app.id,
        appName: app.name,
        appVersion: app.version,
        isPaid: app.isPaid,
        downloadedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'downloadHistory', docId), item);
    } catch (err) {
      console.warn('Could not log download history:', err);
    }
  };

  // Reviews
  const submitReview = async (appId: string, rating: number, comment: string) => {
    if (!currentUser) throw new Error('Please sign in to submit a review.');
    try {
      const reviewData: Omit<ReviewItem, 'id'> = {
        appId,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        userPhoto: currentUser.photoURL || '',
        rating,
        comment: comment.trim(),
        isApproved: true,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'reviews'), reviewData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    }
  };

  const getAppReviews = async (appId: string): Promise<ReviewItem[]> => {
    try {
      const q = query(collection(db, 'reviews'), where('appId', '==', appId));
      const snap = await getDocs(q);
      const list: ReviewItem[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ReviewItem));
      return list;
    } catch (err) {
      console.warn('Error fetching reviews:', err);
      return [];
    }
  };

  // Manage Settings
  const saveSiteSettings = async (settings: Partial<SiteSettings>) => {
    try {
      const merged = { ...siteSettings, ...settings, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'settings', 'site_config'), merged);
      setSiteSettings(merged);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/site_config');
    }
  };

  // Manage Apps
  const saveApp = async (app: AppItem, isNew: boolean = false) => {
    try {
      const targetId = isNew ? (app.id || `app-${Date.now()}`) : app.id;
      const data = { ...app, id: targetId, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'apps', targetId), data);
      await refreshApps();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `apps/${app.id}`);
    }
  };

  const deleteApp = async (appId: string) => {
    try {
      await deleteDoc(doc(db, 'apps', appId));
      await refreshApps();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `apps/${appId}`);
    }
  };

  // Manage Categories
  const saveCategory = async (cat: Category) => {
    try {
      await setDoc(doc(db, 'categories', cat.id), cat);
      setCategories((prev) => {
        const idx = prev.findIndex((c) => c.id === cat.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = cat;
          return next;
        }
        return [...prev, cat];
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${cat.id}`);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${categoryId}`);
    }
  };

  // Manage Banners
  const saveBanner = async (banner: BannerItem) => {
    try {
      await setDoc(doc(db, 'banners', banner.id), banner);
      setBanners((prev) => {
        const idx = prev.findIndex((b) => b.id === banner.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = banner;
          return next;
        }
        return [...prev, banner];
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `banners/${banner.id}`);
    }
  };

  const deleteBanner = async (bannerId: string) => {
    try {
      await deleteDoc(doc(db, 'banners', bannerId));
      setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `banners/${bannerId}`);
    }
  };

  // Manage Ads
  const saveAd = async (ad: AdItem) => {
    try {
      const data = { ...ad, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'ads', ad.id), data);
      setAds((prev) => {
        const idx = prev.findIndex((a) => a.id === ad.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data;
          return next;
        }
        return [...prev, data];
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `ads/${ad.id}`);
    }
  };

  // Export JSON Backup
  const exportBackupJson = (): string => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      siteSettings,
      categories,
      apps,
      banners,
      ads,
      paymentRequests,
      userPurchases,
    };
    return JSON.stringify(backup, null, 2);
  };

  // Import JSON Backup
  const importBackupJson = async (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.apps || !Array.isArray(parsed.apps)) {
        throw new Error('Invalid backup file: missing apps collection.');
      }

      if (parsed.siteSettings) {
        await setDoc(doc(db, 'settings', 'site_config'), parsed.siteSettings);
        setSiteSettings(parsed.siteSettings);
      }
      for (const app of parsed.apps) {
        await setDoc(doc(db, 'apps', app.id), app);
      }
      if (parsed.categories) {
        for (const cat of parsed.categories) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
      }
      await refreshApps();
    } catch (err) {
      console.error('Backup import error:', err);
      throw err;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        apps,
        categories,
        siteSettings,
        banners,
        ads,
        paymentRequests,
        userPurchases,
        userFavorites,
        downloadHistory,
        adminNotifications,
        loading,
        refreshApps,
        seedInitialData,
        submitPaymentRequest,
        approvePaymentRequest,
        rejectPaymentRequest,
        isAppUnlocked,
        toggleFavorite,
        isFavorite,
        recordDownload,
        submitReview,
        getAppReviews,
        saveSiteSettings,
        saveApp,
        deleteApp,
        saveCategory,
        deleteCategory,
        saveBanner,
        deleteBanner,
        saveAd,
        exportBackupJson,
        importBackupJson,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
