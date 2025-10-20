# Video Upload Fix - Deployment Instructions

## What Was Fixed
The 400 error occurred because the 7-second video was being converted to base64, creating a payload too large for Supabase Edge Functions (which have a ~2MB request limit). 

The fix:
1. ✅ Upload videos directly to Supabase Storage (faces bucket)
2. ✅ Pass only the video URL to the Edge Function (not the video data)
3. ✅ Updated Edge Function to handle both video URLs and legacy base64 images
4. ✅ Increased faces bucket size limit to 10MB
5. ✅ Added video/webm to allowed MIME types

## Files Changed
- `src/pages/FaceCapture.tsx` - Now uploads to Storage before submitting
- `supabase/functions/submit-application/index.ts` - Handles video URLs
- `supabase/migrations/20251020000000_update_faces_bucket_for_video.sql` - Updates bucket config

## Deployment Steps

### Step 1: Apply Database Migration
Run this migration to update the faces bucket configuration:

```bash
# Navigate to project directory
cd "c:\Users\RITCHIETECH\Downloads\RITCHIETECH\Projects\face-rent-flow-main"

# Login to Supabase (if not already logged in)
npx supabase login

# Link to your project (replace with your actual project ref)
npx supabase link --project-ref YOUR_PROJECT_REF_ID

# Push the migration to your database
npx supabase db push
```

**Alternative: Manual SQL Execution**
If you prefer, you can run this SQL directly in your Supabase Dashboard → SQL Editor:

```sql
-- Update faces bucket to allow video files and increase file size limit
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'video/webm']
WHERE id = 'faces';
```

### Step 2: Deploy Edge Function
Deploy the updated submit-application Edge Function:

```bash
# Deploy the Edge Function
npx supabase functions deploy submit-application
```

### Step 3: Rebuild and Deploy Frontend
If using Vercel or another hosting platform:

```bash
# The changes are already pushed to GitHub
# Trigger a new deployment on your hosting platform
# Or build locally:
npm run build
```

### Step 4: Test the Application
1. Navigate to your application
2. Fill out the rental application form
3. Record a 7-second face verification video
4. Submit the application
5. Verify that:
   - Video uploads to Supabase Storage
   - Application submits successfully (no 400 error)
   - Payment page loads correctly

## Verification Checklist
- [ ] Migration applied successfully
- [ ] Edge Function deployed
- [ ] Frontend redeployed
- [ ] Test video recording works
- [ ] Test video submission works (no 400 error)
- [ ] Video appears in Supabase Storage → faces bucket
- [ ] Application record has face_image_url populated

## Troubleshooting

### If you get "Project not linked" error:
```bash
# Get your project ref from Supabase Dashboard → Settings → General
npx supabase link --project-ref YOUR_PROJECT_REF_ID
```

### If you get permission errors on storage:
Check that your RLS policies allow the service role to upload to the faces bucket (already configured in the initial migration).

### If video still fails to upload:
1. Check browser console for specific error messages
2. Verify the faces bucket exists in Supabase Dashboard → Storage
3. Check bucket settings allow video/webm and 10MB file size

## What Changed in the Code

### FaceCapture.tsx
**Before:** Converted video to base64, sent in request body
```typescript
const reader = new FileReader();
reader.readAsDataURL(recordedVideo);
formData.faceImage = reader.result; // Large base64 string
```

**After:** Upload to Storage first, send only URL
```typescript
const { data: uploadData } = await supabase.storage
  .from('faces')
  .upload(fileName, recordedVideo, {
    contentType: 'video/webm'
  });

const { data: { publicUrl } } = supabase.storage
  .from('faces')
  .getPublicUrl(fileName);

formData.faceVideoUrl = publicUrl; // Just a URL string
```

### Edge Function
**Before:** Only handled base64 faceImage
**After:** Handles both faceVideoUrl (priority) and legacy faceImage

## Support
If you encounter any issues during deployment, check:
1. Supabase Dashboard logs
2. Edge Function logs
3. Browser console errors
4. Network tab in DevTools

All changes have been committed and pushed to GitHub.
