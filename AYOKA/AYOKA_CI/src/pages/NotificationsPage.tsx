import { motion } from 'framer-motion';
import { Bell, CalendarCheck, Sparkles, Tag, Info, Trash2, CheckCheck } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationsContext';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState } from '../components/UI';
import Navbar from '../components/Layout';
import type { Notification } from '../types';

const typeConfig: Record<Notification['type'], { icon: typeof Bell; color: string; bg: string }> = {
  booking: { icon: CalendarCheck, color: 'text-nature-400', bg: 'bg-nature-400/10' },
  ai: { icon: Sparkles, color: 'text-ai-400', bg: 'bg-ai-400/10' },
  promotion: { icon: Tag, color: 'text-gold-500', bg: 'bg-gold-500/10' },
  system: { icon: Info, color: 'text-navy-500', bg: 'bg-navy-50' },
};

const typeLabels: Record<Notification['type'], string> = {
  booking: 'Réservation',
  ai: 'Assistant IA',
  promotion: 'Promotion',
  system: 'Système',
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

  return (
    <PageTransition className="min-h-screen bg-beige-50">
      <Navbar />
      <div className="pt-24 pb-24 md:pb-8 max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-navy-800">Notifications</h1>
            <p className="text-gray-500 font-body text-sm">{unreadCount} non lue{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white shadow-soft text-ai-400 text-xs font-heading font-medium hover:shadow-card transition-all"
              >
                <CheckCheck className="w-4 h-4" /> Tout marquer lu
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white shadow-soft text-red-400 text-xs font-heading font-medium hover:shadow-card transition-all"
              >
                <Trash2 className="w-4 h-4" /> Vider
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {[
            { type: 'all', label: 'Tout' },
            { type: 'booking', label: 'Réservations' },
            { type: 'ai', label: 'IA' },
            { type: 'promotion', label: 'Promos' },
            { type: 'system', label: 'Système' },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="px-3 py-1.5 rounded-full bg-white shadow-soft text-gray-600 text-xs font-heading font-medium hover:shadow-card transition-all"
            >
              {label}
            </button>
          ))}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Aucune notification"
            description="Vos notifications apparaîtront ici"
          />
        ) : (
          <StaggerContainer className="space-y-3">
            {notifications.map((n) => {
              const config = typeConfig[n.type];
              const Icon = config.icon;
              return (
                <StaggerItem key={n.id}>
                  <motion.div
                    layout
                    className={`bg-white rounded-xl p-4 shadow-soft hover:shadow-card transition-all duration-300 ${!n.read ? 'border-l-4 border-ai-400' : ''}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-semibold text-sm text-navy-800">{n.title}</span>
                              {!n.read && (
                                <div className="w-2 h-2 rounded-full bg-ai-400" />
                              )}
                            </div>
                            <span className="text-xs text-gray-400 font-body">{typeLabels[n.type]}</span>
                          </div>
                          <span className="text-xs text-gray-400 font-body whitespace-nowrap">{n.createdAt}</span>
                        </div>
                        <p className="text-gray-600 text-sm font-body mt-1">{n.message}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors self-start"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                      </button>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}
