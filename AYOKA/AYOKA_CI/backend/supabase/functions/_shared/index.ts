// ============================================================
// SHARED UTILITIES - SUPABASE EDGE FUNCTIONS
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

// Supabase client
export function createSupabaseClient(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });
}

// Error response
export function errorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Success response
export function successResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get user from auth header
export async function getUserFromAuth(supabase: any, authHeader: string) {
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Check user role
export async function getUserRole(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (error) return null;
  return data?.role;
}

// Validate required fields
export function validateRequired(data: any, fields: string[]) {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
}

// Pagination helper
export function getPagination(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return { offset, limit };
}

// Log admin action
export async function logAdminAction(
  supabase: any,
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldValues: any = null,
  newValues: any = null
) {
  const { error } = await supabase.from('admin_logs').insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_values: oldValues,
    new_values: newValues,
  });
  
  if (error) console.error('Failed to log admin action:', error);
}
