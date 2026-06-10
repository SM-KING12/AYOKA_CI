// ============================================================
// ADMIN ENDPOINT - SUPABASE EDGE FUNCTION
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  corsHeaders,
  errorResponse,
  successResponse,
  getPagination,
  createSupabaseClient,
  getUserFromAuth,
  logAdminAction,
} from '../_shared/index.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createSupabaseClient(req);
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // Verify admin access for all admin endpoints
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse('Missing authorization header', 401);
    }

    const user = await getUserFromAuth(supabase, authHeader);
    if (!user) {
      return errorResponse('Invalid token', 401);
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }

    // GET /admin/partners
    if (path === '/admin/partners' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const status = url.searchParams.get('status'); // verified, blocked
      const search = url.searchParams.get('search');

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('partners')
        .select(`
          *,
          users(id, email, first_name, last_name, phone, city, created_at, blocked)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status === 'verified') {
        query = query.eq('verified', true);
      } else if (status === 'blocked') {
        query = query.eq('users.blocked', true);
      }

      if (search) {
        query = query.ilike('business_name', `%${search}%`);
      }

      const { data, error, count } = await query.range(offset, offset + limitValue - 1);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({
        partners: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // PATCH /admin/partners/:id/verify
    if (path.match(/^\/admin\/partners\/[^/]+\/verify$/) && req.method === 'PATCH') {
      const id = path.split('/')[3];

      const { data: partner, error } = await supabase
        .from('partners')
        .update({ verified: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      await logAdminAction(supabase, user.id, 'verify_partner', 'partner', id);

      // Notify partner
      await supabase.from('notifications').insert({
        user_id: id,
        type: 'system',
        title: 'Compte vérifié',
        message: 'Votre compte partenaire a été vérifié',
      });

      return successResponse(partner);
    }

    // PATCH /admin/partners/:id/block
    if (path.match(/^\/admin\/partners\/[^/]+\/block$/) && req.method === 'PATCH') {
      const id = path.split('/')[3];
      const body = await req.json();
      const { blocked } = body;

      const { data: user, error: userError } = await supabase
        .from('users')
        .update({ blocked })
        .eq('id', id)
        .select()
        .single();

      if (userError) {
        return errorResponse(userError.message, 500);
      }

      await logAdminAction(supabase, user.id, blocked ? 'block_partner' : 'unblock_partner', 'user', id);

      return successResponse(user);
    }

    // GET /admin/users
    if (path === '/admin/users' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const role = url.searchParams.get('role');
      const search = url.searchParams.get('search');

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (role) {
        query = query.eq('role', role);
      }

      if (search) {
        query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error, count } = await query.range(offset, offset + limitValue - 1);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({
        users: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // GET /admin/analytics
    if (path === '/admin/analytics' && req.method === 'GET') {
      const period = url.searchParams.get('period') || '7d'; // 7d, 30d, 90d

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      if (period === '7d') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === '30d') {
        startDate.setDate(now.getDate() - 30);
      } else if (period === '90d') {
        startDate.setDate(now.getDate() - 90);
      }

      const startDateStr = startDate.toISOString().split('T')[0];

      // Get stats
      const [
        { count: totalUsers },
        { count: totalPartners },
        { count: totalBookings },
        { count: totalRevenue },
        { data: recentBookings },
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', startDateStr),
        supabase.from('bookings').select('total_price', { count: 'exact', head: true }).gte('created_at', startDateStr),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      const revenue = totalRevenue?.reduce((sum: number, b: any) => sum + (b.total_price || 0), 0) || 0;

      return successResponse({
        period,
        stats: {
          totalUsers: totalUsers || 0,
          totalPartners: totalPartners || 0,
          totalBookings: totalBookings || 0,
          totalRevenue: revenue,
        },
        recentBookings,
      });
    }

    // GET /admin/monitoring
    if (path === '/admin/monitoring' && req.method === 'GET') {
      // Get system health metrics
      const [
        { count: activeServices },
        { count: pendingBookings },
        { count: unverifiedPartners },
        { data: recentLogs },
      ] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('partners').select('id', { count: 'exact', head: true }).eq('verified', false),
        supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(20),
      ]);

      return successResponse({
        health: {
          activeServices: activeServices || 0,
          pendingBookings: pendingBookings || 0,
          unverifiedPartners: unverifiedPartners || 0,
        },
        recentLogs,
      });
    }

    // GET /admin/services (all services)
    if (path === '/admin/services' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const status = url.searchParams.get('status');

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('services')
        .select(`
          *,
          partners(id, business_name, owner_name),
          destinations(id, name, region)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
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

    // PATCH /admin/services/:id/status (Admin only - validate service)
    if (path.match(/^\/admin\/services\/[^/]+\/status$/) && req.method === 'PATCH') {
      const id = path.split('/')[3];
      const body = await req.json();
      const { status } = body;

      const { data: service, error } = await supabase
        .from('services')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      await logAdminAction(supabase, user.id, 'update_service_status', 'service', id, null, { status });

      // Notify partner
      await supabase.from('notifications').insert({
        user_id: service.partner_id,
        type: 'system',
        title: 'Service mis à jour',
        message: `Votre service a été ${status}`,
        data: { service_id: id },
      });

      return successResponse(service);
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('Admin error:', error);
    return errorResponse('Internal server error', 500);
  }
});
