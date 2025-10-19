# 🎯 Your Personal Setup Guide

## ✅ **Configuration Already Done!**

Your `.env` file has been updated with your new Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="cmjihhcoxchqtqwkwdms"
VITE_SUPABASE_URL="https://cmjihhcoxchqtqwkwdms.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc...Ro0" (your anon key)
```

---

## 🚀 **What You Need to Do Now (3 Steps)**

### **OPTION 1: Automated Setup (Recommended)**

Run this one command in PowerShell:

```powershell
.\setup-new-supabase.ps1
```

This will:
- ✅ Install Supabase CLI (if needed)
- ✅ Login to Supabase
- ✅ Link to your project
- ✅ Deploy all 3 edge functions
- ✅ Set BTCPay secrets
- ✅ Verify everything

**Then just:**
1. Go to https://cmjihhcoxchqtqwkwdms.supabase.co
2. SQL Editor → New Query
3. Copy/paste `schema/complete-database-setup.sql`
4. Click Run
5. Done!

---

### **OPTION 2: Manual Setup**

#### **Step 1: Run Database Setup**

1. **Open**: https://cmjihhcoxchqtqwkwdms.supabase.co
2. **Click**: SQL Editor (left sidebar)
3. **Click**: "New query"
4. **Open**: `schema/complete-database-setup.sql` file
5. **Copy**: ENTIRE contents
6. **Paste**: Into SQL Editor
7. **Click**: "Run" (or press Ctrl+Enter)
8. **Wait**: For "Success" message

#### **Step 2: Deploy Edge Functions**

```powershell
# Install CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref cmjihhcoxchqtqwkwdms

# Deploy functions
supabase functions deploy create-payment
supabase functions deploy payment-status
supabase functions deploy submit-application

# Set BTCPay secrets
supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io

# Verify
supabase secrets list
```

#### **Step 3: Test Application**

```powershell
# Start dev server
bun run dev
```

Visit http://localhost:8080 and test!

---

## ✅ **Verification Checklist**

After setup, verify:

- [ ] Supabase Dashboard shows `applications` table
- [ ] Supabase Dashboard shows `payment_events` table
- [ ] Storage shows `ids` bucket
- [ ] Storage shows `faces` bucket
- [ ] Edge Functions shows 3 deployed functions
- [ ] App loads at http://localhost:8080
- [ ] Can fill out rental form
- [ ] Face capture works
- [ ] Payment page shows Bitcoin address
- [ ] QR code displays

---

## 📊 **Your Project Info**

**Supabase Dashboard**: https://cmjihhcoxchqtqwkwdms.supabase.co  
**Project ID**: `cmjihhcoxchqtqwkwdms`  
**API URL**: https://cmjihhcoxchqtqwkwdms.supabase.co  

**BTCPay Store**: https://btcpay.coincharge.io  
**Store ID**: `5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy`

---

## 🔧 **Quick Troubleshooting**

### **Issue: PowerShell script won't run**
```powershell
# Run this first (as Administrator):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Issue: "relation does not exist"**
→ Run the SQL schema in Supabase SQL Editor

### **Issue: Edge function errors**
```powershell
# Redeploy
supabase functions deploy create-payment
```

### **Issue: No Bitcoin address**
```powershell
# Check secrets are set
supabase secrets list

# Re-set if needed
supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
```

---

## 🎉 **You're Almost Done!**

**Current Status**:
- ✅ `.env` configured with your credentials
- ✅ Schema files ready to run
- ✅ Setup script ready
- ✅ BTCPay credentials ready

**Next**: Run `setup-new-supabase.ps1` OR follow manual steps above!

**Time Needed**: 10-15 minutes  
**Difficulty**: Easy 😊

---

**Questions?** Check:
- [SUPABASE_MIGRATION_CHECKLIST.md](./SUPABASE_MIGRATION_CHECKLIST.md) - Detailed checklist
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Complete overview
- [schema/README.md](./schema/README.md) - Database documentation
