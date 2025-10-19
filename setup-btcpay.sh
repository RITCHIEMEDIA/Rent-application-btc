#!/bin/bash

# BTCPay Configuration Script for Supabase Edge Functions
# Run this script after installing Supabase CLI

echo "🔧 Setting up BTCPay credentials for Supabase Edge Functions..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "📝 Logging into Supabase..."
supabase login

echo "🔗 Linking to project..."
supabase link --project-ref tcffrkyefxblgeubssdm

echo "🔐 Setting BTCPay secrets..."
supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io

echo ""
echo "✅ Secrets configured! Verifying..."
supabase secrets list

echo ""
echo "🎉 BTCPay configuration complete!"
echo "📌 Next steps:"
echo "   1. Deploy/redeploy your edge functions"
echo "   2. Test the payment flow in your application"
echo ""
