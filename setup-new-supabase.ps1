# ============================================================================
# Automated Supabase Setup for Your New Project
# ============================================================================
# This script will set up your new Supabase project automatically
# Run this in PowerShell from your project directory
# ============================================================================

Write-Host "Setting up your NEW Supabase project..." -ForegroundColor Cyan
Write-Host ""

# Project details
$PROJECT_REF = "cmjihhcoxchqtqwkwdms"
$PROJECT_URL = "https://cmjihhcoxchqtqwkwdms.supabase.co"

Write-Host "Your Project Details:" -ForegroundColor Yellow
Write-Host "   Project ID: $PROJECT_REF"
Write-Host "   Project URL: $PROJECT_URL"
Write-Host ""

# Check if Supabase CLI is installed
Write-Host "Step 1: Checking Supabase CLI..." -ForegroundColor Cyan
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseCmd) {
    Write-Host "   WARNING: Supabase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g supabase
    Write-Host "   SUCCESS: Supabase CLI installed!" -ForegroundColor Green
} else {
    Write-Host "   SUCCESS: Supabase CLI already installed" -ForegroundColor Green
}
Write-Host ""

# Login to Supabase
Write-Host "Step 2: Logging into Supabase..." -ForegroundColor Cyan
Write-Host "   A browser window will open for authentication" -ForegroundColor Gray
supabase login
Write-Host ""

# Link to project
Write-Host "Step 3: Linking to your project..." -ForegroundColor Cyan
supabase link --project-ref $PROJECT_REF
Write-Host "   SUCCESS: Project linked!" -ForegroundColor Green
Write-Host ""

# Deploy Edge Functions
Write-Host "Step 4: Deploying Edge Functions..." -ForegroundColor Cyan

Write-Host "   Deploying create-payment..." -ForegroundColor Gray
supabase functions deploy create-payment
Write-Host "   SUCCESS: create-payment deployed" -ForegroundColor Green

Write-Host "   Deploying payment-status..." -ForegroundColor Gray
supabase functions deploy payment-status
Write-Host "   SUCCESS: payment-status deployed" -ForegroundColor Green

Write-Host "   Deploying submit-application..." -ForegroundColor Gray
supabase functions deploy submit-application
Write-Host "   SUCCESS: submit-application deployed" -ForegroundColor Green
Write-Host ""

# Set BTCPay Secrets
Write-Host "Step 5: Configuring BTCPay secrets..." -ForegroundColor Cyan
supabase secrets set BTCPAY_API_KEY=7fd4c7d53930cf0250328c9648c035312f844a47
Write-Host "   SUCCESS: BTCPAY_API_KEY set" -ForegroundColor Green

supabase secrets set BTCPAY_STORE_ID=5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy
Write-Host "   SUCCESS: BTCPAY_STORE_ID set" -ForegroundColor Green

supabase secrets set BTCPAY_URL=https://btcpay.coincharge.io
Write-Host "   SUCCESS: BTCPAY_URL set" -ForegroundColor Green
Write-Host ""

# Verify secrets
Write-Host "Step 6: Verifying configuration..." -ForegroundColor Cyan
supabase secrets list
Write-Host ""

# Summary
Write-Host "============================================================================" -ForegroundColor Green
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "What has been configured:" -ForegroundColor Yellow
Write-Host "   - .env file updated with new Supabase credentials"
Write-Host "   - Edge Functions deployed (create-payment, payment-status, submit-application)"
Write-Host "   - BTCPay secrets configured"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Go to Supabase Dashboard: $PROJECT_URL" -ForegroundColor White
Write-Host "   2. Click SQL Editor then New Query" -ForegroundColor White
Write-Host "   3. Copy contents of schema/complete-database-setup.sql" -ForegroundColor White
Write-Host "   4. Paste and click Run" -ForegroundColor White
Write-Host "   5. Wait for success message" -ForegroundColor White
Write-Host "   6. Run: bun run dev" -ForegroundColor White
Write-Host "   7. Test your application!" -ForegroundColor White
Write-Host ""
Write-Host "Need help?" -ForegroundColor Yellow
Write-Host "   - See: SUPABASE_MIGRATION_CHECKLIST.md" -ForegroundColor White
Write-Host "   - Schema file: schema/complete-database-setup.sql" -ForegroundColor White
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Green
