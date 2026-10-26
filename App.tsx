import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { AppDetailsPage } from './pages/AppDetailsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { PurchasesPage } from './pages/PurchasesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DownloadHistoryPage } from './pages/DownloadHistoryPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AppItem } from './types';
import { testConnection } from './firebase';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/talha') return '/talha';
    return 'home';
  });

  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Validate Firestore connection on boot
    testConnection();

    // Browser history popstate handler
    const handlePopState = () => {
      if (window.location.pathname === '/talha') {
        setCurrentRoute('/talha');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    if (route === '/talha') {
      window.history.pushState(null, '', '/talha');
    } else if (window.location.pathname === '/talha') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectApp = (app: AppItem) => {
    setSelectedApp(app);
    setCurrentRoute('app-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryName(catId);
    setCurrentRoute('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <Header
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
        onOpenAuth={() => setAuthModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {currentRoute === 'home' && (
          <HomePage
            onSelectApp={handleSelectApp}
            onSelectCategory={(catName) => {
              setSelectedCategoryName(catName);
              handleNavigate('categories');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'categories' && (
          <CategoriesPage
            onSelectApp={handleSelectApp}
            selectedCategoryName={selectedCategoryName}
          />
        )}

        {currentRoute === 'search' && (
          <SearchResultsPage
            onSelectApp={handleSelectApp}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {currentRoute === 'app-details' && selectedApp && (
          <AppDetailsPage
            app={selectedApp}
            onBack={() => handleNavigate('home')}
            onOpenAuth={() => setAuthModalOpen(true)}
            onNavigateToPurchases={() => handleNavigate('purchases')}
          />
        )}

        {currentRoute === 'profile' && (
          <UserProfilePage
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentRoute === 'purchases' && (
          <PurchasesPage
            onSelectApp={handleSelectApp}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentRoute === 'favorites' && (
          <FavoritesPage onSelectApp={handleSelectApp} />
        )}

        {currentRoute === 'download-history' && (
          <DownloadHistoryPage onSelectApp={handleSelectApp} />
        )}

        {currentRoute === 'contact' && <ContactPage />}

        {currentRoute === 'privacy-policy' && <PoliciesPage type="privacy" />}
        {currentRoute === 'terms' && <PoliciesPage type="terms" />}
        {currentRoute === 'refund-policy' && <PoliciesPage type="refund" />}
        {currentRoute === 'disclaimer' && <PoliciesPage type="disclaimer" />}

        {currentRoute === '/talha' && (
          <AdminDashboard onOpenAuth={() => setAuthModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Bottom Navigation for Mobile Devices */}
      <BottomNav
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <MainApp />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
