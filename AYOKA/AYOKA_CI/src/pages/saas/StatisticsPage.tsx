import { Star, DollarSign, Users, CalendarCheck } from 'lucide-react';
import { PageTransition } from '../../components/UI';

const revenueData = [
  { month: 'Jan', value: 1.2 },
  { month: 'Fév', value: 1.8 },
  { month: 'Mar', value: 2.4 },
  { month: 'Avr', value: 2.0 },
  { month: 'Mai', value: 2.8 },
  { month: 'Jun', value: 3.2 },
];

const bookingsData = [
  { month: 'Jan', value: 18 },
  { month: 'Fév', value: 24 },
  { month: 'Mar', value: 32 },
  { month: 'Avr', value: 28 },
  { month: 'Mai', value: 36 },
  { month: 'Jun', value: 42 },
];

const topServices = [
  { name: 'Dîner Gastronomique', revenue: '6.8M FCFA', bookings: 312 },
  { name: 'Suite Lagune Premium', revenue: '7.5M FCFA', bookings: 89 },
  { name: 'Transfert Aéroport', revenue: '2.7M FCFA', bookings: 230 },
  { name: 'Visite Colonial', revenue: '2.3M FCFA', bookings: 156 },
  { name: 'Randonnée Forêt', revenue: '1.6M FCFA', bookings: 64 },
];

const ratingDist = [
  { stars: 5, count: 142, pct: 61 },
  { stars: 4, count: 67, pct: 29 },
  { stars: 3, count: 18, pct: 8 },
  { stars: 2, count: 5, pct: 2 },
  { stars: 1, count: 2, pct: 1 },
];

export default function StatisticsPage() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.value));
  const maxBookings = Math.max(...bookingsData.map((d) => d.value));

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Statistiques</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">Analyse de votre activité</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: DollarSign, label: 'Revenus totaux', value: '12.4M FCFA', color: 'from-gold-400 to-gold-600' },
          { icon: CalendarCheck, label: 'Réservations', value: '893', color: 'from-nature-400 to-nature-500' },
          { icon: Star, label: 'Note moyenne', value: '4.7/5', color: 'from-ai-400 to-ai-600' },
          { icon: Users, label: 'Clients uniques', value: '467', color: 'from-navy-600 to-navy-800' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-card p-5 shadow-soft">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-heading font-bold text-xl text-navy-800">{value}</div>
            <div className="text-gray-500 text-xs font-body">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <h2 className="font-heading font-bold text-lg text-navy-800 mb-6">Revenus mensuels</h2>
          <div className="flex items-end gap-4 h-48">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-heading font-semibold text-navy-800">{d.value}M</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-gold-500 to-gold-300 transition-all duration-500"
                  style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                />
                <span className="text-xs text-gray-400 font-body">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <h2 className="font-heading font-bold text-lg text-navy-800 mb-6">Réservations mensuelles</h2>
          <div className="flex items-end gap-4 h-48">
            {bookingsData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-heading font-semibold text-navy-800">{d.value}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-navy-800 to-ai-400 transition-all duration-500"
                  style={{ height: `${(d.value / maxBookings) * 100}%` }}
                />
                <span className="text-xs text-gray-400 font-body">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Services les plus rentables</h2>
          <div className="space-y-4">
            {topServices.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-navy-50 flex items-center justify-center font-heading font-bold text-xs text-navy-800">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-sm text-navy-800 truncate">{s.name}</div>
                  <div className="text-gray-400 text-xs font-body">{s.bookings} réservations</div>
                </div>
                <div className="font-heading font-semibold text-sm text-navy-800">{s.revenue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Distribution des notes</h2>
          <div className="space-y-3">
            {ratingDist.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 w-16 flex-shrink-0">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-700"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-body w-12 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
