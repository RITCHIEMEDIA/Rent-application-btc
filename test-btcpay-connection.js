// Quick BTCPay Connection Test
// Run this with: node test-btcpay-connection.js

const config = {
  apiKey: '7fd4c7d53930cf0250328c9648c035312f844a47',
  storeId: '5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy',
  url: 'https://btcpay.coincharge.io'
};

async function testBTCPay() {
  console.log('🧪 Testing BTCPay Connection...\n');
  console.log('Configuration:');
  console.log('  URL:', config.url);
  console.log('  Store ID:', config.storeId);
  console.log('  API Key:', config.apiKey.substring(0, 10) + '...\n');

  try {
    // Test 1: Check store access
    console.log('1️⃣  Testing store access...');
    const storeResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}`, {
      headers: {
        'Authorization': `token ${config.apiKey}`
      }
    });
    
    if (!storeResponse.ok) {
      const errorText = await storeResponse.text();
      console.error('❌ Store access failed:', storeResponse.status, storeResponse.statusText);
      console.error('Error:', errorText);
      return;
    }
    
    const storeData = await storeResponse.json();
    console.log('✅ Store access successful!');
    console.log('   Store name:', storeData.name || 'N/A');
    console.log('');

    // Test 2: Create test invoice
    console.log('2️⃣  Creating test invoice...');
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
      console.error('❌ Invoice creation failed:', invoiceResponse.status);
      console.error('Error:', errorText);
      
      if (errorText.includes('wallet') || errorText.includes('Wallet')) {
        console.error('\n⚠️  ISSUE: Your BTCPay store does not have a wallet connected!');
        console.error('   FIX: Go to https://btcpay.coincharge.io');
        console.error('        → Your Store → Wallets → Connect a Bitcoin wallet');
      }
      return;
    }
    
    const invoice = await invoiceResponse.json();
    console.log('✅ Test invoice created!');
    console.log('   Invoice ID:', invoice.id);
    console.log('   Status:', invoice.status);
    console.log('   Checkout URL:', invoice.checkoutLink);
    console.log('');

    // Test 3: Check invoice details
    console.log('3️⃣  Checking invoice details...');
    const detailsResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices/${invoice.id}`, {
      headers: {
        'Authorization': `token ${config.apiKey}`
      }
    });
    
    if (detailsResponse.ok) {
      const details = await detailsResponse.json();
      console.log('✅ Invoice details retrieved!');
      console.log('   BTC Amount:', details.btcPrice || details.amount || 'N/A');
      console.log('   Address:', details.bitcoinAddress || 'Not yet generated');
      console.log('');
    }

    // Test 4: Check payment methods
    console.log('4️⃣  Checking payment methods...');
    const pmResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices/${invoice.id}/payment-methods`, {
      headers: {
        'Authorization': `token ${config.apiKey}`
      }
    });
    
    if (pmResponse.ok) {
      const methods = await pmResponse.json();
      console.log('✅ Payment methods retrieved!');
      console.log('   Available methods:', methods.length);
      
      const btcMethod = methods.find(m => 
        (m.paymentMethod || m.cryptoCode || '').toUpperCase().includes('BTC')
      );
      
      if (btcMethod) {
        console.log('   💰 Bitcoin payment method found:');
        console.log('      Address:', btcMethod.destination || btcMethod.address || 'N/A');
        console.log('      Amount:', btcMethod.amount || btcMethod.cryptoAmount || 'N/A');
      } else {
        console.warn('   ⚠️  No Bitcoin payment method found!');
      }
    }

    console.log('');
    console.log('🎉 All tests passed! BTCPay is configured correctly.');
    
  } catch (error) {
    console.error('');
    console.error('❌ Test failed:', error.message);
  }
}

testBTCPay();
