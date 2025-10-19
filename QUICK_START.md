# ⚡ Quick Start - BTCPay Configuration

## 🎯 **Do This Now** (5 minutes)

### **Step 1: Go to Supabase Dashboard**
👉 **https://supabase.com/dashboard/project/tcffrkyefxblgeubssdm**

### **Step 2: Add Secrets**
Click: **Edge Functions** → **Manage secrets**

Add these 3 secrets:

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

### **Step 3: Redeploy Edge Functions**
Go to: **Edge Functions** tab

Redeploy these 3 functions:
- ✅ `create-payment`
- ✅ `payment-status`
- ✅ `submit-application`

### **Step 4: Test**
1. Go to http://localhost:8080
2. Fill out application form
3. Complete face capture
4. Check payment page shows Bitcoin address

---

## ✅ **What You Should See**

**Payment Page should show:**
- Bitcoin address (e.g., `bc1q...` or `1...` or `3...`)
- BTC amount (e.g., `0.00012345 BTC`)
- QR code
- 15-minute timer

---

## ❌ **Still Not Working?**

### **Check BTCPay Store Has Wallet**
1. Login to https://btcpay.coincharge.io
2. Go to your Store → **Wallets**
3. Ensure Bitcoin wallet is connected

### **Check Console for Errors**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Share them if you need help

---

## 📚 **More Details**
See [`SETUP_INSTRUCTIONS.md`](./SETUP_INSTRUCTIONS.md) for comprehensive guide.

---

**That's it! Your BTCPay is now configured.** 🎉
