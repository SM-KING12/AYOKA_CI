import type { TravelerReservation, PartnerService } from '../../types';

export interface BookingRequest {
  serviceId: string;
  travelerId: string;
  startDate: string;
  endDate: string;
  guests: number;
}

export interface BookingResponse {
  success: boolean;
  reservation?: TravelerReservation;
  error?: string;
}

export function calculateTotalPrice(service: PartnerService, guests: number, days: number = 1): number {
  return service.price * guests * days;
}

export function validateBookingRequest(
  service: PartnerService,
  request: BookingRequest
): { valid: boolean; error?: string } {
  if (request.guests < 1) {
    return { valid: false, error: 'Le nombre de personnes doit être au moins 1' };
  }
  
  if (request.guests > service.capacity) {
    return { valid: false, error: `Ce service ne peut accueillir que ${service.capacity} personnes maximum` };
  }
  
  if (service.status !== 'active') {
    return { valid: false, error: 'Ce service n\'est pas disponible actuellement' };
  }
  
  return { valid: true };
}

export function createReservation(
  service: PartnerService,
  request: BookingRequest
): TravelerReservation {
  const days = calculateDays(request.startDate, request.endDate);
  const total = calculateTotalPrice(service, request.guests, days);
  
  return {
    id: `res-${Date.now()}`,
    travelerId: request.travelerId,
    serviceId: service.id,
    serviceName: service.name,
    serviceType: service.type,
    destination: service.destination,
    startDate: request.startDate,
    endDate: request.endDate,
    guests: request.guests,
    total,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
  };
}

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}
