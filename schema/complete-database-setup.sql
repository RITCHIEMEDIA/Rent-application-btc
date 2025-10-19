-- ============================================================================
-- COMPLETE DATABASE SETUP FOR RENTAL APPLICATION SYSTEM
-- ============================================================================
-- This script sets up the entire database schema for a new Supabase project
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Create applications table with all required fields including BTCPay payment fields
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temp_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  
  -- Personal information
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address JSONB NOT NULL,
  dob DATE NOT NULL,
  
  -- Application details
  num_applicants INTEGER NOT NULL CHECK (num_applicants >= 1 AND num_applicants <= 10),
  pets INTEGER DEFAULT 0 CHECK (pets >= 0 AND pets <= 10),
  co_applicant TEXT,
  move_in_date DATE,
  
  -- Financial information
  ssn_encrypted TEXT NOT NULL,
  income NUMERIC NOT NULL CHECK (income > 0),
  deposit_amount NUMERIC NOT NULL CHECK (deposit_amount >= 0),
  
  -- Property information
  property_address JSONB NOT NULL,
  owner_rating INTEGER CHECK (owner_rating >= 0 AND owner_rating <= 5),
  
  -- Payment information (BTCPay integration)
  payment_method TEXT DEFAULT 'bitcoin',
  payment_provider TEXT DEFAULT 'coincharge',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired', 'failed')),
  payment_invoice_id TEXT,
  payment_address TEXT,
  payment_txid TEXT,
  payment_amount NUMERIC,
  payment_currency TEXT DEFAULT 'BTC',
  payment_created_at TIMESTAMPTZ,
  payment_expires_at TIMESTAMPTZ,
  payment_confirmed_at TIMESTAMPTZ,
  
  -- Document URLs
  id_front_url TEXT,
  id_back_url TEXT,
  face_image_url TEXT,
  face_thumb_url TEXT,
  
  -- Face recognition data
  face_descriptor JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payment_events table for webhook audit logging
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  invoice_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for applications table
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_phone ON public.applications(phone);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_payment_status ON public.applications(payment_status);
CREATE INDEX IF NOT EXISTS idx_applications_payment_invoice_id ON public.applications(payment_invoice_id);
CREATE INDEX IF NOT EXISTS idx_applications_temp_id ON public.applications(temp_id);

-- Indexes for payment_events table
CREATE INDEX IF NOT EXISTS idx_payment_events_application_id ON public.payment_events(application_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_invoice_id ON public.payment_events(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON public.payment_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type ON public.payment_events(event_type);

-- ============================================================================
-- 3. CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Trigger for applications table
DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. CREATE RLS POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role has full access to applications" ON public.applications;
DROP POLICY IF EXISTS "Service role has full access to payment_events" ON public.payment_events;

-- RLS policies for applications (service role has full access)
CREATE POLICY "Service role has full access to applications"
  ON public.applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS policies for payment_events (service role has full access)
CREATE POLICY "Service role has full access to payment_events"
  ON public.payment_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 6. CREATE STORAGE BUCKETS
-- ============================================================================

-- Note: Storage buckets are created via dashboard or Supabase CLI
-- Here we'll just prepare the SQL for reference

-- Create 'ids' bucket for government ID uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('ids', 'ids', false, 5242880, ARRAY['image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png'];

-- Create 'faces' bucket for face verification images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('faces', 'faces', false, 6291456, ARRAY['image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 6291456,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png'];

-- ============================================================================
-- 7. CREATE STORAGE POLICIES
-- ============================================================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Service role can upload to ids bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role can read from ids bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update ids bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete from ids bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload to faces bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role can read from faces bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update faces bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete from faces bucket" ON storage.objects;

-- Storage policies for 'ids' bucket
CREATE POLICY "Service role can upload to ids bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ids');

CREATE POLICY "Service role can read from ids bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ids');

CREATE POLICY "Service role can update ids bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ids');

CREATE POLICY "Service role can delete from ids bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ids');

-- Storage policies for 'faces' bucket
CREATE POLICY "Service role can upload to faces bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'faces');

CREATE POLICY "Service role can read from faces bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'faces');

CREATE POLICY "Service role can update faces bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'faces');

CREATE POLICY "Service role can delete from faces bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'faces');

-- ============================================================================
-- 8. GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.applications TO anon, authenticated, service_role;
GRANT ALL ON public.payment_events TO anon, authenticated, service_role;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Deploy Edge Functions (create-payment, payment-status, submit-application)
-- 2. Set BTCPay secrets (BTCPAY_API_KEY, BTCPAY_STORE_ID, BTCPAY_URL)
-- 3. Update .env file with new Supabase credentials
-- 4. Test the application
-- ============================================================================
