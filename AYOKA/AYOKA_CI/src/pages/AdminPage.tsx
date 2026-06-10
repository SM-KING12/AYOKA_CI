import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  MapPin,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Star,
  Sparkles,
  Settings,
  LogOut,
  Search,
  Bell,
  Eye,
  Edit3,
  Trash2,
  Plus,
  BarChart3,
  FileText,
  Download,
} from 'lucide-react';
import { destinations } from '../data';
import { mockAdminStats, mockAdminBookings } from '../mock/mockAdminData';
import { mockUsers } from '../mock/mockUsers';
import { PageTransition } from '../components/UI';

type AdminTab = 'dashboard' | 'destinations' | 'users' | 'bookings' | 'events' | 'content' | 'settings';

const sidebarItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'destinations', label: 'Destinations', icon: MapPin },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'bookings', label: 'R\u00e9servations', icon: CalendarCheck },
  { id: 'events', label: '\u00c9v\u00e9nements', icon: Sparkles },
  { id: 'content', label: 'Contenu', icon: FileText },
  { id: 'settings', label: 'Param\u00e8tres', icon: Settings },
];

const stats = [
  { label: 'Utilisateurs', value: mockAdminStats.users.total.toLocaleString(), change: `+${mockAdminStats.users.growth}%`, icon: Users, color: 'ai' },
  { label: 'R\u00e9servations', value: mockAdminStats.bookings.total.toLocaleString(), change: `+${mockAdminStats.bookings.growth}%`, icon: CalendarCheck, color: 'nature' },
  { label: 'Revenus', value: mockAdminStats.revenue.total, change: `+${mockAdminStats.revenue.growth}%`, icon: DollarSign, color: 'gold' },
  { label: 'Note moyenne', value: `${mockAdminStats.rating.average}/5`, change: `+${mockAdminStats.rating.growth}`, icon: Star, color: 'navy' },
];

const topDestinations = [
  { name: 'Assinie-Mafia', visits: 2340, revenue: '82M FCFA' },
  { name: 'Grand-Bassam', visits: 1890, revenue: '67M FCFA' },
  { name: 'Parc de Ta\u00ef', visits: 1240, revenue: '45M FCFA' },
  { name: 'Basilique de Yamoussoukro', visits: 980, revenue: '12M FCFA' },
  { name: 'Mont Tonkoui', visits: 870, revenue: '28M FCFA' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-nature-400/10 text-nature-400',
  pending: 'bg-gold-500/10 text-gold-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

const statusLabels: Record<string, string> = {
  confirmed: 'Confirm\u00e9e',
  pending: 'En attente',
  cancelled: 'Annul\u00e9e',
};

const colorMap: Record<string, string> = {
  ai: 'from-ai-400 to-ai-600',
  nature: 'from-nature-400 to-nature-400',
  gold: 'from-gold-400 to-gold-600',
  navy: 'from-navy-600 to-navy-800',
};

const revenueData = [
  { month: 'Jan', value: 12 },
  { month: 'F\u00e9v', value: 18 },
  { month: 'Mar', value: 24 },
  { month: 'Avr', value: 20 },
  { month: 'Mai', value: 28 },
  { month: 'Jun', value: 32 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  return (
    <PageTransition className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-800 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-ai-400 to-ai-600 rounded-xl flex items-center justify-center shadow-ai-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                AYOKA<span className="text-gold-500"> CI</span>
              </span>
            </Link>
            <div className="mt-3 text-white/40 text-xs font-body">Administration</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-medium text-sm transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-heading font-medium text-sm transition-all duration-300">
              <LogOut className="w-5 h-5" />
              Retour au site
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-navy-800" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ai-400/30 focus:border-ai-400 w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ai-400" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
              <span className="text-white font-heading font-semibold text-xs">AD</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading font-bold text-2xl text-navy-800 mb-6">Tableau de bord</h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(({ label, value, change, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-card p-5 shadow-soft hover:shadow-card transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex items-center gap-1 text-nature-400 text-xs font-heading font-semibold">
                        <TrendingUp className="w-3 h-3" /> {change}
                      </span>
                    </div>
                    <div className="font-heading font-bold text-2xl text-navy-800">{value}</div>
                    <div className="text-gray-500 text-sm font-body">{label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-card-lg shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading font-bold text-lg text-navy-800">Revenus mensuels</h2>
                    <button className="flex items-center gap-1 text-ai-400 text-xs font-heading font-medium">
                      <Download className="w-3.5 h-3.5" /> Exporter
                    </button>
                  </div>
                  <div className="flex items-end gap-3 h-48">
                    {revenueData.map((d) => (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs font-heading font-semibold text-navy-800">{d.value}M</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-navy-800 to-ai-400 transition-all duration-500"
                          style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                        />
                        <span className="text-xs text-gray-400 font-body">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Destinations */}
                <div className="bg-white rounded-card-lg shadow-soft p-6">
                  <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">
                    Destinations populaires
                  </h2>
                  <div className="space-y-4">
                    {topDestinations.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-navy-50 flex items-center justify-center font-heading font-bold text-xs text-navy-800">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-heading font-semibold text-sm text-navy-800 truncate">{d.name}</div>
                          <div className="text-gray-400 text-xs font-body">{d.visits.toLocaleString()} visites</div>
                        </div>
                        <div className="font-heading font-semibold text-xs text-navy-800">{d.revenue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-card-lg shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-lg text-navy-800">R\u00e9servations r\u00e9centes</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-ai-400 text-sm font-heading font-medium hover:text-ai-500">
                    Voir tout
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 pr-4">R\u00e9f</th>
                        <th className="pb-3 pr-4">Utilisateur</th>
                        <th className="pb-3 pr-4">Destination</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Montant</th>
                        <th className="pb-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {mockAdminBookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="text-sm font-body">
                          <td className="py-3 pr-4 font-heading font-medium text-ai-400">{b.id}</td>
                          <td className="py-3 pr-4 font-heading font-medium text-navy-800">{b.user}</td>
                          <td className="py-3 pr-4 text-gray-600">{b.destination}</td>
                          <td className="py-3 pr-4 text-gray-500">{b.date}</td>
                          <td className="py-3 pr-4 font-heading font-semibold text-navy-800">{b.amount}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-medium ${statusColors[b.status]}`}>
                              {statusLabels[b.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'destinations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-heading font-bold text-2xl text-navy-800">Destinations</h1>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {destinations.map((d) => (
                  <div key={d.id} className="bg-white rounded-card shadow-soft overflow-hidden group hover:shadow-card transition-all duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-3">
                        <span className="font-heading font-semibold text-white text-sm">{d.name}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs font-body">{d.city}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                          <span className="text-xs font-heading font-medium">{d.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 text-xs font-heading font-medium hover:bg-navy-100 transition-colors">
                          <Edit3 className="w-3 h-3" /> Modifier
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-heading font-medium hover:bg-red-100 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-heading font-bold text-2xl text-navy-800">Utilisateurs</h1>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
              <div className="bg-white rounded-card-lg shadow-soft overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-4">Nom</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">R\u00e9servations</th>
                      <th className="px-6 py-4">Inscription</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockUsers.map((u) => (
                      <tr key={u.id} className="text-sm font-body hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
                              <span className="text-white font-heading font-semibold text-xs">{u.avatar}</span>
                            </div>
                            <div>
                              <span className="font-heading font-medium text-navy-800">{u.firstName} {u.lastName}</span>
                              <div className="text-xs text-gray-400 font-body">{u.membership === 'premium' ? 'Premium' : 'Standard'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                        <td className="px-6 py-4 font-heading font-semibold text-navy-800">{u.bookingsCount}</td>
                        <td className="px-6 py-4 text-gray-500">{u.joinedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Eye className="w-4 h-4 text-gray-400" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 className="w-4 h-4 text-gray-400" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-heading font-bold text-2xl text-navy-800">R\u00e9servations</h1>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-soft text-navy-800 text-sm font-heading font-medium hover:shadow-card transition-all">
                  <Download className="w-4 h-4" /> Exporter CSV
                </button>
              </div>
              <div className="bg-white rounded-card-lg shadow-soft overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-4">R\u00e9f\u00e9rence</th>
                      <th className="px-6 py-4">Utilisateur</th>
                      <th className="px-6 py-4">Destination</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Montant</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockAdminBookings.map((b) => (
                      <tr key={b.id} className="text-sm font-body hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-heading font-semibold text-ai-400">{b.id}</td>
                        <td className="px-6 py-4 font-heading font-medium text-navy-800">{b.user}</td>
                        <td className="px-6 py-4 text-gray-600">{b.destination}</td>
                        <td className="px-6 py-4 text-gray-500">{b.date}</td>
                        <td className="px-6 py-4 font-heading font-semibold text-navy-800">{b.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-medium ${statusColors[b.status]}`}>
                            {statusLabels[b.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Eye className="w-4 h-4 text-gray-400" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 className="w-4 h-4 text-gray-400" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-heading font-bold text-2xl text-navy-800">\u00c9v\u00e9nements</h1>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Cr\u00e9er un \u00e9v\u00e9nement
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Festival des Masques', city: 'Man', date: '15-18 Juin 2026', status: 'active', attendees: 1200 },
                  { name: "F\u00eate de l'Ind\u00e9pendance", city: 'Abidjan', date: '7 Ao\u00fbt 2026', status: 'upcoming', attendees: 5000 },
                  { name: 'Carnaval de Bonoua', city: 'Bonoua', date: '22-25 Mars 2026', status: 'ended', attendees: 800 },
                  { name: 'Festival des Lagunes', city: 'Abidjan', date: '10-12 Sept 2026', status: 'upcoming', attendees: 0 },
                ].map((evt) => (
                  <div key={evt.name} className="bg-white rounded-card shadow-soft p-5 hover:shadow-card transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading font-semibold text-navy-800">{evt.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-heading font-medium ${
                        evt.status === 'active' ? 'bg-nature-400/10 text-nature-400' :
                        evt.status === 'upcoming' ? 'bg-ai-400/10 text-ai-400' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {evt.status === 'active' ? 'Actif' : evt.status === 'upcoming' ? '\u00c0 venir' : 'Termin\u00e9'}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm font-body space-y-1">
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {evt.city}</div>
                      <div className="flex items-center gap-2"><CalendarCheck className="w-3.5 h-3.5" /> {evt.date}</div>
                      {evt.attendees > 0 && <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {evt.attendees.toLocaleString()} participants</div>}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 text-xs font-heading font-medium hover:bg-navy-100 transition-colors flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" /> Modifier
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-heading font-medium hover:bg-red-100 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading font-bold text-2xl text-navy-800 mb-6">Contenu</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Banni\u00e8res', count: 4, desc: 'G\u00e9rer les banni\u00e8res de la page d\'accueil' },
                  { title: 'Articles blog', count: 12, desc: 'Publier et g\u00e9rer les articles' },
                  { title: 'T\u00e9moignages', count: 8, desc: 'G\u00e9rer les avis voyageurs' },
                  { title: 'FAQ', count: 15, desc: 'Questions fr\u00e9quentes' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-card-lg shadow-soft p-6 hover:shadow-card transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading font-bold text-navy-800">{item.title}</h3>
                      <span className="px-2.5 py-1 rounded-full bg-ai-400/10 text-ai-400 text-xs font-heading font-medium">{item.count}</span>
                    </div>
                    <p className="text-gray-500 text-sm font-body mb-4">{item.desc}</p>
                    <button className="btn-outline text-sm py-2">G\u00e9rer</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading font-bold text-2xl text-navy-800 mb-6">Param\u00e8tres</h1>
              <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-card-lg shadow-soft p-6">
                  <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">G\u00e9n\u00e9ral</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">Nom de la plateforme</label>
                      <input type="text" defaultValue="AYOKA CI" className="input-field" />
                    </div>
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">Email de contact</label>
                      <input type="email" defaultValue="contact@ayoka.ci" className="input-field" />
                    </div>
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">Devise</label>
                      <select className="input-field">
                        <option>FCFA - Franc CFA</option>
                        <option>EUR - Euro</option>
                        <option>USD - Dollar US</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">Langue par d\u00e9faut</label>
                      <select className="input-field">
                        <option>Fran\u00e7ais</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-card-lg shadow-soft p-6">
                  <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Assistant IA</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">Mod\u00e8le IA</label>
                      <select className="input-field">
                        <option>GPT-4 Turbo</option>
                        <option>Claude 3.5</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">Temp\u00e9rature</label>
                      <input type="range" min="0" max="100" defaultValue="70" className="w-full" />
                    </div>
                  </div>
                </div>
                <button className="btn-primary">Sauvegarder</button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
