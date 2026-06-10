import { useState } from 'react';
import { CalendarCheck, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState } from '../../components/UI';
import type { PartnerBooking } from '../../types/partner';

const statusConfig: Record<PartnerBooking['status'], { label: string; color: string; action?: PartnerBooking['status'] }> = {
  confirmed: { label: 'Confirmée', color: 'bg-nature-400/10 text-nature-400' },
  pending: { label: 'En attente', color: 'bg-gold-500/10 text-gold-500', action: 'confirmed' },
  cancelled: { label: 'Annulée', color: 'bg-red-500/10 text-red-500' },
  completed: { label: 'Terminée', color: 'bg-ai-400/10 text-ai-400' },
};

const typeLabels: Record<string, string> = {
  tour: 'Tour', hotel: 'Hôtel', restaurant: 'Restaurant', transport: 'Transport', activity: 'Activité',
};

export default function ReservationsPage() {
  const { bookings, updateBookingStatus } = usePartner();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);
  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Réservations</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">{bookings.length} réservation{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-heading font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              statusFilter === status
                ? 'bg-navy-800 text-white shadow-soft'
                : 'bg-white text-gray-600 shadow-soft hover:shadow-card'
            }`}
          >
            {status === 'all' ? 'Tout' : statusConfig[status as PartnerBooking['status']]?.label || status}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-heading font-bold ${
              statusFilter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Aucune réservation"
          description="Les réservations apparaîtront ici quand des clients réservent vos services"
        />
      ) : (
        <StaggerContainer className="space-y-3">
          {filtered.map((b) => (
            <StaggerItem key={b.id}>
              <div className="bg-white rounded-card-lg p-5 shadow-soft hover:shadow-card transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-heading font-bold">{b.guestAvatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-heading font-bold text-navy-800">{b.guestName}</div>
                        <div className="text-gray-500 text-sm font-body">{b.serviceName}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-medium ${statusConfig[b.status]?.color}`}>
                        {statusConfig[b.status]?.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400 text-xs font-body">
                      <span className="flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" /> {b.date}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {b.guests} pers.</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {typeLabels[b.serviceType]}</span>
                    </div>
                    {b.notes && (
                      <div className="mt-2 text-gray-400 text-xs font-body italic">"{b.notes}"</div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-heading font-bold text-lg text-navy-800">{(b.amount / 1000).toFixed(0)}K</div>
                    <div className="text-gray-400 text-xs font-body">FCFA</div>
                  </div>
                </div>
                {/* Actions for pending */}
                {b.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-nature-400/10 text-nature-400 text-xs font-heading font-medium hover:bg-nature-400/20 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirmer
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-heading font-medium hover:bg-red-500/20 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Refuser
                    </button>
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}
