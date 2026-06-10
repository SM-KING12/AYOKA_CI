// ============================================================
// NOTIFICATIONS ENDPOINT - SUPABASE EDGE FUNCTION
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
    // GET /notifications (User only)
    if (path === '/notifications' && req.method === 'GET') {
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
      const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

      const { offset, limit: limitValue } = getPagination(page, limit);

      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error, count } = await query.range(offset, offset + limitValue - 1);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({
        notifications: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // GET /notifications/unread-count (User only)
    if (path === '/notifications/unread-count' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ unreadCount: count || 0 });
    }

    // PATCH /notifications/:id/read (User only)
    if (path.match(/^\/notifications\/[^/]+\/read$/) && req.method === 'PATCH') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/')[2];

      // Check ownership
      const { data: existingNotification } = await supabase
        .from('notifications')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingNotification?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { data: notification, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(notification);
    }

    // PATCH /notifications/read-all (User only)
    if (path === '/notifications/read-all' && req.method === 'PATCH') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'All notifications marked as read' });
    }

    // DELETE /notifications/:id (User only)
    if (path.match(/^\/notifications\/[^/]+$/) && req.method === 'DELETE') {
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
      const { data: existingNotification } = await supabase
        .from('notifications')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingNotification?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Notification deleted' });
    }

    // POST /notifications (Admin/System only - send notification)
    if (path === '/notifications' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      // Check admin role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'admin') {
        return errorResponse('Admin access required', 403);
      }

      const body = await req.json();
      const { userId, type, title, message, data: notificationData } = body;

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data: notificationData || {},
        })
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(notification, 201);
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('Notifications error:', error);
    return errorResponse('Internal server error', 500);
  }
});
