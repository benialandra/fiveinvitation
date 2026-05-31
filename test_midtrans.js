import midtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

const processMidtransServerKey = process.env.MIDTRANS_SERVER_KEY || "dummy_server_key";
const processMidtransClientKey = process.env.VITE_MIDTRANS_CLIENT_KEY || "dummy_client_key";

const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: processMidtransServerKey.replace(/^["']|["']$/g, ''),
  clientKey: processMidtransClientKey.replace(/^["']|["']$/g, ''),
});

async function run() {
  const payload = {
    "transaction_time": "2021-12-16 11:12:33",
    "transaction_status": "settlement",
    "transaction_id": "c1f7a098-b807-4228-b0a7-dc893006a8f8",
    "status_message": "midtrans payment notification",
    "status_code": "200",
    "signature_key": "some_sig",
    "payment_type": "gopay",
    "order_id": "order-12345",
    "merchant_id": "G0001",
    "gross_amount": "50000.00",
    "fraud_status": "accept",
    "currency": "IDR"
  };

  try {
    const statusResponse = await snap.transaction.notification(payload);
    console.log("Success:", statusResponse);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
run();
