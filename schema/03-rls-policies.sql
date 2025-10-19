-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - Rental Application System
-- ============================================================================
-- Sets up RLS policies for database tables
-- ============================================================================

-- Enable RLS on tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Service role has full access to applications" ON public.applications;
DROP POLICY IF EXISTS "Service role has full access to payment_events" ON public.payment_events;

-- Create policies for applications table
CREATE POLICY "Service role has full access to applications"
  ON public.applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for payment_events table
CREATE POLICY "Service role has full access to payment_events"
  ON public.payment_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.applications TO anon, authenticated, service_role;
GRANT ALL ON public.payment_events TO anon, authenticated, service_role;
