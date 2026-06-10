import type { PartnerService } from '../../types';

export interface SearchFilters {
  type?: PartnerService['type'];
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  query?: string;
}

export function searchServices(
  services: PartnerService[],
  filters: SearchFilters
): PartnerService[] {
  return services.filter((service) => {
    if (filters.type && service.type !== filters.type) return false;
    if (filters.destination && !service.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
    if (filters.minPrice && service.price < filters.minPrice) return false;
    if (filters.maxPrice && service.price > filters.maxPrice) return false;
    if (filters.minRating && service.rating < filters.minRating) return false;
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesName = service.name.toLowerCase().includes(query);
      const matchesDestination = service.destination.toLowerCase().includes(query);
      const matchesDescription = service.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDestination && !matchesDescription) return false;
    }
    return true;
  });
}

export function sortServices(
  services: PartnerService[],
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'popularity'
): PartnerService[] {
  const sorted = [...services];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popularity':
      return sorted.sort((a, b) => b.bookings - a.bookings);
    default:
      return sorted;
  }
}
