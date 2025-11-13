# 🔄 Complete Supabase Migration Guide

## Overview
This guide will help you migrate from your current Lovable-linked Supabase account to a new, independent Supabase account.

---

## 📋 **What You'll Need**

1. A new Supabase account (free tier works)
2. Your BTCPay credentials (already have them)
3. About 15-20 minutes

---

## 🎯 **Step-by-Step Migration**

### **Step 1: Create New Supabase Project**

1. Go to https://supabase.com
2. Sign up or log in with a different email (if needed)
3. Click **"New Project"**
4. Fill in details:
   - **Name**: `rental-application` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
5. Click **"Create new project"**
6. Wait ~2 minutes for project to initialize

### **Step 2: Get New Project Credentials**

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API Key** → **anon/public** key
   - **Project Reference ID** (e.g., `xxxxx`)

---

### **Step 3: Run Database Setup**

1. In your new Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New query"**
4. Copy the ENTIRE contents of `schema/complete-database-setup.sql` (I'll create this)
5. Paste into the SQL editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for success message

This will create:
- ✅ `applications` table
- ✅ `payment_events` table
- ✅ All indexes
- ✅ RLS policies
- ✅ Storage buckets (ids, faces)
- ✅ Trigger functions

---

### **Step 4: Deploy Edge Functions**

#### **A. Install Supabase CLI** (if not installed)

```powershell
npm install -g supabase
```

#### **B. Login and Link**

```powershell
# Login to Supabase
supabase login

# Link to your NEW project
supabase link --project-ref YOUR_NEW_PROJECT_REF_ID
```

#### **C. Deploy Functions**

```powershell
# Deploy all edge functions
supabase functions deploy create-payment
supabase functions deploy payment-status
supabase functions deploy submit-application
```

#### **D. Set Secrets**

```powershell
# Set BTCPay credentials
supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io

# Verify
supabase secrets list
```

---

### **Step 5: Update Your .env File**

Edit `.env` file in your project root:

```env
# Replace these with your NEW Supabase project values
VITE_SUPABASE_PROJECT_ID="https://cmjihhcoxchqtqwkwdms.supabase.co"
VITE_SUPABASE_URL="https://cmjihhcoxchqtqwkwdms.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtamloaGNveGNocXRxd2t3ZG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTY4MzIsImV4cCI6MjA3NjM5MjgzMn0.FMi5hyXYHLBAT15AZfm3K4S0jDH2Ua4o5xJBKpXpRo0"
```

**Important**: The anon/public key is the one labeled "anon" or "public" in Settings → API

---

### **Step 6: Test the Migration**

1. **Restart your dev server**:
   ```powershell
   # Stop current server (Ctrl+C)
   bun run dev
   ```

2. **Test the application**:
   - Fill out rental form
   - Upload documents
   - Capture face
   - Check payment page shows Bitcoin address

3. **Verify database**:
   - Go to Supabase Dashboard → Table Editor
   - Check `applications` table for new entries
   - Check Storage → Browse `ids` and `faces` buckets

---

## 🔧 **Troubleshooting**

### **Issue: "relation does not exist"**
- **Cause**: SQL schema not run
- **Fix**: Run `complete-database-setup.sql` in SQL Editor

### **Issue: Edge functions not working**
- **Cause**: Functions not deployed or secrets not set
- **Fix**: 
  ```powershell
  supabase functions deploy create-payment
  supabase secrets list  # Verify secrets exist
  ```

### **Issue: Storage upload fails**
- **Cause**: Storage buckets not created
- **Fix**: Run the storage bucket creation part of SQL schema again

### **Issue: "anon key" error**
- **Cause**: Wrong API key used
- **Fix**: Make sure you're using the **anon/public** key, NOT the service_role key

---

## ✅ **Migration Checklist**

- [ ] New Supabase project created
- [ ] Database schema executed successfully
- [ ] Storage buckets created (ids, faces)
- [ ] Edge functions deployed (3 functions)
- [ ] BTCPay secrets configured
- [ ] .env file updated with new credentials
- [ ] Application tested end-to-end
- [ ] Data persists in new database
- [ ] Payment flow works correctly

---

## 📚 **Files Created for Migration**

1. **schema/complete-database-setup.sql** - Complete database schema
2. **schema/01-tables.sql** - Just tables (optional)
3. **schema/02-storage.sql** - Just storage (optional)
4. **schema/03-functions-triggers.sql** - Functions and triggers (optional)
5. **edge-functions/** - All edge functions ready to deploy

---

## 🔐 **Security Reminders**

- ✅ Never commit `.env` to Git
- ✅ Use different passwords for each Supabase project
- ✅ Save your database password securely
- ✅ Keep BTCPay API keys private

---

## 🎉 **After Migration**

Your application will now run on the NEW Supabase instance:
- Independent from Lovable
- No usage limits from Lovable
- Full control over the database
- All BTCPay payments working

---

## 📞 **Need Help?**

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify all secrets are set: `supabase secrets list`
4. Ensure .env has correct values
