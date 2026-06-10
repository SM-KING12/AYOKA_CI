import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Bell,
  Menu,
  LogOut,
} from 'lucide-react';
import type { AppRoute } from '../routes/app.routes';
import { usePartner } from '../contexts/PartnerContext';
import { useAuth } from '../contexts/AuthContext';

// ── Shared Sidebar ──
// Dynamically rendered from route definitions.
// Works for both admin and partner roles.

interface SidebarProps {
  routes: AppRoute[];
  basePath: '/partner' | '/admin';
  role: 'partner' | 'admin';
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ routes, basePath, role, mobileOpen, onClose }: SidebarProps) {
  const { unreadMessageCount, unreadAdminNotifications } = usePartner();

  const unreadBadge = role === 'admin' ? unreadAdminNotifications : unreadMessageCount;

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-navy-800 h-screen sticky top-0">
        <SidebarContent routes={routes} basePath={basePath} role={role} unreadBadge={unreadBadge} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-navy-800 lg:hidden"
            >
              <SidebarContent routes={routes} basePath={basePath} role={role} unreadBadge={unreadBadge} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  routes,
  basePath,
  role,
  unreadBadge = 0,
  onClose,
}: {
  routes: AppRoute[];
  basePath: '/partner' | '/admin';
  role: 'partner' | 'admin';
  unreadBadge?: number;
  onClose?: () => void;
}) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-9 h-9 bg-gradient-to-br from-ai-400 to-ai-600 rounded-xl flex items-center justify-center shadow-ai-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl text-white">
            AYOKA<span className="text-gold-500"> CI</span>
          </span>
        </Link>
        <div className="mt-3 text-white/40 text-xs font-body">
          {role === 'admin' ? 'Administration' : 'Espace Partenaire'}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {routes.map((route) => {
          const fullPath = `${basePath}/${route.path}`;
          const active = location.pathname === fullPath;
          const Icon = route.icon;
          const badge = route.path === 'messages' || route.path === 'notifications'
            ? (unreadBadge > 0 ? unreadBadge : undefined)
            : undefined;

          return (
            <Link
              key={route.path}
              to={fullPath}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-medium text-sm transition-all duration-200 ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{route.label}</span>
              {badge !== undefined && (
                <span className="w-5 h-5 rounded-full bg-ai-400 text-white text-[10px] font-heading font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-heading font-medium text-sm transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

// ── Shared TopBar ──

interface TopBarProps {
  onMenuToggle: () => void;
  role: 'partner' | 'admin';
}

export function TopBar({ onMenuToggle, role }: TopBarProps) {
  const { profile, unreadMessageCount, unreadAdminNotifications } = usePartner();
  const { user } = useAuth();

  const unread = role === 'admin' ? unreadAdminNotifications : unreadMessageCount;
  const notifPath = role === 'admin' ? '/admin/notifications' : '/partner/messages';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-navy-800" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ai-400/30 focus:border-ai-400 w-64 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to={notifPath}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-500" />
          {unread > 0 && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ai-400" />
          )}
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
            <span className="text-white font-heading font-semibold text-xs">{user?.avatar || profile.avatar}</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-heading font-semibold text-sm text-navy-800">
              {role === 'admin' ? 'Admin AYOKA' : profile.businessName}
            </div>
            <div className="text-gray-400 text-[10px] font-body">
              {role === 'admin' ? 'Administration' : profile.category}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Shared Layout Shell ──

interface LayoutShellProps {
  routes: AppRoute[];
  basePath: '/partner' | '/admin';
  role: 'partner' | 'admin';
}

export function LayoutShell({ routes, basePath, role }: LayoutShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        routes={routes}
        basePath={basePath}
        role={role}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onMenuToggle={() => setMobileOpen(true)} role={role} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
