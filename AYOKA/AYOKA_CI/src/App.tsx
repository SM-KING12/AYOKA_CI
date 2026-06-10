import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ItinerariesProvider } from './contexts/ItinerariesContext';
import { PartnerProvider } from './contexts/PartnerContext';
import { LayoutShell } from './components/SaasLayout';
import { partnerRoutes, adminRoutes } from './routes/app.routes';

// Public pages
import Navbar from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorerPage from './pages/ExplorerPage';
import DestinationPage from './pages/DestinationPage';
import BookingPage from './pages/BookingPage';
import AssistantPage from './pages/AssistantPage';
import ReservationsPage from './pages/ReservationsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ItinerariesPage from './pages/ItinerariesPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage';
import ItineraryGeneratorPage from './pages/ItineraryGeneratorPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// SaaS pages (shared between partner and admin)
import SaasDashboardPage from './pages/saas/DashboardPage';
import ServicesPage from './pages/saas/ServicesPage';
import SaasReservationsPage from './pages/saas/ReservationsPage';
import CalendarPage from './pages/saas/CalendarPage';
import MessagesPage from './pages/saas/MessagesPage';
import SaasProfilePage from './pages/saas/ProfilePage';
import StatisticsPage from './pages/saas/StatisticsPage';

// Admin-specific pages
import PartnersPage from './pages/admin/PartnersPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import MonitoringPage from './pages/admin/MonitoringPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// ── Page maps (single source of truth for route → component) ──

const partnerPageMap: Record<string, React.ComponentType> = {
  dashboard: SaasDashboardPage,
  services: ServicesPage,
  reservations: SaasReservationsPage,
  calendar: CalendarPage,
  messages: MessagesPage,
  profile: SaasProfilePage,
  statistics: StatisticsPage,
};

const adminPageMap: Record<string, React.ComponentType> = {
  dashboard: SaasDashboardPage,
  partners: PartnersPage,
  services: ServicesPage,
  reservations: SaasReservationsPage,
  monitoring: MonitoringPage,
  notifications: AdminNotificationsPage,
  statistics: StatisticsPage,
  settings: AdminSettingsPage,
};

// ── Public layout wrapper ──

function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNav =
    location.pathname.startsWith('/partner') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/assistant' ||
    location.pathname.startsWith('/auth');
  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}

// ── Route definitions ──

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/explorer" element={<PublicLayout><ExplorerPage /></PublicLayout>} />
      <Route path="/destination/:id" element={<PublicLayout><DestinationPage /></PublicLayout>} />
      <Route path="/booking/:id" element={<PublicLayout><BookingPage /></PublicLayout>} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/reservations" element={<PublicLayout><ReservationsPage /></PublicLayout>} />
      <Route path="/profil" element={<PublicLayout><ProfilePage /></PublicLayout>} />
      <Route path="/dashboard" element={<PublicLayout><DashboardPage /></PublicLayout>} />
      <Route path="/notifications" element={<PublicLayout><NotificationsPage /></PublicLayout>} />
      <Route path="/itineraires" element={<PublicLayout><ItinerariesPage /></PublicLayout>} />
      <Route path="/itineraires/generer" element={<PublicLayout><ItineraryGeneratorPage /></PublicLayout>} />
      <Route path="/itineraires/:id" element={<PublicLayout><ItineraryDetailPage /></PublicLayout>} />

      {/* Auth routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Partner routes — LayoutShell with partner sidebar */}
      <Route path="/partner" element={<LayoutShell routes={partnerRoutes} basePath="/partner" role="partner" />}>
        {partnerRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={React.createElement(partnerPageMap[route.path])}
          />
        ))}
      </Route>

      {/* Admin routes — LayoutShell with admin sidebar */}
      <Route path="/admin" element={<LayoutShell routes={adminRoutes} basePath="/admin" role="admin" />}>
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={React.createElement(adminPageMap[route.path])}
          />
        ))}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <NotificationsProvider>
            <ItinerariesProvider>
              <PartnerProvider>
                <AppRoutes />
              </PartnerProvider>
            </ItinerariesProvider>
          </NotificationsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
