import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  Heart,
  Settings,
  ChevronRight,
  Star,
  Sparkles,
  LogOut,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-beige-50 pt-24 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Profile Header */}
        <div className="card-lg p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-2xl">AK</span>
            </div>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-2xl text-navy-800">Aminata Koné</h1>
              <p className="text-gray-500 font-body text-sm">aminata@email.com</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-ai-400/10 text-ai-400 text-xs font-heading font-medium">
                  Voyageur Premium
                </span>
              </div>
            </div>
            <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { value: '8', label: 'Voyages', icon: CalendarCheck },
            { value: '12', label: 'Favoris', icon: Heart },
            { value: '4.9', label: 'Note', icon: Star },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="card p-4 text-center">
              <Icon className="w-5 h-5 text-ai-400 mx-auto mb-2" />
              <div className="font-heading font-bold text-xl text-navy-800">{value}</div>
              <div className="text-gray-500 text-xs font-body">{label}</div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="card-lg p-6 mb-6">
          <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            {[
              { icon: User, label: 'Nom complet', value: 'Aminata Koné' },
              { icon: Mail, label: 'Email', value: 'aminata@email.com' },
              { icon: Phone, label: 'Téléphone', value: '+225 07 00 00 00' },
              { icon: MapPin, label: 'Ville', value: 'Abidjan, Côte d\'Ivoire' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-navy-800" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs font-body">{label}</div>
                  <div className="font-heading font-medium text-navy-800 text-sm">{value}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-outline w-full mt-6">Modifier mes informations</button>
        </div>

        {/* Quick Links */}
        <div className="card-lg overflow-hidden mb-6">
          {[
            { icon: CalendarCheck, label: 'Mes réservations', to: '/reservations', color: 'text-ai-400' },
            { icon: Heart, label: 'Mes favoris', to: '/explorer', color: 'text-red-400' },
            { icon: Sparkles, label: 'Assistant IA', to: '/assistant', color: 'text-ai-400' },
            { icon: Settings, label: 'Paramètres', to: '#', color: 'text-gray-400' },
          ].map(({ icon: Icon, label, to, color }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="flex-1 font-heading font-medium text-navy-800 text-sm">{label}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-heading font-medium text-sm hover:bg-red-50 rounded-xl transition-colors">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </div>
  );
}
