import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageTransition } from '../../components/UI';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('6 caractères minimum');
      return;
    }
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch {
      setError('Code invalide');
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 relative overflow-hidden px-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gold-500 rounded-full blur-[128px]" />
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
          <h1 className="font-heading font-bold text-3xl text-white mb-2">Réinitialisation</h1>
          <p className="text-white/50 font-body">Entrez le code reçu par email</p>
        </div>

        <div className="glass-dark rounded-card-lg p-6 shadow-2xl">
          {done ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-nature-400/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-nature-400" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">Mot de passe mis à jour !</h3>
              <p className="text-white/50 font-body text-sm mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <button onClick={() => navigate('/auth/login')} className="btn-ai w-full">
                Se connecter
              </button>
            </motion.div>
          ) : (
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
                <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Code de vérification</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Ex: ABC123"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all text-center tracking-widest text-lg"
                />
              </div>

              <div>
                <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Confirmer</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <>Réinitialiser <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link to="/auth/login" className="text-ai-400 font-heading font-semibold text-sm inline-flex items-center gap-1 hover:text-ai-300 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
