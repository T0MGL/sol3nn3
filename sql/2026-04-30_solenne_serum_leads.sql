-- =====================================================================
-- SOLENNE: Serum Pestañas Lead Capture (BIOAQUA test)
-- Target: Supabase project qapqhhyfzmgkvzvtoluq (shared with NOCTE)
-- Run in: Supabase SQL Editor
--   https://supabase.com/dashboard/project/qapqhhyfzmgkvzvtoluq/sql/new
-- Date: 2026-04-30
--
-- Scope:
--   Demand validation table for the eyelash growth serum SKU.
--   This product does NOT route through Ordefy yet. The landing captures
--   intent (name, phone, city, pack) and redirects to Sofia on WhatsApp.
--   When demand is validated and we move to the full Ordefy funnel,
--   data is migrated forward. Until then this table is the source of
--   truth for serum leads.
-- =====================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS solenne_serum_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  full_name       TEXT NOT NULL,
  phone_e164      TEXT NOT NULL,
  city            TEXT,

  pack_variant    TEXT NOT NULL
                  CHECK (pack_variant IN ('single', 'duo', 'trio')),
  qty             INT  NOT NULL CHECK (qty > 0),
  unit_price_pyg  INT  NOT NULL CHECK (unit_price_pyg > 0),
  total_price_pyg INT  NOT NULL CHECK (total_price_pyg > 0),

  status          TEXT NOT NULL DEFAULT 'whatsapp_redirect'
                  CHECK (status IN (
                    'whatsapp_redirect',
                    'sofia_contacted',
                    'closed_won',
                    'closed_lost'
                  )),

  source          TEXT NOT NULL DEFAULT 'organic',
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  utm_content     TEXT,
  utm_term        TEXT,

  fbp             TEXT,
  fbc             TEXT,
  fbclid          TEXT,
  user_agent      TEXT,
  referrer        TEXT,
  ip_hash         TEXT,

  notes           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solenne_serum_leads_phone
  ON solenne_serum_leads(phone_e164);

CREATE INDEX IF NOT EXISTS idx_solenne_serum_leads_created
  ON solenne_serum_leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_solenne_serum_leads_status
  ON solenne_serum_leads(status);

CREATE INDEX IF NOT EXISTS idx_solenne_serum_leads_utm_campaign
  ON solenne_serum_leads(utm_campaign)
  WHERE utm_campaign IS NOT NULL;

ALTER TABLE solenne_serum_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON solenne_serum_leads;
CREATE POLICY "Service role full access"
  ON solenne_serum_leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_solenne_serum_leads_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_solenne_serum_leads_updated_at
  ON solenne_serum_leads;

CREATE TRIGGER trg_solenne_serum_leads_updated_at
  BEFORE UPDATE ON solenne_serum_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_solenne_serum_leads_updated_at();

COMMIT;
