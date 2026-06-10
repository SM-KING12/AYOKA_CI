-- ============================================================
-- AYOKA CI - SUPABASE DATABASE SCHEMA
-- ============================================================
-- Plateforme touristique hybride (Web + Mobile)
-- Backend: Supabase (PostgreSQL + Auth + Storage)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

-- User roles
CREATE TYPE user_role AS ENUM ('user', 'partner', 'admin');

-- Service types
CREATE TYPE service_type AS ENUM ('hotel', 'activity', 'restaurant', 'transport', 'tour');

-- Booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

-- Notification types
CREATE TYPE notification_type AS ENUM ('reservation', 'reminder', 'ai', 'promotion', 'system');

-- ============================================================
-- TABLES
-- ============================================================

-- USERS (Extended from Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  avatar TEXT,
  role user_role NOT NULL DEFAULT 'user',
  membership TEXT DEFAULT 'standard',
  verified BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PROFILES (User profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PARTNERS (Partner profiles)
CREATE TABLE public.partners (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  revenue DECIMAL(15,2) DEFAULT 0.00,
  verified BOOLEAN DEFAULT FALSE,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DESTINATIONS
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  region TEXT,
  country TEXT DEFAULT 'Côte d\'Ivoire',
  image_url TEXT,
  coordinates JSONB,
  highlights TEXT[],
  best_season TEXT,
  budget_level TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SERVICES (Partner services)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type service_type NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  price_unit TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  current_bookings INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft', -- draft, active, paused, archived
  images TEXT[],
  amenities TEXT[],
  location JSONB,
  availability JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKINGS / RESERVATIONS
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  guest_count INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  total_price DECIMAL(15,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  special_requests TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  payment_method TEXT, -- wave, orange_money, mtn, card, cash
  payment_reference TEXT,
  status payment_status DEFAULT 'pending',
  provider_response JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ITINERARIES (User trip plans)
CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(15,2),
  travelers INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft', -- draft, confirmed, completed, cancelled
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ITINERARY ITEMS (Days and activities)
CREATE TABLE public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  activity_name TEXT,
  activity_type TEXT,
  time TIME,
  duration INTEGER, -- minutes
  price DECIMAL(15,2),
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAVORITES
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MESSAGES (Partner communication)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADMIN LOGS
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI CONVERSATIONS
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI MESSAGES
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_city ON public.users(city);

-- Partners
CREATE INDEX idx_partners_city ON public.partners(city);
CREATE INDEX idx_partners_category ON public.partners(category);
CREATE INDEX idx_partners_verified ON public.partners(verified);
CREATE INDEX idx_partners_rating ON public.partners(rating);

-- Destinations
CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_destinations_region ON public.destinations(region);
CREATE INDEX idx_destinations_featured ON public.destinations(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_destinations_active ON public.destinations(is_active) WHERE is_active = TRUE;

-- Services
CREATE INDEX idx_services_partner_id ON public.services(partner_id);
CREATE INDEX idx_services_destination_id ON public.services(destination_id);
CREATE INDEX idx_services_type ON public.services(type);
CREATE INDEX idx_services_status ON public.services(status);
CREATE INDEX idx_services_price ON public.services(price);
CREATE INDEX idx_services_rating ON public.services(rating);
CREATE INDEX idx_services_active ON public.services(status) WHERE status = 'active';

-- Bookings
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX idx_bookings_partner_id ON public.bookings(partner_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);

-- Payments
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Itineraries
CREATE INDEX idx_itineraries_user_id ON public.itineraries(user_id);
CREATE INDEX idx_itineraries_status ON public.itineraries(status);
CREATE INDEX idx_itineraries_dates ON public.itineraries(start_date, end_date);

-- Itinerary Items
CREATE INDEX idx_itinerary_items_itinerary_id ON public.itinerary_items(itinerary_id);
CREATE INDEX idx_itinerary_items_date ON public.itinerary_items(date);

-- Favorites
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_service_id ON public.favorites(service_id);

-- Reviews
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_service_id ON public.reviews(service_id);
CREATE INDEX idx_reviews_partner_id ON public.reviews(partner_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_visible ON public.reviews(is_visible) WHERE is_visible = TRUE;

-- Messages
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_read ON public.notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Admin Logs
CREATE INDEX idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON public.admin_logs(action);
CREATE INDEX idx_admin_logs_entity ON public.admin_logs(entity_type, entity_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at);

-- AI
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON public.ai_messages(created_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- USERS RLS
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PROFILES RLS
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- PARTNERS RLS
CREATE POLICY "Partners can view own profile" ON public.partners
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Partners can update own profile" ON public.partners
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all partners" ON public.partners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view verified partners" ON public.partners
  FOR SELECT USING (verified = TRUE);

-- DESTINATIONS RLS
CREATE POLICY "Public can view active destinations" ON public.destinations
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage destinations" ON public.destinations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SERVICES RLS
CREATE POLICY "Partners can view own services" ON public.services
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Partners can manage own services" ON public.services
  FOR ALL USING (partner_id = auth.uid());

CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage all services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- BOOKINGS RLS
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Partners can view own bookings" ON public.bookings
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partners can update booking status" ON public.bookings
  FOR UPDATE USING (partner_id = auth.uid());

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PAYMENTS RLS
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ITINERARIES RLS
CREATE POLICY "Users can view own itineraries" ON public.itineraries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own itineraries" ON public.itineraries
  FOR ALL USING (user_id = auth.uid());

-- ITINERARY ITEMS RLS
CREATE POLICY "Users can view own itinerary items" ON public.itinerary_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own itinerary items" ON public.itinerary_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND user_id = auth.uid()
    )
  );

-- FAVORITES RLS
CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (user_id = auth.uid());

-- REVIEWS RLS
CREATE POLICY "Users can view all reviews" ON public.reviews
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Users can create own reviews" ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Partners can view own reviews" ON public.reviews
  FOR SELECT USING (partner_id = auth.uid());

-- MESSAGES RLS
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can create messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- NOTIFICATIONS RLS
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ADMIN LOGS RLS
CREATE POLICY "Admins can view all logs" ON public.admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create logs" ON public.admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- AI CONVERSATIONS RLS
CREATE POLICY "Users can view own conversations" ON public.ai_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own conversations" ON public.ai_conversations
  FOR ALL USING (user_id = auth.uid());

-- AI MESSAGES RLS
CREATE POLICY "Users can view own messages" ON public.ai_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages" ON public.ai_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_items_updated_at BEFORE UPDATE ON public.itinerary_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update service booking count
CREATE OR REPLACE FUNCTION update_service_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.services SET current_bookings = current_bookings + 1 WHERE id = NEW.service_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.services SET current_bookings = current_bookings - 1 WHERE id = OLD.service_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_booking_count_trigger
  AFTER INSERT OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_service_booking_count();

-- Update partner stats
CREATE OR REPLACE FUNCTION update_partner_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.partners 
    SET completed_bookings = completed_bookings + 1,
        revenue = revenue + NEW.total_price
    WHERE id = NEW.partner_id AND NEW.status = 'completed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_stats_trigger
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_partner_stats();

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND role = 'admin');
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is partner
CREATE OR REPLACE FUNCTION is_partner(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND role = 'partner');
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================
-- INITIAL DATA
-- ============================================================

-- Insert sample destinations
INSERT INTO public.destinations (name, slug, description, region, country, highlights, best_season, budget_level, is_featured) VALUES
('Assinie', 'assinie', 'Station balnéaire populaire avec ses lagunes et plages', 'Sud-Est', 'Côte d''Ivoire', ARRAY['Lagune d''Assinie', 'Plages de Monogaga', 'Fruits de mer', 'Pêche'], 'Novembre à mars', 'moderate', TRUE),
('Grand-Bassam', 'grand-bassam', 'Ancienne capitale coloniale classée UNESCO', 'Sud-Comoe', 'Côte d''Ivoire', ARRAY['Quartier colonial', 'Cathédrale', 'Musée national', 'Architecture historique'], 'Toute l''année', 'low', TRUE),
('Yamoussoukro', 'yamoussoukro', 'Capitale politique avec la basilique Notre-Dame de la Paix', 'Lacs', 'Côte d''Ivoire', ARRAY['Basilique Notre-Dame de la Paix', 'Lac aux crocodiles', 'Palais présidentiel'], 'Toute l''année', 'moderate', FALSE),
('Man', 'man', 'Ville de la montagne avec cascades et randonnées', 'Montagnes', 'Côte d''Ivoire', ARRAY['Cascades', 'Mont Tonkoui', 'Randonnée', 'Nature'], 'Novembre à février', 'low', TRUE),
('Bouaké', 'bouake', 'Deuxième ville de Côte d''Ivoire, centre culturel', 'Vallée du Bandama', 'Côte d''Ivoire', ARRAY['Marché central', 'Tissage', 'Artisanat', 'Culture locale'], 'Toute l''année', 'low', FALSE),
('San-Pédro', 'san-pedro', 'Port de pêche et tourisme', 'Bas-Sassandra', 'Côte d''Ivoire', ARRAY['Plages', 'Pêche artisanale', 'Forêt du Banco', 'Parc national Taï'], 'Toute l''année', 'moderate', FALSE);
