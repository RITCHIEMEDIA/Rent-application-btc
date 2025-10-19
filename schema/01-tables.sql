-- ============================================================================
-- TABLE CREATION - Rental Application System
-- ============================================================================
-- Creates the core database tables
-- ============================================================================

-- Create applications table
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

-- Create payment_events table
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  invoice_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_phone ON public.applications(phone);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_payment_status ON public.applications(payment_status);
CREATE INDEX IF NOT EXISTS idx_applications_payment_invoice_id ON public.applications(payment_invoice_id);
CREATE INDEX IF NOT EXISTS idx_applications_temp_id ON public.applications(temp_id);

CREATE INDEX IF NOT EXISTS idx_payment_events_application_id ON public.payment_events(application_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_invoice_id ON public.payment_events(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON public.payment_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type ON public.payment_events(event_type);
