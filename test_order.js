import fetch from 'node-fetch';

async function testOrder() {
  const payload = {
    order_id: "test-order-" + Math.floor(Math.random() * 100000),
    gross_amount: 10000,
    first_name: "Test",
    email: "test@example.com"
  };

  try {
    const res = await fetch('http://localhost:3000/api/order/create', {
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
testOrder();
