import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { invoiceId } = await req.json()
    console.log('Checking payment status for invoice:', invoiceId)

    if (!invoiceId) {
      throw new Error('Missing invoiceId')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // BTCPay Server API configuration
    const btcpayApiKey = Deno.env.get('BTCPAY_API_KEY')
    const btcpayUrl = Deno.env.get('BTCPAY_URL') || 'https://btcpay.coincharge.io'
    const btcpayStoreId = Deno.env.get('BTCPAY_STORE_ID')
    
    if (!btcpayApiKey || !btcpayStoreId) {
      throw new Error('BTCPay configuration missing. Please configure BTCPAY_API_KEY and BTCPAY_STORE_ID')
    }

    // Get invoice status from BTCPay
    const btcpayResponse = await fetch(`${btcpayUrl}/api/v1/stores/${btcpayStoreId}/invoices/${invoiceId}`, {
      headers: {
        'Authorization': `token ${btcpayApiKey}`
      }
    })

    if (!btcpayResponse.ok) {
      const errorText = await btcpayResponse.text()
      console.error('BTCPay error:', errorText)
      throw new Error(`BTCPay API error: ${btcpayResponse.status}`)
    }

    const invoice = await btcpayResponse.json()
    console.log('Invoice status:', invoice.status)

    // Map BTCPay status to our status
    let status = 'pending'
    if (invoice.status === 'Settled' || invoice.status === 'Processing') {
      status = 'paid'
    } else if (invoice.status === 'Expired') {
      status = 'expired'
    } else if (invoice.status === 'Invalid') {
      status = 'failed'
    }

    // Update application status if paid
    if (status === 'paid') {
      const { error: updateError } = await supabaseClient
        .from('applications')
        .update({
          payment_status: 'paid',
          payment_confirmed_at: new Date().toISOString(),
          payment_txid: invoice.transactionId || invoice.id
        })
        .eq('payment_invoice_id', invoiceId)

      if (updateError) {
        console.error('Error updating application:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in payment-status:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})