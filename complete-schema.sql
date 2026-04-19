-- ══════════════════════════════════════════════════════════
-- MONARC PRIVÉ — COMPLETE DATABASE SCHEMA v2.0
-- Run this entire file in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════════════════
-- CORE TABLES
-- ══════════════════════════════════════════════════════════

-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'guest' CHECK (role IN ('guest','host','concierge','admin','owner')),
  verified BOOLEAN DEFAULT false,
  id_verified BOOLEAN DEFAULT false,
  questionnaire_answers JSONB,
  travel_preferences JSONB,
  preferred_locations TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Memberships
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  email TEXT NOT NULL,
  name TEXT,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT DEFAULT 'curated' CHECK (tier IN ('curated','private','founding')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','expired','cancelled','paused')),
  amount_paid NUMERIC DEFAULT 300,
  questionnaire_answers JSONB,
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  referral_code TEXT UNIQUE DEFAULT upper(substr(md5(random()::text),1,8)),
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Properties (curated by Monarc Privé admin)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT,
  description TEXT,
  short_description TEXT,
  property_type TEXT DEFAULT 'villa',
  nightly_rate NUMERIC NOT NULL,
  cleaning_fee NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 0,
  min_nights INTEGER DEFAULT 2,
  max_guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC NOT NULL,
  event_friendly BOOLEAN DEFAULT false,
  max_event_guests INTEGER,
  pet_friendly BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','paused','archived')),
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  featured_order INTEGER,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Property Amenities
CREATE TABLE property_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category TEXT,
  name TEXT NOT NULL,
  UNIQUE(property_id, name)
);

-- Property Media
CREATE TABLE property_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image' CHECK (type IN ('image','video')),
  is_hero BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property Availability
CREATE TABLE property_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  rate_override NUMERIC,
  note TEXT,
  UNIQUE(property_id, date)
);

-- Saved Properties (favorites)
CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE DEFAULT 'MP-' || upper(substr(md5(random()::text),1,8)),
  property_id UUID REFERENCES properties(id),
  guest_id UUID REFERENCES profiles(id),
  host_id UUID REFERENCES profiles(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER NOT NULL,
  trip_type TEXT DEFAULT 'stay' CHECK (trip_type IN ('stay','event','stay_event')),
  reason_for_stay TEXT,
  special_requests TEXT,
  nightly_rate NUMERIC NOT NULL,
  num_nights INTEGER NOT NULL,
  subtotal NUMERIC NOT NULL,
  cleaning_fee NUMERIC DEFAULT 0,
  service_fee NUMERIC DEFAULT 0,   -- 3% from guest
  host_fee NUMERIC DEFAULT 0,      -- 3% from host
  event_fee NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','under_review','info_needed','approved','declined','payment_pending','confirmed','checked_in','checked_out','cancelled','dispute')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','deposit_paid','paid','refunded','partial_refund')),
  stripe_payment_intent_id TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Concierge Requests
CREATE TABLE concierge_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  guest_id UUID REFERENCES profiles(id),
  service_type TEXT NOT NULL,
  description TEXT,
  requested_date DATE,
  requested_time TEXT,
  num_guests INTEGER,
  special_notes TEXT,
  estimated_cost NUMERIC,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested','quoted','approved','in_progress','completed','cancelled')),
  assigned_vendor TEXT,
  vendor_contact TEXT,
  final_cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  thread_type TEXT DEFAULT 'guest_host' CHECK (thread_type IN ('guest_host','guest_concierge','host_admin','system')),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  reviewer_id UUID REFERENCES profiles(id),
  reviewee_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  reviewer_type TEXT CHECK (reviewer_type IN ('guest','host')),
  rating NUMERIC CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  private_feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','flagged','removed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_type TEXT CHECK (payment_type IN ('deposit','full_payment','concierge','security_deposit','refund','membership','subscription')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','succeeded','failed','refunded','disputed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Host Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES profiles(id),
  booking_id UUID REFERENCES bookings(id),
  amount NUMERIC NOT NULL,
  platform_fee NUMERIC,
  net_amount NUMERIC NOT NULL,
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed')),
  payout_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Notes
CREATE TABLE admin_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  entity_type TEXT CHECK (entity_type IN ('booking','user','property','concierge_request','listing','dispute')),
  entity_id UUID,
  note TEXT NOT NULL,
  flag_level TEXT DEFAULT 'info' CHECK (flag_level IN ('info','warning','urgent')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification Logs
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('push','email','sms','in_app')),
  title TEXT,
  body TEXT,
  sent BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- PARTNER TABLES
-- ══════════════════════════════════════════════════════════

-- Host Property Listings (from partner hub $25/mo)
CREATE TABLE host_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE DEFAULT 'MP-H-' || upper(substr(md5(random()::text),1,8)),
  host_name TEXT NOT NULL,
  host_email TEXT NOT NULL,
  host_phone TEXT,
  property_title TEXT NOT NULL,
  area TEXT NOT NULL,
  nightly_rate NUMERIC NOT NULL,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  max_guests INTEGER,
  cleaning_fee NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 0,
  description TEXT,
  amenities TEXT[],
  event_ready BOOLEAN DEFAULT false,
  pet_friendly BOOLEAN DEFAULT false,
  check_in_time TEXT DEFAULT '4:00 PM',
  check_out_time TEXT DEFAULT '11:00 AM',
  min_nights INTEGER DEFAULT 2,
  additional_rules TEXT,
  photos JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','paused','rejected','cancelled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_fee NUMERIC DEFAULT 25,
  subscription_status TEXT DEFAULT 'pending',
  next_billing_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agent Listings ($50/mo)
CREATE TABLE agent_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE DEFAULT 'MP-A-' || upper(substr(md5(random()::text),1,8)),
  agent_name TEXT NOT NULL,
  agent_title TEXT,
  agency TEXT NOT NULL,
  years_experience INTEGER,
  career_sales_volume TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  bio TEXT,
  headshot_url TEXT,
  areas_served TEXT[],
  specialties TEXT[],
  license_number TEXT,
  license_state TEXT DEFAULT 'Arizona',
  badge TEXT DEFAULT 'Partner',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','paused','rejected','cancelled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_fee NUMERIC DEFAULT 50,
  subscription_status TEXT DEFAULT 'pending',
  next_billing_date DATE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experience Listings ($100/mo)
CREATE TABLE experience_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE DEFAULT 'MP-E-' || upper(substr(md5(random()::text),1,8)),
  experience_name TEXT NOT NULL,
  category TEXT NOT NULL,
  host_business TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT NOT NULL,
  starting_price NUMERIC NOT NULL,
  price_per TEXT DEFAULT 'person',
  duration TEXT,
  group_min INTEGER DEFAULT 1,
  group_max INTEGER,
  description TEXT,
  tags TEXT[],
  photos JSONB DEFAULT '[]',
  business_license TEXT,
  insurance_provider TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','paused','rejected','cancelled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_fee NUMERIC DEFAULT 100,
  subscription_status TEXT DEFAULT 'pending',
  next_billing_date DATE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Partner Revenue Tracking
CREATE TABLE partner_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_type TEXT CHECK (partner_type IN ('property','agent','experience','membership')),
  partner_id UUID,
  revenue_type TEXT CHECK (revenue_type IN ('monthly_fee','booking_guest_fee','booking_host_fee','membership_fee')),
  amount NUMERIC NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  stripe_payment_id TEXT,
  description TEXT,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- AI AGENT TABLES
-- ══════════════════════════════════════════════════════════

CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  user_id TEXT,
  messages JSONB,
  response TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  user_id TEXT,
  content TEXT NOT NULL,
  week_of DATE,
  is_scheduled BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE concierge_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT,
  booking_id TEXT,
  message TEXT,
  response TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════

CREATE INDEX idx_memberships_email ON memberships(email);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_expires ON memberships(expires_at);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_checkin ON bookings(check_in);
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, read);
CREATE INDEX idx_properties_status ON properties(status, featured_order);
CREATE INDEX idx_saved_user ON saved_properties(user_id);
CREATE INDEX idx_host_listings_status ON host_listings(status);
CREATE INDEX idx_host_listings_email ON host_listings(host_email);
CREATE INDEX idx_agent_listings_status ON agent_listings(status);
CREATE INDEX idx_experience_listings_status ON experience_listings(status);
CREATE INDEX idx_experience_listings_category ON experience_listings(category);
CREATE INDEX idx_partner_revenue ON partner_revenue(partner_type, revenue_type);
CREATE INDEX idx_weekly_reports ON weekly_reports(agent_id, week_of);

-- ══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own data
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties: public can read active
CREATE POLICY "Public reads active properties" ON properties FOR SELECT USING (status = 'active');

-- Memberships: users see own
CREATE POLICY "Users view own membership" ON memberships FOR SELECT USING (auth.uid() = user_id);

-- Bookings: guests and hosts see own
CREATE POLICY "Users view own bookings" ON bookings FOR SELECT USING (auth.uid() = guest_id OR auth.uid() = host_id);
CREATE POLICY "Guests create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Messages: sender and recipient
CREATE POLICY "Users view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Saved properties: own only
CREATE POLICY "Users manage saved" ON saved_properties FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ══════════════════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER upd_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER upd_properties BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER upd_bookings BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER upd_host_listings BEFORE UPDATE ON host_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER upd_agent_listings BEFORE UPDATE ON agent_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER upd_experience_listings BEFORE UPDATE ON experience_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Log booking fees when confirmed
CREATE OR REPLACE FUNCTION log_booking_fees()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    INSERT INTO partner_revenue (partner_type, revenue_type, amount, booking_id, description)
    VALUES ('property', 'booking_guest_fee', NEW.total * 0.03, NEW.id, '3% guest booking fee');
    INSERT INTO partner_revenue (partner_type, revenue_type, amount, booking_id, description)
    VALUES ('property', 'booking_host_fee', NEW.total * 0.03, NEW.id, '3% host payout fee');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_fee_trigger AFTER UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION log_booking_fees();

-- ══════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ══════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public) VALUES
  ('property-images', 'property-images', true),
  ('member-avatars', 'member-avatars', false),
  ('host-documents', 'host-documents', false),
  ('experience-photos', 'experience-photos', true),
  ('agent-headshots', 'agent-headshots', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public reads property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Public reads experience photos" ON storage.objects FOR SELECT USING (bucket_id = 'experience-photos');
CREATE POLICY "Public reads agent headshots" ON storage.objects FOR SELECT USING (bucket_id = 'agent-headshots');
CREATE POLICY "Auth users upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ══════════════════════════════════════════════════════════
-- SEED DATA — 6 INITIAL PROPERTIES
-- ══════════════════════════════════════════════════════════

INSERT INTO properties (name, area, nightly_rate, max_guests, bedrooms, bathrooms, event_friendly, pet_friendly, badge, status, featured, featured_order, short_description)
VALUES
  ('Casa del Cielo', 'Paradise Valley', 2800, 14, 6, 7, true, false, 'Curated Pick', 'active', true, 1, 'A masterpiece of desert modernism perched above Paradise Valley with infinity pool and spa.'),
  ('The Ironwood Estate', 'North Scottsdale', 4200, 20, 8, 9, true, true, 'Event-Ready', 'active', true, 2, 'Seven acres of gated desert sanctuary with resort-scale pool, private theater, and chef''s kitchen.'),
  ('Hacienda Serena', 'Scottsdale', 1650, 8, 4, 4.5, false, true, 'Guest Favorite', 'active', true, 3, 'Adobe sanctuary with infrared sauna, plunge pool, Tonal gym, and mountain serenity.'),
  ('Monolith Modern', 'Paradise Valley', 3500, 10, 5, 6, true, false, 'New Arrival', 'active', true, 4, 'An architectural statement — black steel, white plaster, infinity pool into the mountain.'),
  ('The Camelback Retreat', 'Paradise Valley', 5800, 22, 9, 10, true, true, 'Curated Pick', 'active', true, 5, 'Three private acres below Camelback Mountain — two pools, spa pavilion, 11-seat screening room.'),
  ('Desert Glass House', 'North Scottsdale', 2100, 8, 4, 5, false, true, 'Guest Favorite', 'active', true, 6, 'A glass-and-steel pavilion nearly invisible from the road, dissolving into Sonoran sky.');

-- ══════════════════════════════════════════════════════════
-- REVENUE DASHBOARD VIEW
-- ══════════════════════════════════════════════════════════

CREATE VIEW platform_revenue_summary AS
SELECT
  (SELECT COUNT(*) FROM memberships WHERE status = 'active') AS active_members,
  (SELECT COUNT(*) FROM memberships WHERE status = 'active') * 25 AS membership_mrr,
  (SELECT COUNT(*) FROM host_listings WHERE status = 'active') AS active_host_listings,
  (SELECT COUNT(*) FROM host_listings WHERE status = 'active') * 25 AS host_listing_mrr,
  (SELECT COUNT(*) FROM agent_listings WHERE status = 'active') AS active_agent_listings,
  (SELECT COUNT(*) FROM agent_listings WHERE status = 'active') * 50 AS agent_listing_mrr,
  (SELECT COUNT(*) FROM experience_listings WHERE status = 'active') AS active_experience_listings,
  (SELECT COUNT(*) FROM experience_listings WHERE status = 'active') * 100 AS experience_listing_mrr,
  (SELECT COUNT(*) FROM host_listings WHERE status = 'pending') AS pending_property_reviews,
  (SELECT COUNT(*) FROM agent_listings WHERE status = 'pending') AS pending_agent_reviews,
  (SELECT COUNT(*) FROM experience_listings WHERE status = 'pending') AS pending_experience_reviews,
  (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') AS confirmed_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'pending') AS pending_bookings,
  (SELECT COALESCE(SUM(amount), 0) FROM partner_revenue WHERE created_at > now() - interval '30 days') AS revenue_last_30_days;
