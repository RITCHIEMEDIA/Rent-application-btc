-- CRITICAL: Run this SQL in Supabase Dashboard → SQL Editor
-- This updates the faces bucket to support 15-second video files

-- Update faces bucket configuration
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760,  -- 10MB (15-second video can be 4-10MB)
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'video/webm']
WHERE id = 'faces';

-- Verify the update
SELECT id, name, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'faces';
