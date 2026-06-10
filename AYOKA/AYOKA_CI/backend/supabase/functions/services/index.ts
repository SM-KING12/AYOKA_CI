// ============================================================
// SERVICES ENDPOINT - SUPABASE EDGE FUNCTION
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  corsHeaders,
  errorResponse,
  successResponse,
  getPagination,
  createSupabaseClient,
  getUserFromAuth,
} from '../_shared/index.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createSupabaseClient(req);
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // GET /services
    if (path === '/services' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const type = url.searchParams.get('type');
      const destination = url.searchParams.get('destination');
      const minPrice = url.searchParams.get('minPrice');
      const maxPrice = url.searchParams.get('maxPrice');
      const search = url.searchParams.get('search');

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('services')
        .select(`
          *,
          partners(id, business_name, rating, verified),
          destinations(id, name, region, image_url)
        `, { count: 'exact' })
        .eq('status', 'active')
        .order('rating', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (destination) {
        query = query.ilike('destinations.name', `%${destination}%`);
      }

      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }

      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error, count } = await query.range(offset, offset + limitValue - 1);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({
        services: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // GET /services/:id
    if (path.match(/^\/services\/[^/]+$/) && req.method === 'GET') {
      const id = path.split('/').pop();

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          partners(id, business_name, owner_name, email, phone, city, rating, review_count),
          destinations(id, name, region, description, highlights),
          reviews(id, rating, comment, user_id, created_at)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return errorResponse('Service not found', 404);
      }

      return successResponse(data);
    }

    // POST /partner/services (Partner only)
    if (path === '/partner/services' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      // Check partner role
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!partnerData) {
        return errorResponse('Partner access required', 403);
      }

      const body = await req.json();
      const serviceData = {
        ...body,
        partner_id: user.id,
        status: 'draft',
      };

      const { data: service, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(service, 201);
    }

    // PUT /partner/services/:id (Partner only)
    if (path.match(/^\/partner\/services\/[^/]+$/) && req.method === 'PUT') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/').pop();
      const body = await req.json();

      // Check ownership
      const { data: existingService } = await supabase
        .from('services')
        .select('partner_id')
        .eq('id', id)
        .single();

      if (existingService?.partner_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { data: service, error } = await supabase
        .from('services')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(service);
    }

    // DELETE /partner/services/:id (Partner only)
    if (path.match(/^\/partner\/services\/[^/]+$/) && req.method === 'DELETE') {
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
      const { data: existingService } = await supabase
        .from('services')
        .select('partner_id')
        .eq('id', id)
        .single();

      if (existingService?.partner_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { error } = await supabase
        .from('services')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Service archived' });
    }

    // PATCH /partner/services/:id/status (Partner only - toggle status)
    if (path.match(/^\/partner\/services\/[^/]+\/status$/) && req.method === 'PATCH') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/')[3];
      const body = await req.json();
      const { status } = body;

      // Check ownership
      const { data: existingService } = await supabase
        .from('services')
        .select('partner_id, status')
        .eq('id', id)
        .single();

      if (existingService?.partner_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { data: service, error } = await supabase
        .from('services')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(service);
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('Services error:', error);
    return errorResponse('Internal server error', 500);
  }
});
