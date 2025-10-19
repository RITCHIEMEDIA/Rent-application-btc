# BTCPay Configuration Script for Supabase Edge Functions (PowerShell)
# Run this script in PowerShell after installing Supabase CLI

Write-Host "🔧 Setting up BTCPay credentials for Supabase Edge Functions..." -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseCmd) {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g supabase
}

Write-Host "📝 Logging into Supabase..." -ForegroundColor Cyan
supabase login

Write-Host "🔗 Linking to project..." -ForegroundColor Cyan
supabase link --project-ref tcffrkyefxblgeubssdm

Write-Host "🔐 Setting BTCPay secrets..." -ForegroundColor Cyan
supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io

Write-Host ""
Write-Host "✅ Secrets configured! Verifying..." -ForegroundColor Green
supabase secrets list

Write-Host ""
Write-Host "🎉 BTCPay configuration complete!" -ForegroundColor Green
Write-Host "📌 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Deploy/redeploy your edge functions"
Write-Host "   2. Test the payment flow in your application"
Write-Host ""
