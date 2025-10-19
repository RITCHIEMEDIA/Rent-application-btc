# 🚀 Complete BTCPay Setup Instructions

Your BTCPay credentials have been received and the code has been updated. Follow these steps to complete the configuration.

## ✅ What's Already Done

- ✅ BTCPay integration code updated with better error handling
- ✅ UI improved to show helpful error messages
- ✅ Validation added for missing address/amount
- ✅ Setup scripts created

## 📋 Your BTCPay Credentials

```
BTCPAY_API_KEY: 7fd4c7d53930cf0250328c9648c035312f844a47
BTCPAY_STORE_ID: 5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
BTCPAY_URL: https://btcpay.coincharge.io
```

---

## 🎯 Step-by-Step Configuration

### **Option 1: Via Supabase Dashboard (EASIEST - Recommended)**

1. **Open your Supabase project dashboard**:
   - Go to: https://supabase.com/dashboard/project/tcffrkyefxblgeubssdm
   - Or search for "tcffrkyefxblgeubssdm" in your Supabase projects

2. **Navigate to Edge Functions**:
   - Click **Edge Functions** in the left sidebar
   - Click **Manage secrets** (or **Settings** → **Secrets**)

3. **Add each secret**:
   
   **Secret 1:**
   - Name: `BTCPAY_API_KEY`
   - Value: `7fd4c7d53930cf0250328c9648c035312f844a47`
   - Click **Add Secret** or **Save**

   **Secret 2:**
   - Name: `BTCPAY_STORE_ID`
   - Value: `5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy`
   - Click **Add Secret** or **Save**

   **Secret 3:**
   - Name: `BTCPAY_URL`
   - Value: `https://btcpay.coincharge.io`
   - Click **Add Secret** or **Save**

4. **Verify secrets are saved**:
   - You should see all 3 secrets listed
   - They will show as "hidden" or "****" for security

5. **Redeploy Edge Functions** (Important!):
   - Go to **Edge Functions** tab
   - For each function (`create-payment`, `payment-status`, `submit-application`):
     - Click the function name
     - Click **Deploy** or **Redeploy**
   - This ensures they pick up the new secrets

---

### **Option 2: Via Supabase CLI** (Alternative)

If you prefer using the command line:

#### **A. Enable PowerShell Scripts (One-time setup)**

```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"

# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Confirm with 'Y'
```

#### **B. Install Supabase CLI**

```powershell
npm install -g supabase
```

#### **C. Run the Setup Script**

```powershell
# Navigate to your project
cd "C:\Users\RITCHIETECH\Downloads\RITCHIETECH\Projects\face-rent-flow-main"

# Run the setup script
.\setup-btcpay.ps1
```

**OR manually:**

```powershell
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref tcffrkyefxblgeubssdm

# Set secrets one by one
npx supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
npx supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
npx supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io

# Verify
npx supabase secrets list
```

---

## 🧪 Testing the Configuration

### **Test 1: Quick Browser Test**

1. Open your browser console (F12)
2. Navigate to: http://localhost:8080
3. Copy and paste the contents of `test-btcpay.js` into the console
4. Run: `testBTCPayConnection()`
5. Check the output for any errors

### **Test 2: Full Application Flow**

1. **Start the dev server** (if not running):
   ```powershell
   bun run dev
   ```

2. **Fill out the application**:
   - Go to http://localhost:8080
   - Click "Start Application"
   - Complete all form steps
   - Upload documents
   - Capture your face

3. **Check Payment Page**:
   - You should be redirected to `/payment`
   - Verify you see:
     - ✅ Bitcoin address (long alphanumeric string)
     - ✅ BTC amount (e.g., "0.00012345 BTC")
     - ✅ QR code
     - ✅ Timer countdown (15:00)

4. **If address is still missing**:
   - Open browser console (F12)
   - Look for error messages
   - Check the Network tab for API responses

---

## ⚠️ Troubleshooting

### **Issue: "Address not available"**

**Possible causes:**

1. **BTCPay store has no wallet connected**
   - **Fix**: Login to https://btcpay.coincharge.io
   - Go to your Store → Wallets
   - Connect a Bitcoin wallet (on-chain or Lightning)

2. **Secrets not applied to Edge Functions**
   - **Fix**: Redeploy all edge functions in Supabase dashboard

3. **API key lacks permissions**
   - **Fix**: Regenerate API key with these permissions:
     - ✅ View invoices
     - ✅ Create invoice
     - ✅ Modify invoices

4. **Wrong Store ID**
   - **Fix**: Double-check Store ID in BTCPay dashboard

### **Issue: "Payment processor not configured"**

- **Cause**: Secrets not set in Supabase
- **Fix**: Follow Option 1 above to add secrets via dashboard

### **Issue: Edge Functions not updating**

- **Fix**: 
  1. Clear browser cache
  2. Redeploy edge functions
  3. Wait 1-2 minutes for changes to propagate

---

## 📊 Verification Checklist

After configuration, verify:

- [ ] Secrets added to Supabase project (3 secrets total)
- [ ] Edge functions redeployed
- [ ] BTCPay store has a wallet connected
- [ ] Test invoice creates successfully (using test-btcpay.js)
- [ ] Application form completes without errors
- [ ] Payment page displays Bitcoin address
- [ ] Payment page shows BTC amount
- [ ] QR code generates properly
- [ ] Timer counts down from 15:00

---

## 🎉 Success Indicators

When everything is working correctly, you'll see:

1. **In Browser Console**:
   ```
   Created BTCPay invoice: { id: '...', hasAddress: true, ... }
   Invoice created successfully
   Final resolved payment data: { address: 'bc1...', amountBtc: '0.00012345' }
   ```

2. **On Payment Page**:
   - Bitcoin Address field filled with address starting with "bc1" or "1" or "3"
   - Amount shows like "0.00012345 BTC"
   - QR code displays
   - Status badge shows "PENDING" in yellow
   - Timer shows "14:59" and counts down

---

## 📞 Need Help?

If you're still experiencing issues after following these steps:

1. **Check Supabase Edge Function Logs**:
   - Dashboard → Edge Functions → Logs
   - Look for errors from `create-payment` function

2. **Check BTCPay Store**:
   - Ensure wallet is connected and active
   - Try creating a test invoice manually in BTCPay

3. **Verify Credentials**:
   - API key hasn't been revoked
   - Store ID is correct
   - API key has proper permissions

---

## 🔒 Security Notes

- ✅ Never commit API keys to Git (.gitignore is configured)
- ✅ Secrets are stored server-side in Supabase (secure)
- ✅ Frontend never sees the API key
- ✅ All payment processing happens in Edge Functions

---

**Next Steps**: Follow Option 1 above to configure via Supabase Dashboard (5 minutes), then test the payment flow!
