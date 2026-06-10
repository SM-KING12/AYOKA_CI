import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  MessageCircle,
  CalendarCheck,
  User,
  Menu,
  X,
  Sparkles,
  Bell,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';

const navItems = [
  { path: '/', label: 'Accueil', icon: Compass },
  { path: '/explorer', label: 'Explorer', icon: Compass },
  { path: '/assistant', label: 'Assistant IA', icon: MessageCircle },
  { path: '/dashboard', label: 'Mon espace', icon: CalendarCheck },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-soft py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-navy-800 to-ai-400 rounded-xl flex items-center justify-center group-hover:shadow-ai-glow transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl">
              <span className={scrolled ? 'text-navy-800' : 'text-white'}>AYOKA</span>
              <span className={scrolled ? 'text-ai-400' : 'text-gold-500'}> CI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-medium text-sm transition-all duration-300 ${
                    active
                      ? scrolled
                        ? 'bg-navy-800 text-white shadow-soft'
                        : 'bg-white/15 text-white'
                      : scrolled
                        ? 'text-navy-800 hover:bg-navy-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            {/* Notifications */}
            <Link
              to="/notifications"
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl font-heading font-medium text-sm transition-all duration-300 ${
                scrolled ? 'text-navy-800 hover:bg-navy-50' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-ai-400 text-white text-[9px] font-heading font-bold flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <Link
                to="/profil"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-heading font-medium text-sm transition-all duration-300 ${
                  scrolled ? 'text-navy-800 hover:bg-navy-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
                  <span className="text-white text-[10px] font-heading font-bold">{user?.avatar || 'U'}</span>
                </div>
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-medium text-sm transition-all duration-300 ${
                  scrolled
                    ? 'bg-navy-800 text-white shadow-soft'
                    : 'bg-white/15 text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className={`w-6 h-6 ${scrolled ? 'text-navy-800' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? 'text-navy-800' : 'text-white'}`} />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass mt-2 mx-4 rounded-card-lg shadow-card p-4 animate-slide-up">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-medium transition-all duration-300 ${
                    active
                      ? 'bg-navy-800 text-white'
                      : 'text-navy-800 hover:bg-navy-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
            <Link
              to="/notifications"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-medium text-navy-800 hover:bg-navy-50 transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-ai-400 text-white text-[9px] font-heading font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link
                to="/profil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-medium text-navy-800 hover:bg-navy-50 transition-all duration-300"
              >
                <User className="w-5 h-5" />
                Profil
              </Link>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-navy-800 text-white font-heading font-medium transition-all duration-300 mt-2"
              >
                <LogIn className="w-5 h-5" />
                Connexion
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20">
        <div className="flex items-center justify-around py-2">
          {[
            ...navItems.slice(0, 3),
            { path: '/notifications', label: 'Notif.', icon: Bell },
            ...(isAuthenticated
              ? [{ path: '/profil', label: 'Profil', icon: User }]
              : [{ path: '/auth/login', label: 'Connexion', icon: LogIn }]),
          ].map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 relative ${
                  active
                    ? 'text-ai-400'
                    : 'text-navy-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_rgba(77,163,255,0.5)]' : ''}`} />
                <span className="text-[10px] font-heading font-medium">{label}</span>
                {path === '/notifications' && unreadCount > 0 && (
                  <div className="absolute -top-0.5 right-1 w-3.5 h-3.5 rounded-full bg-ai-400 text-white text-[8px] font-heading font-bold flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
