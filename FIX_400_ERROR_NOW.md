# 🚨 CRITICAL DEPLOYMENT STEPS - 15-Second Video Support

## ⚠️ Current Status
The 400 error you're seeing happens because:
1. ✅ Frontend code is already updated (uploads to Storage)
2. ✅ Edge Function is now deployed (handles video URLs)
3. ❌ **Storage bucket needs manual SQL update** (CRITICAL!)

---

## 🔴 IMMEDIATE ACTION REQUIRED

### **Step 1: Update Storage Bucket Configuration** (CRITICAL)

The faces bucket needs to support larger video files (15-second videos = 4-10MB).

#### **Option A: Via Supabase Dashboard (RECOMMENDED)**

1. **Go to:** https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms/sql/new
2. **Copy and paste** this SQL:

```sql
-- Update faces bucket to support 15-second video files
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760,  -- 10MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'video/webm']
WHERE id = 'faces';

-- Verify the update
SELECT id, name, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'faces';
```

3. **Click "Run"**
4. **Verify** the output shows:
   - `file_size_limit`: 10485760
   - `allowed_mime_types`: {image/jpeg, image/png, video/webm}

#### **Option B: Via Supabase CLI** (If you prefer)

```bash
# Save the SQL file we created
# Then push it to your database
npx supabase db execute --file APPLY_THIS_SQL.sql
```

---

## ✅ Deployment Checklist

### **Backend (Supabase)**
- [x] Edge Function deployed ✅ (Just completed)
- [ ] **Storage bucket updated** ⚠️ (DO THIS NOW - Step 1 above)
- [ ] Additional application fields migration applied

### **Frontend**
- [x] Code changes committed and pushed to GitHub ✅
- [ ] Vercel/Hosting platform rebuilt (should auto-trigger)

---

## 🧪 Testing Steps (After Storage Update)

1. **Navigate to your application:**
   - https://your-app-url.com

2. **Complete the rental form:**
   - Fill in all 5 steps
   - Upload ID documents

3. **Test 15-second video recording:**
   - Click "Start Recording"
   - Follow 4 head movements:
     - Turn Left (3.75s)
     - Turn Right (3.75s)
     - Look Up (3.75s)
     - Look Down (3.75s)
   - Wait for full 15 seconds

4. **Verify successful submission:**
   - ✅ Video uploads to Storage (check browser Network tab)
   - ✅ No 400 error
   - ✅ Redirects to payment page
   - ✅ Application saved in database

5. **Check Supabase Storage:**
   - Go to: https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms/storage/buckets/faces
   - Verify video file appears (should be 4-10MB)

---

## 🔍 Troubleshooting

### **If you still get 400 error:**

1. **Check browser console** for detailed error:
   - Press F12 → Console tab
   - Look for specific error message

2. **Verify Storage bucket update:**
   ```sql
   SELECT file_size_limit, allowed_mime_types 
   FROM storage.buckets 
   WHERE id = 'faces';
   ```
   - Should show: `10485760` and `{image/jpeg, image/png, video/webm}`

3. **Check Edge Function logs:**
   - Go to: https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms/functions/submit-application/logs
   - Look for error messages

4. **Verify upload to Storage:**
   - Open browser DevTools → Network tab
   - Filter by "faces"
   - Should see successful POST to storage API (200 status)

### **If video upload fails:**

Check error message in console:
- **"File size exceeds limit"** → Storage bucket not updated (do Step 1)
- **"Invalid file type"** → MIME type not allowed (do Step 1)
- **"Permission denied"** → RLS policy issue (check storage policies)

---

## 📊 What Each Component Does

### **Frontend (FaceCapture.tsx)**
1. Records 15-second video in browser
2. Uploads video to Supabase Storage (`faces` bucket)
3. Gets public URL of uploaded video
4. Sends form data + video URL to Edge Function

### **Edge Function (submit-application)**
1. Receives form data with `faceVideoUrl` field
2. Creates application record in database
3. Stores video URL in `face_image_url` column
4. Returns temp ID for payment

### **Storage Bucket (faces)**
- Must allow `video/webm` MIME type
- Must allow files up to 10MB
- Stores actual video files

---

## 🎯 Expected File Sizes

| Duration | Typical Size | Max Size |
|----------|-------------|----------|
| 7 seconds | 1-3 MB | 5 MB |
| 15 seconds | 3-6 MB | 10 MB |

---

## 📝 Quick Reference

### **Your Project Details:**
- **Project ID:** cmjihhcoxchqtqwkwdms
- **Project URL:** https://cmjihhcoxchqtqwkwdms.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms

### **Important URLs:**
- **SQL Editor:** https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms/sql/new
- **Storage Buckets:** https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms/storage/buckets
- **Edge Functions:** https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms/functions
- **Function Logs:** https://supabase.com/dashboard/project/cmjihhcoxchqtqwkwdms/functions/submit-application/logs

---

## ✅ Success Indicators

After completing Step 1 (Storage update), you should see:

1. ✅ **No 400 error** when submitting application
2. ✅ **Video file appears** in Storage → faces bucket
3. ✅ **Application record created** with `face_image_url` populated
4. ✅ **Redirect to payment page** works correctly
5. ✅ **Console shows** "Uploading face verification video..." → "Submitting application..." → "Application submitted!"

---

## 🚀 Summary

**What's Working:**
- ✅ Frontend code (uploads to Storage instead of base64)
- ✅ Edge Function (handles video URLs)

**What Needs Your Action:**
- ⚠️ **Run the SQL update** (Step 1 above) - Takes 30 seconds

Once you complete Step 1, the entire system will work perfectly with 15-second videos! 🎉

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console (F12 → Console)
2. Check Edge Function logs
3. Verify Storage bucket settings
4. Check Network tab for upload status

**Common issues are usually:**
- Storage bucket not updated (Step 1)
- MIME type not allowed
- File size too large
