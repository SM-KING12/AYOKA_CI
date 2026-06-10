import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Destination, typeLabels } from '../data';

export default function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link to={`/destination/${d.id}`} className="card group overflow-hidden">
      <div className="relative h-52 overflow-hidden">
        <img
          src={d.image}
          alt={d.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-heading font-semibold bg-white/90 text-navy-800">
            {typeLabels[d.type]}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-heading font-bold text-white text-lg drop-shadow-lg">{d.name}</h3>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {d.city}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
            <span className="font-heading font-semibold text-sm">{d.rating}</span>
            <span className="text-gray-400 text-xs">({d.reviews} avis)</span>
          </div>
          {d.price > 0 && (
            <div className="text-right">
              <span className="font-heading font-bold text-navy-800">{d.price.toLocaleString()}</span>
              <span className="text-xs text-gray-500 ml-1">FCFA</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{d.shortDescription}</p>
      </div>
    </Link>
  );
}
