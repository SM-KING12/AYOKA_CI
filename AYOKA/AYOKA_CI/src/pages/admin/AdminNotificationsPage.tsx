import { useState } from 'react';
import { Bell, Send, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState } from '../../components/UI';
import type { AdminNotification } from '../../types/auth';

const typeConfig: Record<AdminNotification['type'], { icon: typeof Bell; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-ai-400', bg: 'bg-ai-400/10' },
  warning: { icon: AlertTriangle, color: 'text-gold-500', bg: 'bg-gold-500/10' },
  success: { icon: CheckCircle, color: 'text-nature-400', bg: 'bg-nature-400/10' },
  alert: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function AdminNotificationsPage() {
  const { adminNotifications, sendAdminNotification, markAdminNotificationRead, unreadAdminNotifications } = usePartner();
  const [showSend, setShowSend] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' as AdminNotification['type'], target: 'all' });

  const handleSend = () => {
    if (!form.title || !form.message) return;
    sendAdminNotification(form);
    setForm({ title: '', message: '', type: 'info', target: 'all' });
    setShowSend(false);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Notifications</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">{unreadAdminNotifications} non lue{unreadAdminNotifications !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowSend(!showSend)} className="btn-primary flex items-center gap-2 text-sm">
          <Send className="w-4 h-4" /> Envoyer
        </button>
      </div>

      {showSend && (
        <div className="bg-white rounded-card-lg shadow-soft p-6 mb-6">
          <h3 className="font-heading font-bold text-sm text-navy-800 mb-4">Nouvelle notification</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Titre"
              className="input-field"
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Message"
              rows={2}
              className="input-field resize-none"
            />
            <div className="flex gap-3">
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AdminNotification['type'] }))}
                className="input-field w-auto"
              >
                <option value="info">Info</option>
                <option value="warning">Avertissement</option>
                <option value="success">Succès</option>
                <option value="alert">Alerte</option>
              </select>
              <select
                value={form.target}
                onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                className="input-field w-auto"
              >
                <option value="all">Tous les partenaires</option>
                <option value="partner-1">African Tours CI</option>
                <option value="partner-2">Bouaké Tours</option>
                <option value="partner-3">San Pedro Plages</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSend} className="btn-primary text-sm">Envoyer</button>
              <button onClick={() => setShowSend(false)} className="btn-outline text-sm">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {adminNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="Aucune notification" description="Les notifications apparaîtront ici" />
      ) : (
        <StaggerContainer className="space-y-3">
          {adminNotifications.map((n) => {
            const config = typeConfig[n.type];
            const Icon = config.icon;
            return (
              <StaggerItem key={n.id}>
                <div
                  className={`bg-white rounded-xl p-4 shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer ${!n.read ? 'border-l-4 border-ai-400' : ''}`}
                  onClick={() => markAdminNotificationRead(n.id)}
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
                            {!n.read && <div className="w-2 h-2 rounded-full bg-ai-400" />}
                          </div>
                          <span className="text-xs text-gray-400 font-body">
                            {n.target === 'all' ? 'Tous' : `Partenaire #${n.target.split('-')[1]}`} · {n.createdAt}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm font-body mt-1">{n.message}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}
