-- ============================================================================
-- STORAGE BUCKET SETUP - Rental Application System
-- ============================================================================
-- Creates storage buckets and policies for document uploads
-- ============================================================================

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

-- Drop existing storage policies
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
