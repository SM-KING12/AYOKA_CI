// ============================================================
// DESTINATIONS ENDPOINT - SUPABASE EDGE FUNCTION
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  corsHeaders,
  errorResponse,
  successResponse,
  getPagination,
  createSupabaseClient,
} from '../_shared/index.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createSupabaseClient(req);
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // GET /destinations
    if (path === '/destinations' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const region = url.searchParams.get('region');
      const search = url.searchParams.get('search');
      const featured = url.searchParams.get('featured');

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('destinations')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (region) {
        query = query.eq('region', region);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }

      const { data, error, count } = await query.range(offset, offset + limitValue - 1);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({
        destinations: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // GET /destinations/:id
    if (path.match(/^\/destinations\/[^/]+$/) && req.method === 'GET') {
      const id = path.split('/').pop();
      const slug = url.searchParams.get('slug');

      let query = supabase
        .from('destinations')
        .select(`
          *,
          services(
            id,
            name,
            type,
            price,
            price_unit,
            rating,
            images,
            status
          )
        `)
        .eq('is_active', true);

      if (slug) {
        query = query.eq('slug', slug);
      } else {
        query = query.eq('id', id);
      }

      const { data, error } = await query.single();

      if (error) {
        return errorResponse('Destination not found', 404);
      }

      return successResponse(data);
    }

    // POST /destinations (Admin only)
    if (path === '/destinations' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!user.data.user) {
        return errorResponse('Invalid token', 401);
      }

      // Check admin role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.data.user.id)
        .single();

      if (userData?.role !== 'admin') {
        return errorResponse('Admin access required', 403);
      }

      const body = await req.json();
      const { data: destination, error } = await supabase
        .from('destinations')
        .insert(body)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(destination, 201);
    }

    // PUT /destinations/:id (Admin only)
    if (path.match(/^\/destinations\/[^/]+$/) && req.method === 'PUT') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!user.data.user) {
        return errorResponse('Invalid token', 401);
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.data.user.id)
        .single();

      if (userData?.role !== 'admin') {
        return errorResponse('Admin access required', 403);
      }

      const id = path.split('/').pop();
      const body = await req.json();

      const { data: destination, error } = await supabase
        .from('destinations')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(destination);
    }

    // DELETE /destinations/:id (Admin only)
    if (path.match(/^\/destinations\/[^/]+$/) && req.method === 'DELETE') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!user.data.user) {
        return errorResponse('Invalid token', 401);
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.data.user.id)
        .single();

      if (userData?.role !== 'admin') {
        return errorResponse('Admin access required', 403);
      }

      const id = path.split('/').pop();

      const { error } = await supabase
        .from('destinations')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Destination deactivated' });
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('Destinations error:', error);
    return errorResponse('Internal server error', 500);
  }
});
