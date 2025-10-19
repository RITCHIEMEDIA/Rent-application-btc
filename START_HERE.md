# ⚡ START HERE - Super Simple Setup

## 🎯 **Do This First (Most Important!)**

### **Step 1: Run Database Setup**

1. Open: https://cmjihhcoxchqtqwkwdms.supabase.co
2. Click: **SQL Editor** (left sidebar)
3. Click: **New query**
4. Open file: `schema/complete-database-setup.sql`
5. Copy ALL contents
6. Paste into SQL Editor
7. Click: **Run**
8. Wait for ✅ Success!

**This creates your database tables and storage!**

---

## 🚀 **Step 2: Deploy Functions & Secrets**

### **Option A: Via Supabase Dashboard (Easiest)**

**Set Secrets:**
1. Go to: https://cmjihhcoxchqtqwkwdms.supabase.co
2. Click: **Edge Functions** → **Manage secrets**
3. Add these 3 secrets:

```
Name: BTCPAY_API_KEY
Value: 7fd4c7d53930cf0250328c9648c035312f844a47
```

```
Name: BTCPAY_STORE_ID
Value: 5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
```

```
Name: BTCPAY_URL
Value: https://btcpay.coincharge.io
```

**Deploy Functions:**
1. In Supabase Dashboard → **Edge Functions**
2. Deploy each function from `supabase/functions/` folder

---

### **Option B: Via Command Line**

```powershell
# Login
npx supabase login

# Link project
npx supabase link --project-ref cmjihhcoxchqtqwkwdms

# Deploy functions
npx supabase functions deploy create-payment
npx supabase functions deploy payment-status
npx supabase functions deploy submit-application

# Set secrets
npx supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
npx supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
npx supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io
```

---

## ✅ **Step 3: Test**

```powershell
bun run dev
```

Open: http://localhost:8080

Test the complete flow!

---

## ⚡ **That's It!**

**Your .env is already configured with:**
- ✅ Supabase URL
- ✅ Supabase API Key
- ✅ Project ID

**Just need to:**
1. Run SQL schema (Step 1)
2. Set secrets (Step 2)
3. Test (Step 3)

---

## 📚 **Need More Help?**

- **[MANUAL_SETUP_STEPS.md](./MANUAL_SETUP_STEPS.md)** - Detailed step-by-step
- **[YOUR_SETUP_GUIDE.md](./YOUR_SETUP_GUIDE.md)** - Your personalized guide
- **[SUPABASE_MIGRATION_CHECKLIST.md](./SUPABASE_MIGRATION_CHECKLIST.md)** - Complete checklist

---

**Start with Step 1 NOW!** 🚀
