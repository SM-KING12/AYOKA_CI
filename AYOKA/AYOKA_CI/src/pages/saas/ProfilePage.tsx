import { useState } from 'react';
import { Star, MapPin, Shield } from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition } from '../../components/UI';
import type { PartnerProfile } from '../../types/partner';

export default function ProfilePage() {
  const { profile, updateProfile } = usePartner();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<PartnerProfile>>({ ...profile });

  const update = (field: keyof PartnerProfile, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Profil</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">Gérez vos informations professionnelles</p>
        </div>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          className={editing ? 'btn-primary text-sm' : 'btn-outline text-sm'}
        >
          {editing ? 'Sauvegarder' : 'Modifier'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center mx-auto mb-4 shadow-ai-glow">
              <span className="text-white font-heading font-bold text-2xl">{profile.avatar}</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-navy-800">{profile.businessName}</h2>
            <p className="text-gray-500 text-sm font-body mt-0.5">{profile.category}</p>
            {profile.verified && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Shield className="w-4 h-4 text-ai-400" />
                <span className="text-ai-400 text-xs font-heading font-medium">Vérifié</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-body">Note</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                <span className="font-heading font-bold text-navy-800">{profile.rating}</span>
                <span className="text-gray-400 text-xs font-body">({profile.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-body">Réservations</span>
              <span className="font-heading font-bold text-navy-800">{profile.completedBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-body">Revenus</span>
              <span className="font-heading font-bold text-navy-800">{(profile.revenue / 1000000).toFixed(1)}M FCFA</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-body flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Ville</span>
              <span className="font-heading font-medium text-navy-800 text-sm">{profile.city}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-card-lg shadow-soft p-6">
          <h3 className="font-heading font-bold text-lg text-navy-800 mb-4">Informations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Nom de l'entreprise</label>
              <input
                type="text"
                value={editing ? (form.businessName ?? '') : profile.businessName}
                onChange={(e) => editing && update('businessName', e.target.value)}
                disabled={!editing}
                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Propriétaire</label>
              <input
                type="text"
                value={editing ? (form.ownerName ?? '') : profile.ownerName}
                onChange={(e) => editing && update('ownerName', e.target.value)}
                disabled={!editing}
                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Email</label>
              <input
                type="email"
                value={editing ? (form.email ?? '') : profile.email}
                onChange={(e) => editing && update('email', e.target.value)}
                disabled={!editing}
                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Téléphone</label>
              <input
                type="tel"
                value={editing ? (form.phone ?? '') : profile.phone}
                onChange={(e) => editing && update('phone', e.target.value)}
                disabled={!editing}
                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Ville</label>
              <input
                type="text"
                value={editing ? (form.city ?? '') : profile.city}
                onChange={(e) => editing && update('city', e.target.value)}
                disabled={!editing}
                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Catégorie</label>
              <input
                type="text"
                value={editing ? (form.category ?? '') : profile.category}
                onChange={(e) => editing && update('category', e.target.value)}
                disabled={!editing}
                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Description</label>
              <textarea
                value={editing ? (form.description ?? '') : profile.description}
                onChange={(e) => editing && update('description', e.target.value)}
                disabled={!editing}
                rows={3}
                className="input-field disabled:bg-gray-50 disabled:text-gray-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
