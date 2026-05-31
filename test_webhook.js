import fetch from 'node-fetch';

async function testWebhook() {
  const payload = {
    "transaction_time": "2021-12-16 11:12:33",
    "transaction_status": "settlement",
    "transaction_id": "c1f7a098-b807-4228-b0a7-dc893006a8f8",
    "status_message": "midtrans payment notification",
    "status_code": "200",
    "signature_key": "some_sig",
    "payment_type": "gopay",
    "order_id": "YOUR_ORDER_ID_HERE",
    "merchant_id": "G0001",
    "gross_amount": "50000.00",
    "fraud_status": "accept",
    "currency": "IDR"
  };

  try {
    const res = await fetch('http://localhost:3000/api/webhook/midtrans', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload)
    });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch(e) {
    console.log(e);
  }
}
testWebhook();
