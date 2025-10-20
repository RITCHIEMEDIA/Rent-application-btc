-- Update faces bucket to allow video files and increase file size limit
-- Increase file size limit to 10MB (10485760 bytes) to accommodate video files
-- Add video/webm to allowed MIME types
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'video/webm']
WHERE id = 'faces';
