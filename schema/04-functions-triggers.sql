-- ============================================================================
-- FUNCTIONS AND TRIGGERS - Rental Application System
-- ============================================================================
-- Creates database functions and triggers
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;

-- Create trigger for applications table
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
