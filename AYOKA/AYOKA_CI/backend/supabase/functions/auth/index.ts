// ============================================================
// AUTH ENDPOINT - SUPABASE EDGE FUNCTION
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  corsHeaders,
  errorResponse,
  successResponse,
  getUserFromAuth,
  getUserRole,
  validateRequired,
  createSupabaseClient,
} from '../_shared/index.ts';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createSupabaseClient(req);
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // POST /auth/register
    if (path === '/auth/register' && req.method === 'POST') {
      const body = await req.json();
      const validation = validateRequired(body, ['email', 'password', 'firstName', 'lastName']);
      
      if (!validation.valid) {
        return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      const { email, password, firstName, lastName, phone, city, role } = body;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return errorResponse(authError.message, 400);
      }

      // Create user profile
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user!.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        city: city || null,
        avatar: `${firstName[0]}${lastName[0]}`,
        role: role || 'user',
        verified: false,
      });

      if (userError) {
        return errorResponse(userError.message, 500);
      }

      // Create profile
      await supabase.from('profiles').insert({
        id: authData.user!.id,
      });

      return successResponse({
        user: authData.user,
        message: 'Registration successful',
      });
    }

    // POST /auth/login
    if (path === '/auth/login' && req.method === 'POST') {
      const body = await req.json();
      const validation = validateRequired(body, ['email', 'password']);
      
      if (!validation.valid) {
        return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      const { email, password } = body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return errorResponse(error.message, 401);
      }

      // Check if user is blocked
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('blocked, role')
        .eq('id', data.user.id)
        .single();

      if (userError || userData?.blocked) {
        return errorResponse('Account is blocked or not found', 403);
      }

      return successResponse({
        user: data.user,
        session: data.session,
        role: userData?.role,
      });
    }

    // GET /auth/me
    if (path === '/auth/me' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      // Get full user data
      const { data: userData, error } = await supabase
        .from('users')
        .select(`
          *,
          profiles(*),
          partners(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(userData);
    }

    // POST /auth/logout
    if (path === '/auth/logout' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Logged out successfully' });
    }

    // POST /auth/forgot-password
    if (path === '/auth/forgot-password' && req.method === 'POST') {
      const body = await req.json();
      const validation = validateRequired(body, ['email']);
      
      if (!validation.valid) {
        return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      const { email } = body;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${Deno.env.get('APP_URL')}/auth/reset-password`,
      });

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Password reset email sent' });
    }

    // POST /auth/reset-password
    if (path === '/auth/reset-password' && req.method === 'POST') {
      const body = await req.json();
      const validation = validateRequired(body, ['password']);
      
      if (!validation.valid) {
        return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      const { password } = body;

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Password updated successfully' });
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('Auth error:', error);
    return errorResponse('Internal server error', 500);
  }
});
