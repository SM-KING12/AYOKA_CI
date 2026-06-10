import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  Star,
  Users,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition } from '../../components/UI';

const iconMap: Record<string, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: TrendingUp,
};

const colorMap = {
  up: 'text-nature-400',
  down: 'text-red-400',
  stable: 'text-gray-400',
};

const bookingStatusConfig: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Confirmée', color: 'bg-nature-400/10 text-nature-400' },
  pending: { label: 'En attente', color: 'bg-gold-500/10 text-gold-500' },
  cancelled: { label: 'Annulée', color: 'bg-red-500/10 text-red-500' },
  completed: { label: 'Terminée', color: 'bg-ai-400/10 text-ai-400' },
};

export default function DashboardPage() {
  const { stats, bookings, services, profile } = usePartner();

  const recentBookings = bookings.slice(0, 5);
  const activeServices = services.filter((s) => s.status === 'active').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Tableau de bord</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">
            Bienvenue, {profile.ownerName}
          </p>
        </div>
        <Link to="../services" className="btn-primary flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" /> Mes services
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = iconMap[stat.trend];
          return (
            <div key={stat.label} className="bg-white rounded-card p-5 shadow-soft hover:shadow-card transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm font-body">{stat.label}</span>
                <span className={`flex items-center gap-1 text-xs font-heading font-semibold ${colorMap[stat.trend]}`}>
                  <Icon className="w-3 h-3" />
                  {stat.change > 0 ? '+' : ''}{stat.change}{typeof stat.value === 'number' ? '' : '%'}
                </span>
              </div>
              <div className="font-heading font-bold text-2xl text-navy-800">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-card-lg shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg text-navy-800">Réservations récentes</h2>
            <Link to="../reservations" className="text-ai-400 text-sm font-heading font-medium flex items-center gap-1 hover:text-ai-300">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-heading font-bold">{b.guestAvatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-sm text-navy-800 truncate">{b.guestName}</div>
                  <div className="text-gray-500 text-xs font-body truncate">{b.serviceName}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-heading font-bold text-sm text-navy-800">{(b.amount / 1000).toFixed(0)}K FCFA</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-medium ${bookingStatusConfig[b.status]?.color}`}>
                    {bookingStatusConfig[b.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-card-lg shadow-soft p-6">
            <h3 className="font-heading font-bold text-sm text-navy-800 mb-4">Aperçu</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-body flex items-center gap-2"><MapPin className="w-4 h-4" /> Services actifs</span>
                <span className="font-heading font-bold text-navy-800">{activeServices}/{services.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-body flex items-center gap-2"><CalendarCheck className="w-4 h-4" /> En attente</span>
                <span className="font-heading font-bold text-gold-500">{pendingBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-body flex items-center gap-2"><Star className="w-4 h-4" /> Note</span>
                <span className="font-heading font-bold text-navy-800">{profile.rating}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-body flex items-center gap-2"><Users className="w-4 h-4" /> Réservations totales</span>
                <span className="font-heading font-bold text-navy-800">{profile.completedBookings}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-800 to-ai-400 rounded-card-lg p-6 shadow-ai-glow">
            <h3 className="font-heading font-bold text-white text-sm mb-2">Revenu total</h3>
            <div className="font-heading font-bold text-3xl text-white mb-1">
              {(profile.revenue / 1000000).toFixed(1)}M <span className="text-lg text-white/60">FCFA</span>
            </div>
            <div className="text-white/50 text-xs font-body">Depuis {profile.joinedAt}</div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
