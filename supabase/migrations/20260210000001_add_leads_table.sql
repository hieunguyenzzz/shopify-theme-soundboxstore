-- Create leads table for quote form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  postcode TEXT,
  form_id TEXT,
  source_channel TEXT,
  gclid TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  landing_page TEXT,
  page_path TEXT,
  referrer TEXT,
  quote_session_id TEXT,
  submitted_at TIMESTAMPTZ,
  website TEXT
);

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Create index on source_channel for analytics
CREATE INDEX IF NOT EXISTS idx_leads_source_channel ON leads(source_channel);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (Edge Function uses anon key for CORS)
CREATE POLICY "Allow anonymous insert" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON leads
  FOR ALL TO service_role
  USING (true);

-- Add comment
COMMENT ON TABLE leads IS 'Quote form submissions from soundboxstore.com';
