-- ============================================================================
-- CRITICAL: Run this entire script in Supabase Dashboard → SQL Editor
-- ============================================================================
-- This script updates your database to support 15-second face verification videos
-- and adds new application fields (emergency contact, additional info, certification)
-- ============================================================================

-- Step 1: Update faces bucket to support 15-second video files (CRITICAL!)
-- ============================================================================
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760,  -- 10MB (15-second videos are ~4-10MB)
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'video/webm']
WHERE id = 'faces';

-- Verify bucket update
SELECT 
  id, 
  name, 
  file_size_limit, 
  allowed_mime_types,
  CASE 
    WHEN file_size_limit >= 10485760 THEN '✓ File size OK'
    ELSE '✗ File size too small'
  END as size_check,
  CASE 
    WHEN 'video/webm' = ANY(allowed_mime_types) THEN '✓ Video MIME type OK'
    ELSE '✗ Missing video/webm'
  END as mime_check
FROM storage.buckets 
WHERE id = 'faces';

-- Step 2: Add emergency contact fields
-- ============================================================================
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Step 3: Add additional information field
-- ============================================================================
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS additional_information TEXT;

-- Step 4: Add certification fields
-- ============================================================================
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS certification_name TEXT,
ADD COLUMN IF NOT EXISTS certification_property_address TEXT,
ADD COLUMN IF NOT EXISTS certification_agreed BOOLEAN DEFAULT FALSE;

-- Step 5: Add helpful comments for documentation
-- ============================================================================
COMMENT ON COLUMN public.applications.emergency_contact_name IS 'Emergency contact person full name';
COMMENT ON COLUMN public.applications.emergency_contact_phone IS 'Emergency contact phone number';
COMMENT ON COLUMN public.applications.emergency_contact_relationship IS 'Relationship to applicant';
COMMENT ON COLUMN public.applications.additional_information IS 'Any additional information provided by applicant';
COMMENT ON COLUMN public.applications.certification_name IS 'Applicant full legal name for certification';
COMMENT ON COLUMN public.applications.certification_property_address IS 'Property address being applied for in certification';
COMMENT ON COLUMN public.applications.certification_agreed IS 'Whether applicant agreed to certification statement';

-- Step 6: Verify all changes
-- ============================================================================
SELECT 
  '✓ Storage bucket updated for 15-second videos' as status
WHERE EXISTS (
  SELECT 1 FROM storage.buckets 
  WHERE id = 'faces' 
  AND file_size_limit >= 10485760 
  AND 'video/webm' = ANY(allowed_mime_types)
)
UNION ALL
SELECT 
  '✓ Emergency contact fields added' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'applications' 
  AND column_name = 'emergency_contact_name'
)
UNION ALL
SELECT 
  '✓ Additional information field added' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'applications' 
  AND column_name = 'additional_information'
)
UNION ALL
SELECT 
  '✓ Certification fields added' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'applications' 
  AND column_name = 'certification_agreed'
);

-- ============================================================================
-- SUCCESS! If you see 4 checkmarks above, everything is configured correctly.
-- ============================================================================
