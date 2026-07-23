import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PortfolioGallery } from './components/PortfolioGallery';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectLightbox } from './components/ProjectLightbox';
import { BookingModal } from './components/BookingModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PortfolioManager } from './components/admin/PortfolioManager';
import { AddEditProjectModal } from './components/admin/AddEditProjectModal';
import { CategoryManager } from './components/admin/CategoryManager';
import { BookingsManager } from './components/admin/BookingsManager';
import { TestimonialsManager } from './components/admin/TestimonialsManager';
import { MessagesManager } from './components/admin/MessagesManager';
import { WebsiteContentManager } from './components/admin/WebsiteContentManager';
import { TrashManager } from './components/admin/TrashManager';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { SettingsView } from './components/admin/SettingsView';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

const MainContent: React.FC = () => {
  const { viewMode, isAdminAuthenticated, activeAdminTab } = usePortfolio();

  return (
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {viewMode === 'public' && <Header />}

      {viewMode === 'public' ? (
        <main className="flex-1">
          <HeroSection />
          <PortfolioGallery />
          <ServicesSection />
          <TestimonialsSection />
          <ContactSection />
          <Footer />
        </main>
      ) : !isAdminAuthenticated ? (
        <AdminLoginModal />
      ) : (
        <AdminLayout>
          {activeAdminTab === 'dashboard' && <AdminDashboard />}
          {activeAdminTab === 'services' && <ServicesSection />}
          {activeAdminTab === 'portfolio' && <PortfolioManager />}
          {activeAdminTab === 'categories' && <CategoryManager />}
          {activeAdminTab === 'bookings' && <BookingsManager />}
          {activeAdminTab === 'testimonials' && <TestimonialsManager />}
          {activeAdminTab === 'messages' && <MessagesManager />}
          {activeAdminTab === 'content' && <WebsiteContentManager />}
          {activeAdminTab === 'trash' && <TrashManager />}
          {activeAdminTab === 'analytics' && <AnalyticsView />}
          {activeAdminTab === 'settings' && <SettingsView />}
        </AdminLayout>
      )}

      {/* Global Modals */}
      <ProjectLightbox />
      <BookingModal />
      <AddEditProjectModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioProvider>
        <MainContent />
      </PortfolioProvider>
    </ErrorBoundary>
  );
}
