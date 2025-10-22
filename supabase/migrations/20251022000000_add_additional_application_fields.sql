-- Add emergency contact, additional information, and certification fields to applications table

-- Emergency Contact fields
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Additional Information field
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS additional_information TEXT;

-- Certification fields
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS certification_name TEXT,
ADD COLUMN IF NOT EXISTS certification_property_address TEXT,
ADD COLUMN IF NOT EXISTS certification_agreed BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN public.applications.emergency_contact_name IS 'Emergency contact person full name';
COMMENT ON COLUMN public.applications.emergency_contact_phone IS 'Emergency contact phone number';
COMMENT ON COLUMN public.applications.emergency_contact_relationship IS 'Relationship to applicant';
COMMENT ON COLUMN public.applications.additional_information IS 'Any additional information provided by applicant';
COMMENT ON COLUMN public.applications.certification_name IS 'Applicant full legal name for certification';
COMMENT ON COLUMN public.applications.certification_property_address IS 'Property address being applied for in certification';
COMMENT ON COLUMN public.applications.certification_agreed IS 'Whether applicant agreed to certification statement';
