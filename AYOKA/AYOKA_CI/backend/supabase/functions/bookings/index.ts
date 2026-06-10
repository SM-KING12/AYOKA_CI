// ============================================================
// BOOKINGS ENDPOINT - SUPABASE EDGE FUNCTION
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  corsHeaders,
  errorResponse,
  successResponse,
  getPagination,
  createSupabaseClient,
  getUserFromAuth,
  validateRequired,
} from '../_shared/index.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createSupabaseClient(req);
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // POST /bookings (User only)
    if (path === '/bookings' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const body = await req.json();
      const validation = validateRequired(body, ['serviceId', 'guestName', 'guestCount', 'startDate', 'totalPrice']);
      
      if (!validation.valid) {
        return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      const { serviceId, guestName, guestEmail, guestPhone, guestCount, startDate, endDate, totalPrice, specialRequests } = body;

      // Get service details
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('partner_id, price, capacity, current_bookings, availability')
        .eq('id', serviceId)
        .single();

      if (serviceError || !service) {
        return errorResponse('Service not found', 404);
      }

      // Check availability
      if (service.capacity - service.current_bookings < guestCount) {
        return errorResponse('Not enough capacity', 400);
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: serviceId,
          partner_id: service.partner_id,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          guest_count: guestCount,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          special_requests: specialRequests,
          status: 'pending',
          payment_status: 'pending',
        })
        .select(`
          *,
          services(id, name, type, images),
          partners(id, business_name, email, phone)
        `)
        .single();

      if (bookingError) {
        return errorResponse(bookingError.message, 500);
      }

      // Create notification for partner
      await supabase.from('notifications').insert({
        user_id: service.partner_id,
        type: 'reservation',
        title: 'Nouvelle réservation',
        message: `Nouvelle réservation de ${guestName} pour ${booking.services?.name}`,
        data: { booking_id: booking.id },
      });

      return successResponse(booking, 201);
    }

    // GET /bookings/user (User only)
    if (path === '/bookings/user' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const status = url.searchParams.get('status');

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('bookings')
        .select(`
          *,
          services(id, name, type, images, price),
          partners(id, business_name, phone),
          payments(id, amount, status, payment_method)
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query.range(offset, offset + limitValue - 1);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({
        bookings: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // GET /partner/bookings (Partner only)
    if (path === '/partner/bookings' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const status = url.searchParams.get('status');

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('bookings')
        .select(`
          *,
          services(id, name, type, images),
          users(id, first_name, last_name, email, phone)
        `, { count: 'exact' })
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query.range(offset, offset + limitValue - 1);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({
        bookings: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // GET /bookings/:id
    if (path.match(/^\/bookings\/[^/]+$/) && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/').pop();

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services(id, name, type, images, description, price, price_unit),
          partners(id, business_name, email, phone),
          users(id, first_name, last_name, email, phone),
          payments(id, amount, status, payment_method, paid_at)
        `)
        .or(`user_id.eq.${user.id},partner_id.eq.${user.id}`)
        .eq('id', id)
        .single();

      if (error) {
        return errorResponse('Booking not found', 404);
      }

      return successResponse(data);
    }

    // PATCH /bookings/:id/status (Partner only - update status)
    if (path.match(/^\/bookings\/[^/]+\/status$/) && req.method === 'PATCH') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/')[2];
      const body = await req.json();
      const { status, cancellationReason } = body;

      // Check ownership
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('partner_id, status')
        .eq('id', id)
        .single();

      if (existingBooking?.partner_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const updateData: any = { status };
      
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.payment_status = 'paid';
      } else if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
        updateData.cancellation_reason = cancellationReason;
        updateData.payment_status = 'refunded';
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      // Notify user
      await supabase.from('notifications').insert({
        user_id: booking.user_id,
        type: 'reservation',
        title: `Réservation ${status}`,
        message: `Votre réservation a été ${status}`,
        data: { booking_id: booking.id },
      });

      return successResponse(booking);
    }

    // DELETE /bookings/:id (User only - cancel booking)
    if (path.match(/^\/bookings\/[^/]+$/) && req.method === 'DELETE') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/').pop();

      // Check ownership
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('user_id, status')
        .eq('id', id)
        .single();

      if (existingBooking?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      if (existingBooking?.status === 'confirmed' || existingBooking?.status === 'completed') {
        return errorResponse('Cannot cancel confirmed or completed booking', 400);
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          payment_status: 'refunded',
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      // Notify partner
      await supabase.from('notifications').insert({
        user_id: booking.partner_id,
        type: 'reservation',
        title: 'Réservation annulée',
        message: `Une réservation a été annulée`,
        data: { booking_id: booking.id },
      });

      return successResponse(booking);
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('Bookings error:', error);
    return errorResponse('Internal server error', 500);
  }
});
