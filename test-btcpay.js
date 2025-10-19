/**
 * BTCPay Connection Test Utility
 * 
 * This script tests the BTCPay API connection using your credentials.
 * Run this in the browser console on your payment page to debug issues.
 */

async function testBTCPayConnection() {
  console.log('🧪 Testing BTCPay Connection...\n');
  
  const config = {
    apiKey: '7fd4c7d53930cf0250328c9648c035312f844a47',
    storeId: '5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy',
    url: 'https://btcpay.coincharge.io'
  };
  
  console.log('📋 Configuration:');
  console.log(`   URL: ${config.url}`);
  console.log(`   Store ID: ${config.storeId}`);
  console.log(`   API Key: ${config.apiKey.substring(0, 10)}...`);
  console.log('');
  
  try {
    // Test 1: Check store access
    console.log('1️⃣ Testing store access...');
    const storeResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}`, {
      headers: {
        'Authorization': `token ${config.apiKey}`
      }
    });
    
    if (!storeResponse.ok) {
      throw new Error(`Store access failed: ${storeResponse.status} ${storeResponse.statusText}`);
    }
    
    const storeData = await storeResponse.json();
    console.log('   ✅ Store access successful!');
    console.log(`   Store name: ${storeData.name || 'N/A'}`);
    console.log('');
    
    // Test 2: Create test invoice
    console.log('2️⃣ Creating test invoice...');
    const invoiceResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${config.apiKey}`
      },
      body: JSON.stringify({
        amount: 10,
        currency: 'USD',
        metadata: {
          test: true,
          timestamp: new Date().toISOString()
        },
        checkout: {
          expirationMinutes: 15
        }
      })
    });
    
    if (!invoiceResponse.ok) {
      const errorText = await invoiceResponse.text();
      throw new Error(`Invoice creation failed: ${invoiceResponse.status}\n${errorText}`);
    }
    
    const invoice = await invoiceResponse.json();
    console.log('   ✅ Test invoice created!');
    console.log(`   Invoice ID: ${invoice.id}`);
    console.log(`   Status: ${invoice.status}`);
    console.log('');
    
    // Test 3: Get invoice details
    console.log('3️⃣ Fetching invoice details...');
    const detailsResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices/${invoice.id}`, {
      headers: {
        'Authorization': `token ${config.apiKey}`
      }
    });
    
    if (!detailsResponse.ok) {
      throw new Error(`Failed to fetch invoice details: ${detailsResponse.status}`);
    }
    
    const details = await detailsResponse.json();
    console.log('   ✅ Invoice details retrieved!');
    console.log(`   BTC Amount: ${details.btcPrice || details.amount || 'N/A'}`);
    console.log(`   Address: ${details.bitcoinAddress || 'Not yet generated'}`);
    console.log('');
    
    // Test 4: Get payment methods
    console.log('4️⃣ Checking payment methods...');
    const pmResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices/${invoice.id}/payment-methods`, {
      headers: {
        'Authorization': `token ${config.apiKey}`
      }
    });
    
    if (pmResponse.ok) {
      const methods = await pmResponse.json();
      console.log('   ✅ Payment methods retrieved!');
      console.log('   Available methods:', methods.length);
      
      const btcMethod = methods.find(m => 
        (m.paymentMethod || m.cryptoCode || '').toUpperCase().includes('BTC')
      );
      
      if (btcMethod) {
        console.log('   💰 Bitcoin payment method found:');
        console.log(`      Address: ${btcMethod.destination || btcMethod.address || 'N/A'}`);
        console.log(`      Amount: ${btcMethod.amount || btcMethod.cryptoAmount || 'N/A'}`);
      } else {
        console.warn('   ⚠️ No Bitcoin payment method found!');
        console.log('   Available methods:', methods.map(m => m.paymentMethod || m.cryptoCode));
      }
    } else {
      console.warn('   ⚠️ Could not fetch payment methods');
    }
    
    console.log('');
    console.log('🎉 All tests completed successfully!');
    console.log('📌 Your BTCPay configuration is working correctly.');
    console.log('');
    console.log('🔗 Test invoice URL:', invoice.checkoutLink);
    
    return {
      success: true,
      invoice: details,
      checkoutLink: invoice.checkoutLink
    };
    
  } catch (error) {
    console.error('');
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('   1. Verify API key has correct permissions');
    console.error('   2. Check that Store ID is correct');
    console.error('   3. Ensure your BTCPay store has a wallet connected');
    console.error('   4. Check BTCPay server is accessible');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('💡 Run testBTCPayConnection() to test your BTCPay setup');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testBTCPayConnection };
}
