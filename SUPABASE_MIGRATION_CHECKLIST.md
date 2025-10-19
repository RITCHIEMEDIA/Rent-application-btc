# ✅ Supabase Migration Checklist

## 📋 Pre-Migration

- [ ] Create new Supabase account (or use existing with free project slot)
- [ ] Have BTCPay credentials ready
- [ ] Backup any important data from old Supabase (if needed)

---

## 🎯 Step 1: Create New Project (5 min)

- [ ] Go to https://supabase.com
- [ ] Click "New Project"
- [ ] Project Name: `rental-application` (or your choice)
- [ ] Database Password: ________________ (SAVE THIS!)
- [ ] Region: ________________
- [ ] Click "Create new project"
- [ ] Wait for project initialization (~2 min)

---

## 📝 Step 2: Get Credentials (2 min)

Go to **Settings → API** and copy:

- [ ] **Project URL**: ________________________________
- [ ] **Project Reference ID**: ________________________________
- [ ] **anon/public key**: ________________________________

---

## 🗄️ Step 3: Setup Database (3 min)

- [ ] Go to **SQL Editor** in Supabase dashboard
- [ ] Click **"New query"**
- [ ] Open `schema/complete-database-setup.sql`
- [ ] Copy ALL contents
- [ ] Paste into SQL Editor
- [ ] Click **"Run"** (or Ctrl+Enter)
- [ ] Verify success message appears

**Verify:**
- [ ] Go to **Table Editor** → See `applications` table
- [ ] Go to **Table Editor** → See `payment_events` table
- [ ] Go to **Storage** → See `ids` bucket
- [ ] Go to **Storage** → See `faces` bucket

---

## 🚀 Step 4: Deploy Edge Functions (5 min)

Open PowerShell in project directory:

```powershell
# Install Supabase CLI (if needed)
npm install -g supabase

# Login
supabase login

# Link to NEW project
supabase link --project-ref YOUR_NEW_PROJECT_REF_ID

# Deploy functions
supabase functions deploy create-payment
supabase functions deploy payment-status
supabase functions deploy submit-application
```

**Checklist:**
- [ ] Supabase CLI installed
- [ ] Logged in successfully
- [ ] Project linked
- [ ] `create-payment` deployed ✅
- [ ] `payment-status` deployed ✅
- [ ] `submit-application` deployed ✅

---

## 🔐 Step 5: Configure Secrets (2 min)

```powershell
# Set BTCPay secrets
supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io

# Verify
supabase secrets list
```

**Verify:**
- [ ] BTCPAY_API_KEY set ✅
- [ ] BTCPAY_STORE_ID set ✅
- [ ] BTCPAY_URL set ✅

---

## ⚙️ Step 6: Update .env File (2 min)

Edit `.env` in project root:

```env
VITE_SUPABASE_PROJECT_ID="YOUR_NEW_PROJECT_REF_ID"
VITE_SUPABASE_URL="https://YOUR_NEW_PROJECT_REF_ID.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_NEW_ANON_KEY"
```

**Checklist:**
- [ ] Opened `.env` file
- [ ] Updated `VITE_SUPABASE_PROJECT_ID`
- [ ] Updated `VITE_SUPABASE_URL`
- [ ] Updated `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Saved file

---

## 🧪 Step 7: Test Application (5 min)

```powershell
# Restart dev server
# Press Ctrl+C to stop current server
bun run dev
```

**Test Flow:**
- [ ] App loads at http://localhost:8080
- [ ] Click "Start Application"
- [ ] Fill out Step 1 (Personal Info)
- [ ] Fill out Step 2 (Property & Financial)
- [ ] Upload documents in Step 3
- [ ] Review in Step 4
- [ ] Click "Proceed to Face Capture"
- [ ] Capture face photo
- [ ] Click "Confirm & Submit"
- [ ] Redirects to payment page
- [ ] **Bitcoin address displays** ✅
- [ ] **BTC amount shows** ✅
- [ ] **QR code generated** ✅
- [ ] Timer counting down ✅

---

## ✅ Step 8: Verify Data Persistence

**In Supabase Dashboard:**
- [ ] Go to **Table Editor** → `applications`
- [ ] See your test application entry
- [ ] Check payment_status is 'pending'
- [ ] Go to **Storage** → `faces`
- [ ] See uploaded face image
- [ ] Go to **Storage** → `ids`
- [ ] See uploaded ID images

---

## 🎉 Migration Complete!

Your application is now running on:
- ✅ New Supabase account (independent from Lovable)
- ✅ Complete database with all tables
- ✅ Storage buckets configured
- ✅ Edge functions deployed
- ✅ BTCPay integration working
- ✅ No Lovable usage limits!

---

## 🔧 Troubleshooting

### ❌ "relation does not exist"
**Fix**: Re-run `complete-database-setup.sql`

### ❌ Edge function errors
**Fix**: Redeploy functions and check secrets
```powershell
supabase functions deploy create-payment
supabase secrets list
```

### ❌ No Bitcoin address
**Fix**: 
1. Check BTCPay secrets are set
2. Verify BTCPay store has wallet
3. Check browser console for errors

### ❌ Storage upload fails
**Fix**: Re-run `02-storage.sql` in SQL Editor

---

## 📞 Still Having Issues?

1. Check **Supabase logs**: Dashboard → Logs → Edge Functions
2. Check **browser console**: F12 → Console tab
3. Verify all secrets: `supabase secrets list`
4. Ensure .env has correct values

---

**Estimated Total Time**: 20-25 minutes

**You're all set!** 🚀
