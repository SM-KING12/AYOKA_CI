// ============================================================
// ITINERARIES ENDPOINT - SUPABASE EDGE FUNCTION
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
    // POST /itineraries/generate (User only)
    if (path === '/itineraries/generate' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const body = await req.json();
      const validation = validateRequired(body, ['destination', 'startDate', 'endDate', 'budget']);
      
      if (!validation.valid) {
        return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      const { destination, startDate, endDate, budget, travelers, name, interests } = body;

      // Create itinerary
      const { data: itinerary, error } = await supabase
        .from('itineraries')
        .insert({
          user_id: user.id,
          name: name || `Voyage à ${destination}`,
          destination,
          start_date: startDate,
          end_date: endDate,
          budget,
          travelers: travelers || 1,
          status: 'draft',
        })
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      // Generate itinerary items based on duration
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const days = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const itineraryItems = [];
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDateObj);
        currentDate.setDate(startDateObj.getDate() + i);

        itineraryItems.push({
          itinerary_id: itinerary.id,
          day_number: i + 1,
          date: currentDate.toISOString().split('T')[0],
          order_index: i,
        });
      }

      const { error: itemsError } = await supabase
        .from('itinerary_items')
        .insert(itineraryItems);

      if (itemsError) {
        return errorResponse(itemsError.message, 500);
      }

      return successResponse(itinerary, 201);
    }

    // GET /itineraries/user (User only)
    if (path === '/itineraries/user' && req.method === 'GET') {
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
        .from('itineraries')
        .select(`
          *,
          itinerary_items(
            id,
            day_number,
            date,
            service_id,
            activity_name,
            activity_type,
            time,
            duration,
            price
          )
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
        itineraries: data,
        pagination: {
          page,
          limit: limitValue,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitValue),
        },
      });
    }

    // GET /itineraries/:id
    if (path.match(/^\/itineraries\/[^/]+$/) && req.method === 'GET') {
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
        .from('itineraries')
        .select(`
          *,
          itinerary_items(
            id,
            day_number,
            date,
            service_id,
            activity_name,
            activity_type,
            time,
            duration,
            price,
            notes,
            order_index,
            services(id, name, type, images, price)
          )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        return errorResponse('Itinerary not found', 404);
      }

      // Sort items by day_number and order_index
      if (data.itinerary_items) {
        data.itinerary_items.sort((a: any, b: any) => {
          if (a.day_number !== b.day_number) {
            return a.day_number - b.day_number;
          }
          return a.order_index - b.order_index;
        });
      }

      return successResponse(data);
    }

    // PUT /itineraries/:id (User only)
    if (path.match(/^\/itineraries\/[^/]+$/) && req.method === 'PUT') {
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
      const { data: existingItinerary } = await supabase
        .from('itineraries')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingItinerary?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { data: itinerary, error } = await supabase
        .from('itineraries')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(itinerary);
    }

    // DELETE /itineraries/:id (User only)
    if (path.match(/^\/itineraries\/[^/]+$/) && req.method === 'DELETE') {
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
      const { data: existingItinerary } = await supabase
        .from('itineraries')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingItinerary?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Itinerary deleted' });
    }

    // POST /itineraries/:id/items (User only - add activity)
    if (path.match(/^\/itineraries\/[^/]+\/items$/) && req.method === 'POST') {
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
      const validation = validateRequired(body, ['dayNumber', 'date']);
      
      if (!validation.valid) {
        return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      // Check ownership
      const { data: existingItinerary } = await supabase
        .from('itineraries')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingItinerary?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { data: item, error } = await supabase
        .from('itinerary_items')
        .insert({
          itinerary_id: id,
          ...body,
        })
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(item, 201);
    }

    // PUT /itinerary-items/:id (User only)
    if (path.match(/^\/itinerary-items\/[^/]+$/) && req.method === 'PUT') {
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
      const { data: existingItem } = await supabase
        .from('itinerary_items')
        .select(`
          itinerary_id,
          itineraries(user_id)
        `)
        .eq('id', id)
        .single();

      if (existingItem?.itineraries?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { data: item, error } = await supabase
        .from('itinerary_items')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse(item);
    }

    // DELETE /itinerary-items/:id (User only)
    if (path.match(/^\/itinerary-items\/[^/]+$/) && req.method === 'DELETE') {
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
      const { data: existingItem } = await supabase
        .from('itinerary_items')
        .select(`
          itinerary_id,
          itineraries(user_id)
        `)
        .eq('id', id)
        .single();

      if (existingItem?.itineraries?.user_id !== user.id) {
        return errorResponse('Access denied', 403);
      }

      const { error } = await supabase
        .from('itinerary_items')
        .delete()
        .eq('id', id);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Itinerary item deleted' });
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('Itineraries error:', error);
    return errorResponse('Internal server error', 500);
  }
});
