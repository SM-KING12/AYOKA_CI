import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, Eye, EyeOff, ArrowRight, Shield, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageTransition } from '../../components/UI';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    try {
      await login(email, password);
      // Redirect based on role (will be determined by login)
      navigate('/partner/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect');
    }
  };

  const quickLogin = async (role: 'admin' | 'partner') => {
    setError('');
    try {
      const mockEmail = role === 'admin' ? 'admin@ayoka.ci' : 'partner@ayoka.ci';
      await login(mockEmail, 'demo');
      navigate(role === 'admin' ? '/admin/dashboard' : '/partner/dashboard');
    } catch {
      setError('Erreur de connexion');
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 relative overflow-hidden px-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-400 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-500 rounded-full blur-[96px]" />
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
          <h1 className="font-heading font-bold text-3xl text-white mb-2">Connexion</h1>
          <p className="text-white/50 font-body">Accédez à votre espace</p>
        </div>

        <div className="glass-dark rounded-card-lg p-6 shadow-2xl">
          {/* Quick Demo Login */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => quickLogin('partner')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-ai-400/10 border border-ai-400/20 text-ai-400 text-xs font-heading font-medium hover:bg-ai-400/20 transition-all"
            >
              <User className="w-4 h-4" /> Demo Partenaire
            </button>
            <button
              onClick={() => quickLogin('admin')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-heading font-medium hover:bg-gold-500/20 transition-all"
            >
              <Shield className="w-4 h-4" /> Demo Admin
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/30 text-xs font-body">ou connectez-vous</span>
            <div className="h-px flex-1 bg-white/10" />
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

            <div>
              <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-ai-400 focus:ring-ai-400" />
                <span className="text-white/50 text-xs font-body">Se souvenir de moi</span>
              </label>
              <Link to="/auth/forgot-password" className="text-ai-400 text-xs font-heading font-medium hover:text-ai-300 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-ai w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 font-body text-sm">
              Pas encore de compte ?{' '}
              <Link to="/auth/register" className="text-ai-400 font-heading font-semibold hover:text-ai-300 transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
