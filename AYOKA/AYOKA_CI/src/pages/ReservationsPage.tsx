import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const mockReservations = [
  {
    id: '1',
    destination: 'Grand-Bassam',
    city: 'Grand-Bassam',
    date: '15-17 Mars 2026',
    guests: 2,
    amount: '150 000 FCFA',
    status: 'confirmed',
    image: 'https://images.pexels.com/photos/17749102/pexels-photo-17749102.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    destination: 'Parc National de Taï',
    city: 'Taï',
    date: '22-24 Avril 2026',
    guests: 4,
    amount: '100 000 FCFA',
    status: 'pending',
    image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    destination: 'Assinie-Mafia',
    city: 'Assinie',
    date: '5-7 Mai 2026',
    guests: 2,
    amount: '70 000 FCFA',
    status: 'confirmed',
    image: 'https://images.pexels.com/photos/1591375/pexels-photo-1591375.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Confirmée', color: 'bg-nature-400/10 text-nature-400' },
  pending: { label: 'En attente', color: 'bg-gold-500/10 text-gold-500' },
  cancelled: { label: 'Annulée', color: 'bg-red-500/10 text-red-500' },
};

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-beige-50 pt-24 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-navy-800">Mes réservations</h1>
            <p className="text-gray-500 font-body mt-1">Gérez vos voyages planifiés</p>
          </div>
          <Link to="/explorer" className="btn-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Nouvelle réservation
          </Link>
        </div>

        {mockReservations.length === 0 ? (
          <div className="text-center py-20">
            <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-navy-800 mb-2">
              Aucune réservation
            </h2>
            <p className="text-gray-500 font-body mb-6">
              Commencez à explorer les destinations de Côte d'Ivoire
            </p>
            <Link to="/explorer" className="btn-primary inline-flex items-center gap-2">
              Explorer les destinations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockReservations.map((r) => (
              <div key={r.id} className="card-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-40 sm:h-auto overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.destination}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-navy-800">
                          {r.destination}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm font-body mt-1">
                          <MapPin className="w-3.5 h-3.5" /> {r.city}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-heading font-medium ${statusConfig[r.status].color}`}>
                        {statusConfig[r.status].label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-body">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {r.date}
                      </div>
                      <div>{r.guests} voyageur{r.guests > 1 ? 's' : ''}</div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="font-heading font-bold text-lg text-navy-800">{r.amount}</span>
                      <div className="flex gap-2">
                        <button className="btn-outline text-sm py-2 px-4">Détails</button>
                        {r.status !== 'cancelled' && (
                          <button className="text-red-500 text-sm font-heading font-medium px-3 py-2 rounded-xl hover:bg-red-50 transition-colors">
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
