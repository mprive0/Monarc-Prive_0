-- ============================================================
-- Monarc Privé — Additional Tables for Membership System
-- Add these to your existing supabase/schema.sql
-- ============================================================

-- ── MEMBERSHIPS ───────────────────────────────────────────────
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  email TEXT NOT NULL,
  name TEXT,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT DEFAULT 'curated' CHECK (tier IN ('curated', 'private', 'founding')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'paused')),
  amount_paid NUMERIC DEFAULT 300,
  questionnaire_answers JSONB,
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  referral_code TEXT UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 8)),
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_memberships_email ON memberships(email);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_expires ON memberships(expires_at);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Users can only see their own membership
CREATE POLICY "Users can view own membership"
  ON memberships FOR SELECT
  USING (auth.uid() = user_id);

-- ── AUTO-EXPIRE MEMBERSHIPS ───────────────────────────────────
-- Run via pg_cron (daily at midnight)
-- SELECT cron.schedule('expire-memberships', '0 0 * * *',
--   $$ UPDATE memberships SET status = 'expired' WHERE expires_at < now() AND status = 'active' $$
-- );

-- ── MEMBERSHIP ANALYTICS VIEW ─────────────────────────────────
CREATE VIEW membership_analytics AS
SELECT
  COUNT(*) FILTER (WHERE status = 'active') AS active_members,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_members,
  COUNT(*) FILTER (WHERE status = 'expired') AS expired_members,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_members,
  COUNT(*) FILTER (WHERE tier = 'curated') AS curated_tier,
  COUNT(*) FILTER (WHERE tier = 'private') AS private_tier,
  COUNT(*) FILTER (WHERE tier = 'founding') AS founding_tier,
  SUM(amount_paid) FILTER (WHERE status = 'active') AS annual_recurring_revenue,
  AVG(amount_paid) AS avg_membership_value,
  COUNT(*) FILTER (WHERE created_at > now() - interval '30 days') AS new_this_month
FROM memberships;


-- ============================================================
-- EMAIL TEMPLATES (use with SendGrid Dynamic Templates)
-- ============================================================

-- Welcome Email (send immediately after payment)
/*
Subject: Welcome to Monarc Privé, {{first_name}}

Body:
  You're now a member of one of the most exclusive hospitality
  platforms in Scottsdale.

  Your membership details:
  - Reference: {{member_reference}}
  - Tier: {{tier}}
  - Valid through: {{expiry_date}}
  - Member since: {{join_date}}

  What to do next:
  1. Visit monarcprive.com/portal to explore estates
  2. Chat with Sterling, your AI concierge
  3. Browse available dates and request a booking

  Your AI concierge Sterling has been briefed on your preferences
  and is ready to assist 24/7.

  Welcome,
  The Monarc Privé Team
*/

-- Payment Receipt (send immediately after successful charge)
/*
Subject: Payment Confirmation — Monarc Privé Annual Membership

  Receipt #{{stripe_receipt_number}}
  Date: {{date}}
  Amount: $300.00 USD
  Payment method: Card ending in {{last4}}
  Next renewal: {{renewal_date}}

  Your membership is now active. Access your member portal at
  monarcprive.com/portal
*/

-- Renewal Reminder (send 14 days before expiry)
/*
Subject: Your Monarc Privé membership renews in 14 days

  Your annual membership renews on {{renewal_date}}.

  To ensure uninterrupted access to your curated estates
  and Sterling AI concierge, no action is needed if your
  payment method is current.

  To update payment: monarcprive.com/portal/billing
*/

-- Expiry Notice (send on expiry date)
/*
Subject: Your Monarc Privé membership has expired

  Your annual membership expired on {{expiry_date}}.

  Renew now to restore immediate access to all 6 private
  estates and your AI concierge.

  Renew at $300/year: monarcprive.com/membership
*/


-- ============================================================
-- SUPABASE STORAGE BUCKETS
-- ============================================================
-- Run these in SQL editor:

-- INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('member-avatars', 'member-avatars', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies:
-- CREATE POLICY "Public can read property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
-- CREATE POLICY "Members can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'member-avatars' AND auth.role() = 'authenticated');
