import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Sparkles, ArrowRight, Eye, EyeOff, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageTransition } from '../../components/UI';
import type { UserRole } from '../../types/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    category: '',
    role: 'partner' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (form.role === 'partner' && !form.businessName) {
      setError('Le nom de l\'entreprise est requis pour les partenaires');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    try {
      await register({ ...form, role: form.role });
      navigate(form.role === 'admin' ? '/admin/dashboard' : '/partner/dashboard');
    } catch {
      setError('Erreur lors de l\'inscription');
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 relative overflow-hidden px-4 py-8">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-ai-400 rounded-full blur-[96px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-ai-400 to-ai-600 rounded-xl flex items-center justify-center shadow-ai-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-2xl text-white">
              AYOKA<span className="text-gold-500"> CI</span>
            </span>
          </Link>
          <h1 className="font-heading font-bold text-3xl text-white mb-2">Inscription</h1>
          <p className="text-white/50 font-body">Rejoignez la plateforme</p>
        </div>

        <div className="glass-dark rounded-card-lg p-6 shadow-2xl">
          {/* Role Selection */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => update('role', 'partner')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-heading font-medium transition-all ${
                form.role === 'partner'
                  ? 'bg-ai-400 text-white shadow-ai-glow'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Partenaire
            </button>
            <button
              onClick={() => update('role', 'admin')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-heading font-medium transition-all ${
                form.role === 'admin'
                  ? 'bg-gold-500 text-navy-800'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Prénom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder="Aminata"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Nom *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Koné"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                />
              </div>
            </div>

            {form.role === 'partner' && (
              <>
                <div>
                  <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Entreprise *</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => update('businessName', e.target.value)}
                    placeholder="Mon Entreprise Touristique"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                  >
                    <option value="" className="text-navy-800">Sélectionnez...</option>
                    <option value="Tour Opérateur" className="text-navy-800">Tour Opérateur</option>
                    <option value="Hôtellerie" className="text-navy-800">Hôtellerie</option>
                    <option value="Restaurant" className="text-navy-800">Restaurant</option>
                    <option value="Transport" className="text-navy-800">Transport</option>
                    <option value="Activités" className="text-navy-800">Activités</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+225 07 00 00 00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="6 caractères minimum"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Confirmer *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Confirmez le mot de passe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-ai w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 font-body text-sm">
              Déjà un compte ?{' '}
              <Link to="/auth/login" className="text-ai-400 font-heading font-semibold hover:text-ai-300 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
