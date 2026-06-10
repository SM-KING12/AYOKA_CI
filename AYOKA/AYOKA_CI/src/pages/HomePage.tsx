import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  Star,
  MapPin,
  Shield,
  Zap,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { destinations, reviews } from '../data';
import DestinationCard from '../components/DestinationCard';

export default function HomePage() {
  const featured = destinations.filter((d) => d.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/17749102/pexels-photo-17749102.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Côte d'Ivoire"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-800/70 via-navy-800/50 to-navy-800/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-ai-400" />
              <span className="text-white/90 text-sm font-heading font-medium">
                Propulsé par l'Intelligence Artificielle
              </span>
            </div>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-7xl text-white mb-6 animate-slide-up leading-tight">
            Découvrez la
            <br />
            <span className="text-gradient-gold">Côte d'Ivoire</span>
          </h1>

          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mb-10 animate-slide-up font-body" style={{ animationDelay: '0.1s' }}>
            Explorez, planifiez et réservez vos expériences touristiques avec l'aide de notre assistant IA intelligent
          </p>

          {/* Search Bar */}
          <div
            className="w-full max-w-2xl animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="glass rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-ai-400" />
                <input
                  type="text"
                  placeholder="Où voulez-vous aller en Côte d'Ivoire ?"
                  className="w-full bg-transparent text-white placeholder-white/50 font-body py-3 focus:outline-none"
                />
              </div>
              <Link
                to="/explorer"
                className="btn-ai flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                Explorer
              </Link>
            </div>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {['Plages', 'Culture', 'Aventure', 'Nature', 'Hôtels'].map((tag) => (
              <Link
                key={tag}
                to={`/explorer?type=${tag.toLowerCase()}`}
                className="px-4 py-2 rounded-full glass text-white/80 text-sm font-heading font-medium hover:text-white hover:bg-white/15 transition-all duration-300"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-white/60 animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="glass rounded-card-lg shadow-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '150+', label: 'Destinations', icon: MapPin },
              { value: '50K+', label: 'Voyageurs', icon: Globe },
              { value: '4.8', label: 'Note moyenne', icon: Star },
              { value: '24/7', label: 'Assistant IA', icon: Zap },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="w-6 h-6 text-ai-400 mx-auto mb-2" />
                <div className="font-heading font-bold text-2xl text-navy-800">{value}</div>
                <div className="text-gray-500 text-sm font-body">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-ai-400 font-heading font-semibold text-sm uppercase tracking-wider">
                Destinations
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy-800 mt-1">
                Destinations populaires
              </h2>
            </div>
            <Link
              to="/explorer"
              className="hidden sm:flex items-center gap-2 text-ai-400 font-heading font-semibold hover:gap-3 transition-all duration-300"
            >
              Voir tout <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((d) => (
              <DestinationCard key={d.id} d={d} />
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link to="/explorer" className="btn-outline inline-flex items-center gap-2">
              Voir toutes les destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Feature Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-400 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-500 rounded-full blur-[96px]" />
        </div>

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-ai-400 font-heading font-semibold text-sm uppercase tracking-wider">
              Intelligence Artificielle
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mt-2 mb-6">
              Votre guide IA
              <br />
              <span className="text-ai-400">personnel</span>
            </h2>
            <p className="text-white/70 font-body text-lg mb-8 leading-relaxed">
              Notre assistant IA connaît chaque recoin de la Côte d'Ivoire. Il génère des itinéraires sur mesure,
              recommande des expériences adaptées à vos goûts et répond à toutes vos questions en temps réel.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Sparkles, title: 'Itinéraires générés par IA', desc: 'Plans de voyage personnalisés en quelques secondes' },
                { icon: Zap, title: 'Recommandations intelligentes', desc: 'Basées sur vos préférences et votre budget' },
                { icon: Shield, title: 'Conseils contextuels', desc: 'Réponses en temps réel pendant votre voyage' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-ai-400/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-ai-400" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white">{title}</h4>
                    <p className="text-white/60 text-sm font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/assistant" className="btn-ai inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Essayer l'assistant IA
            </Link>
          </div>

          {/* AI Chat Preview */}
          <div className="glass-dark rounded-card-lg p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-400 to-ai-600 flex items-center justify-center shadow-ai-glow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-heading font-semibold text-white text-sm">Assistant AYOKA</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                    <span className="text-green-400 text-xs font-body">En ligne</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl rounded-tl-sm p-4 ai-message-glow">
                <p className="text-white/90 text-sm font-body">
                  Bonjour ! Je suis votre assistant AYOKA. Je peux vous aider à planifier votre voyage en Côte d'Ivoire. Que souhaitez-vous découvrir ?
                </p>
              </div>

              <div className="bg-navy-700/50 rounded-2xl rounded-tr-sm p-4 ml-8">
                <p className="text-white/80 text-sm font-body">
                  J'aimerais visiter les meilleures plages près d'Abidjan pour le week-end
                </p>
              </div>

              <div className="glass rounded-2xl rounded-tl-sm p-4 ai-message-glow">
                <p className="text-white/90 text-sm font-body mb-3">
                  Voici mes recommandations pour un week-end plage près d'Abidjan :
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['Assinie-Mafia', 'Grand-Bassam', 'Bingerville', 'Jacqueville'].map((name) => (
                    <div key={name} className="bg-navy-700/40 rounded-xl p-3 border border-white/10">
                      <div className="font-heading font-semibold text-white text-xs">{name}</div>
                      <div className="text-ai-400 text-xs font-body mt-1">1h-2h d'Abidjan</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-20 px-4 bg-beige-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-heading font-semibold text-sm uppercase tracking-wider">
              Expériences
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy-800 mt-1">
              Vivez des expériences uniques
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'Safari & Nature',
                desc: 'Découvrez la faune exceptionnelle dans les parcs nationaux',
                tag: 'Aventure',
              },
              {
                image: 'https://images.pexels.com/photos/1591375/pexels-photo-1591375.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'Détente & Plages',
                desc: 'Profitez du soleil et des eaux cristallines de la côte',
                tag: 'Plage',
              },
              {
                image: 'https://images.pexels.com/photos/2668328/pexels-photo-2668328.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'Culture & Histoire',
                desc: 'Explorez un patrimoine riche et des traditions fascinantes',
                tag: 'Culture',
              },
            ].map(({ image, title, desc, tag }) => (
              <div key={title} className="card-lg group overflow-hidden cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-800/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-heading font-semibold bg-gold-500/90 text-navy-800">
                      {tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-heading font-bold text-xl text-white mb-1">{title}</h3>
                    <p className="text-white/70 text-sm font-body">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-ai-400 font-heading font-semibold text-sm uppercase tracking-wider">
              Témoignages
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-navy-800 mt-1">
              Ce que disent nos voyageurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm font-body mb-4 leading-relaxed">
                  "{r.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
                    <span className="text-white font-heading font-semibold text-xs">{r.avatar}</span>
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-sm text-navy-800">{r.author}</div>
                    <div className="text-gray-400 text-xs font-body">{r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-navy-800 to-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ai-400 rounded-full blur-[200px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white mb-6">
            Prêt à explorer la
            <br />
            Côte d'Ivoire ?
          </h2>
          <p className="text-white/60 font-body text-lg mb-10 max-w-xl mx-auto">
            Laissez notre assistant IA créer le voyage parfait pour vous. Commencez votre aventure dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explorer" className="btn-gold flex items-center gap-2 text-lg">
              Commencer l'exploration <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/assistant" className="btn-outline border-white/30 text-white hover:bg-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Parler à l'IA
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-ai-400 to-ai-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-xl">
                  AYOKA<span className="text-gold-500"> CI</span>
                </span>
              </div>
              <p className="text-white/50 font-body text-sm leading-relaxed">
                La plateforme touristique intelligente pour découvrir la Côte d'Ivoire. Propulsée par l'IA.
              </p>
            </div>
            {[
              {
                title: 'Destinations',
                links: ['Grand-Bassam', 'Parc de Taï', 'Assinie', 'Yamoussoukro', 'Man'],
              },
              {
                title: 'Plateforme',
                links: ['Explorer', 'Assistant IA', 'Réservations', 'Mon compte'],
              },
              {
                title: 'Support',
                links: ['Centre d\'aide', 'Contact', 'Conditions', 'Confidentialité'],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/70 mb-4">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/50 hover:text-ai-400 text-sm font-body transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm font-body">&copy; 2026 AYOKA CI. Tous droits réservés.</p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai-400" />
              <span className="text-white/30 text-xs font-body">Propulsé par l'Intelligence Artificielle</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
