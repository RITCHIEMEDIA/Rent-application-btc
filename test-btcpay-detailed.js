// Detailed BTCPay Test - Check what payment methods are available
const config = {
  apiKey: '7fd4c7d53930cf0250328c9648c035312f844a47',
  storeId: '5xp47yP1DvSEiSwdUj68FdTjfFbCLYFbYViordGSDDhy',
  url: 'https://btcpay.coincharge.io'
};

async function detailedTest() {
  console.log('Creating invoice and checking payment methods...\n');

  try {
    // Create invoice
    const invoiceResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${config.apiKey}`
      },
      body: JSON.stringify({
        amount: 100,
        currency: 'USD'
      })
    });

    const invoice = await invoiceResponse.json();
    console.log('Invoice created:', invoice.id);
    console.log('Status:', invoice.status);
    console.log('\nFull invoice data:');
    console.log(JSON.stringify(invoice, null, 2));

    // Wait a moment for payment methods to generate
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get payment methods
    console.log('\n--- Checking payment methods ---');
    const pmResponse = await fetch(`${config.url}/api/v1/stores/${config.storeId}/invoices/${invoice.id}/payment-methods`, {
      headers: {
        'Authorization': `token ${config.apiKey}`
      }
    });

    const methods = await pmResponse.json();
    console.log('\nPayment methods:');
    console.log(JSON.stringify(methods, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

detailedTest();
