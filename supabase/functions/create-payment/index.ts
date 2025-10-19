import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Log incoming request
  console.log('Received request:', { method: req.method, url: req.url })
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body with error handling
    let requestBody
    try {
      const text = await req.text()
      console.log('Request body text:', text)
      requestBody = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      throw new Error('Invalid JSON in request body')
    }
    
    const { tempId } = requestBody
    console.log('Creating payment for tempId:', tempId)

    if (!tempId) {
      throw new Error('Missing tempId')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get application data
    const { data: application, error: appError } = await supabaseClient
      .from('applications')
      .select('*')
      .eq('temp_id', tempId)
      .single()

    if (appError || !application) {
      console.error('Application not found:', appError)
      throw new Error('Application not found')
    }

    console.log('Found application:', application.id)

    // BTCPay Server API configuration
    const btcpayApiKey = Deno.env.get('BTCPAY_API_KEY')?.trim()
    const btcpayUrl = Deno.env.get('BTCPAY_URL')?.trim() || 'https://btcpay.coincharge.io'
    const btcpayStoreId = Deno.env.get('BTCPAY_STORE_ID')?.trim()
    
    console.log('Environment variables check:', {
      BTCPAY_API_KEY: Deno.env.get('BTCPAY_API_KEY'),
      BTCPAY_STORE_ID: Deno.env.get('BTCPAY_STORE_ID'),
      BTCPAY_URL: Deno.env.get('BTCPAY_URL'),
      hasApiKey: !!btcpayApiKey,
      hasStoreId: !!btcpayStoreId,
      apiKeyLength: btcpayApiKey?.length || 0,
      storeIdLength: btcpayStoreId?.length || 0
    })
    
    if (!btcpayApiKey || !btcpayStoreId) {
      console.error('BTCPay configuration missing. BTCPAY_API_KEY:', !!btcpayApiKey, 'BTCPAY_STORE_ID:', !!btcpayStoreId)
      throw new Error('Payment processor not configured. Please set BTCPAY_API_KEY and BTCPAY_STORE_ID in Supabase Edge Function secrets.')
    }

    console.log('BTCPay configuration:', { url: btcpayUrl, storeId: btcpayStoreId, hasApiKey: !!btcpayApiKey })

    // Get deposit amount from application
    const depositAmountUSD = application.deposit_amount || 100
    console.log('Deposit amount from application:', depositAmountUSD, 'USD')

    // Create invoice via BTCPay
    const invoiceData = {
      amount: depositAmountUSD,
      currency: 'USD',
      metadata: {
        applicationId: application.id,
        tempId: tempId
      },
      checkout: {
        expirationMinutes: 15,
        redirectURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-webhook`
      }
    }

    console.log('Creating BTCPay invoice:', invoiceData)

    const btcpayResponse = await fetch(`${btcpayUrl}/api/v1/stores/${btcpayStoreId}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${btcpayApiKey}`
      },
      body: JSON.stringify(invoiceData)
    })

    if (!btcpayResponse.ok) {
      const errorText = await btcpayResponse.text()
      console.error('BTCPay API error response:', {
        status: btcpayResponse.status,
        statusText: btcpayResponse.statusText,
        body: errorText
      })
      
      // Parse common errors
      let errorMessage = errorText
      if (errorText.includes('No wallet')) {
        errorMessage = 'No wallet has been linked to the BTCPay store. Please configure a wallet first.'
      } else if (btcpayResponse.status === 401 || btcpayResponse.status === 403) {
        errorMessage = 'Authentication failed. Please check BTCPAY_API_KEY is correct and has proper permissions.'
      } else if (btcpayResponse.status === 404) {
        errorMessage = 'BTCPay store not found. Please check BTCPAY_STORE_ID is correct.'
      }
      
      throw new Error(`BTCPay API error (${btcpayResponse.status}): ${errorMessage}`)
    }

    const invoice = await btcpayResponse.json()
    console.log('Created BTCPay invoice:', {
      id: invoice.id,
      status: invoice.status,
      hasAddress: !!invoice.bitcoinAddress,
      hasCryptoInfo: !!invoice.cryptoInfo,
      expirationTime: invoice.expirationTime
    })

    // Resolve address and amount by querying BTCPay if needed
    const btcpayBase = btcpayUrl
    const storeId = btcpayStoreId

    // Convert Unix timestamp to ISO string if needed
    const expiresAt = typeof invoice.expirationTime === 'number' 
      ? new Date(invoice.expirationTime * 1000).toISOString()
      : invoice.expirationTime

    // Try to get details from the invoice details endpoint
    let amountBtcResolved = invoice.btcPrice || invoice.cryptoInfo?.[0]?.cryptoAmount
    let addressResolved = invoice.bitcoinAddress || invoice.cryptoInfo?.[0]?.address

    try {
      const invDetailsResp = await fetch(`${btcpayBase}/api/v1/stores/${storeId}/invoices/${invoice.id}`, {
        headers: { 'Authorization': `token ${btcpayApiKey}` }
      })
      if (invDetailsResp.ok) {
        const details = await invDetailsResp.json()
        amountBtcResolved = amountBtcResolved || details.btcPrice || details.cryptoInfo?.[0]?.cryptoAmount
        addressResolved = addressResolved || details.bitcoinAddress || details.cryptoInfo?.[0]?.address
      }
    } catch (e) {
      console.warn('Failed to fetch invoice details:', e)
    }

    // If address still missing, query payment methods
    if (!addressResolved) {
      console.log('Address not found in invoice, querying payment methods...')
      try {
        const pmResp = await fetch(`${btcpayBase}/api/v1/stores/${storeId}/invoices/${invoice.id}/payment-methods`, {
          headers: { 'Authorization': `token ${btcpayApiKey}` }
        })
        if (pmResp.ok) {
          const methods = await pmResp.json()
          console.log('Payment methods response:', methods)
          const btcOnchain = Array.isArray(methods) ? methods.find((m: any) => 
            (m.paymentMethodId === 'BTC-CHAIN' || (m.paymentMethod || m.paymentType || m.cryptoCode || '').toString().toUpperCase().includes('BTC'))
          ) : null
          if (btcOnchain) {
            addressResolved = btcOnchain.destination || btcOnchain.address || btcOnchain.paymentDestination
            amountBtcResolved = amountBtcResolved || btcOnchain.amount || btcOnchain.due || btcOnchain.cryptoAmount
            console.log('Resolved from payment methods:', { address: addressResolved, amount: amountBtcResolved })
          } else {
            console.warn('No BTC payment method found')
          }
        } else {
          console.warn('Payment methods fetch failed:', pmResp.status)
        }
      } catch (e) {
        console.warn('Failed to fetch payment methods:', e)
      }
    }

    // Final validation
    if (!addressResolved) {
      console.error('CRITICAL: No Bitcoin address could be resolved from BTCPay invoice')
      throw new Error('Failed to generate Bitcoin address. This usually means the BTCPay store has no wallet configured.')
    }
    
    if (!amountBtcResolved) {
      console.error('CRITICAL: No BTC amount could be resolved from BTCPay invoice')
      throw new Error('Failed to calculate Bitcoin amount. Please check BTCPay store configuration.')
    }

    console.log('Final resolved payment data:', { address: addressResolved, amountBtc: amountBtcResolved })

    // Persist payment info
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({
        payment_invoice_id: invoice.id,
        payment_address: addressResolved,
        payment_amount: amountBtcResolved,
        payment_currency: 'BTC',
        payment_created_at: new Date().toISOString(),
        payment_expires_at: expiresAt,
        payment_status: 'pending',
        payment_provider: 'btcpay'
      })
      .eq('id', application.id)

    if (updateError) {
      console.error('Error updating application:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({
        invoiceId: invoice.id,
        invoiceUrl: invoice.checkoutLink,
        address: addressResolved,
        amountBtc: amountBtcResolved,
        amountUsd: depositAmountUSD,
        expiresAt: expiresAt,
        applicationId: application.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in create-payment:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log full error details
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'UnknownError'
    })
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorStack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})