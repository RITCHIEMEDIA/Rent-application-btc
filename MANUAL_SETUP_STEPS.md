# 🔧 Manual Setup Steps (Simple & Easy)

PowerShell script execution is having issues, so let's do this manually. It's actually very simple!

---

## ✅ **Step 1: Run Database Setup (5 minutes)**

This is the MOST IMPORTANT step!

### **What to do:**

1. **Open your browser** and go to:
   ```
   https://cmjihhcoxchqtqwkwdms.supabase.co
   ```

2. **Click** on **"SQL Editor"** in the left sidebar

3. **Click** the **"New query"** button

4. **Open the file** `schema/complete-database-setup.sql` in your code editor

5. **Copy** the ENTIRE contents (Ctrl+A, Ctrl+C)

6. **Paste** into the Supabase SQL Editor (Ctrl+V)

7. **Click** the **"Run"** button (or press Ctrl+Enter)

8. **Wait** for the success message (should take ~2-5 seconds)

### **What this does:**
- ✅ Creates `applications` table
- ✅ Creates `payment_events` table  
- ✅ Creates storage buckets (`ids`, `faces`)
- ✅ Sets up all security policies
- ✅ Creates database functions

---

## ✅ **Step 2: Install Supabase CLI (One-time)**

### **Option A: Using npm**

Open a NEW PowerShell window and run:

```powershell
npm install -g supabase
```

### **Option B: Using npx (no installation needed)**

You can use `npx` for all commands instead:

```powershell
npx supabase login
npx supabase link --project-ref cmjihhcoxchqtqwkwdms
# etc...
```

---

## ✅ **Step 3: Deploy Edge Functions (5 minutes)**

Run these commands ONE BY ONE in PowerShell:

### **Login to Supabase:**
```powershell
npx supabase login
```
(A browser window will open - login there)

### **Link to your project:**
```powershell
npx supabase link --project-ref cmjihhcoxchqtqwkwdms
```

### **Deploy the 3 functions:**
```powershell
npx supabase functions deploy create-payment
```

```powershell
npx supabase functions deploy payment-status
```

```powershell
npx supabase functions deploy submit-application
```

---

## ✅ **Step 4: Set BTCPay Secrets (2 minutes)**

Run these commands ONE BY ONE:

```powershell
npx supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
```

```powershell
npx supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
```

```powershell
npx supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io
```

### **Verify secrets are set:**
```powershell
npx supabase secrets list
```

You should see:
```
BTCPAY_API_KEY
BTCPAY_STORE_ID
BTCPAY_URL
```

---

## ✅ **Step 5: Test Your Application (2 minutes)**

Start the dev server:

```powershell
bun run dev
```

Then:
1. Open http://localhost:8080
2. Click "Start Application"
3. Fill out the form
4. Upload documents
5. Capture face
6. Check payment page shows Bitcoin address ✅

---

## 🎯 **Quick Verification Checklist**

After Step 1 (Database Setup), verify in Supabase Dashboard:

**Go to Table Editor:**
- [ ] ✅ See `applications` table
- [ ] ✅ See `payment_events` table

**Go to Storage:**
- [ ] ✅ See `ids` bucket
- [ ] ✅ See `faces` bucket

**Go to Database → Functions:**
- [ ] ✅ See `update_updated_at_column` function

---

## 🔧 **Troubleshooting**

### **Issue: npm/npx not recognized**

**Solution 1 - Enable Node.js:**
1. Close ALL PowerShell windows
2. Open a NEW PowerShell window
3. Try again

**Solution 2 - Use full path:**
```powershell
C:\"Program Files"\nodejs\npx.cmd supabase login
```

### **Issue: SQL query fails**

**Common reasons:**
- Didn't copy entire file contents
- SQL already ran successfully (check Table Editor)

**Solution:**
- Copy again, make sure you got EVERYTHING
- Check if tables already exist in Table Editor

### **Issue: Edge function deploy fails**

**Make sure:**
- You're in the correct directory
- You ran `supabase link` first
- You're logged in (`supabase login`)

---

## ⚡ **The Absolute Minimum You MUST Do**

If you're having trouble with CLI, you can still get the app working:

### **MINIMUM SETUP:**

1. **Run SQL in Supabase Dashboard** ⭐ (Step 1 above)
   - This creates all tables and storage
   - This is THE MOST IMPORTANT STEP

2. **Set secrets via Supabase Dashboard:**
   - Go to https://cmjihhcoxchqtqwkwdms.supabase.co
   - Click **Edge Functions** → **Manage secrets**
   - Add these 3 secrets manually:
     - `BTCPAY_API_KEY` = `7fd4c7d53930cf0250328c9648c035312f844a47`
     - `BTCPAY_STORE_ID` = `5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy`
     - `BTCPAY_URL` = `https://btcpay.coincharge.io`

3. **Deploy functions via Dashboard:**
   - Edge Functions → Deploy
   - Upload each function folder manually

**Then test with:** `bun run dev`

---

## 📞 **Still Having Issues?**

**Check these files:**
- ✅ `.env` has correct Supabase URL
- ✅ Tables exist in Supabase Table Editor
- ✅ Storage buckets created
- ✅ Browser console for errors (F12)

**Your .env should have:**
```env
VITE_SUPABASE_PROJECT_ID="cmjihhcoxchqtqwkwdms"
VITE_SUPABASE_URL="https://cmjihhcoxchqtqwkwdms.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtamloaGNveGNocXRxd2t3ZG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTY4MzIsImV4cCI6MjA3NjM5MjgzMn0.FMi5hyXYHLBAT15AZfm3K4S0jDH2Ua4o5xJBKpXpRo0"
```

---

## ✅ **Success = Database Tables Created**

The MOST CRITICAL part is Step 1 (running the SQL schema).

**Once you've done that:**
- Your database is ready
- Tables are created
- Storage is configured
- Security is set up

**Everything else (Edge Functions, Secrets) can be done:**
- Via Supabase Dashboard manually
- Or via CLI when you get it working

---

**Start with Step 1 now!** Open https://cmjihhcoxchqtqwkwdms.supabase.co and run that SQL! 🚀
