# BTCPay Configuration Guide

## 🔐 Supabase Edge Function Secrets Configuration

Your BTCPay credentials have been collected. Follow these steps to configure them in Supabase:

### Method 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/tcffrkyefxblgeubssdm

2. Navigate to **Edge Functions** → **Manage secrets**

3. Add the following secrets:

```
BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
BTCPAY_URL=https://btcpay.coincharge.io
```

4. Click **Save** or **Add secret** for each one

---

### Method 2: Via Supabase CLI

If you have Supabase CLI installed, you can set secrets using commands:

```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref tcffrkyefxblgeubssdm

# Set the secrets
npx supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
npx supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
npx supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io

# Verify secrets are set
npx supabase secrets list
```

---

## 🧪 Testing the Configuration

After setting the secrets:

1. **Redeploy Edge Functions** (if they were already deployed):
   - In Supabase Dashboard, go to Edge Functions
   - Redeploy `create-payment`, `payment-status`, and `submit-application`

2. **Test the Payment Flow**:
   - Fill out the rental application form
   - Complete face capture
   - Check if the Bitcoin payment page displays:
     ✅ Bitcoin address
     ✅ BTC amount
     ✅ QR code
     ✅ Timer countdown

3. **Monitor Logs**:
   - In Supabase Dashboard → Edge Functions → Logs
   - Look for any errors from `create-payment` function

---

## ✅ Verification Checklist

- [ ] Secrets added to Supabase project
- [ ] Edge functions redeployed
- [ ] Test invoice created successfully
- [ ] Bitcoin address displays on payment page
- [ ] BTC amount shows correctly
- [ ] QR code generates properly

---

## 🔧 Troubleshooting

If you still don't see the Bitcoin address:

1. **Check BTCPay Store has a wallet connected**:
   - Login to https://btcpay.coincharge.io
   - Go to your Store → Wallets
   - Ensure a Bitcoin wallet is set up

2. **Verify API Key Permissions**:
   - Check that your API key has permissions to create invoices

3. **Check Edge Function Logs**:
   - Look for detailed error messages in Supabase logs

---

## 📞 Support

If issues persist, check:
- BTCPay Server documentation: https://docs.btcpayserver.org/
- Supabase Edge Functions docs: https://supabase.com/docs/guides/functions
