import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
// @ts-ignore
import midtransClient from "midtrans-client";
import dotenv from "dotenv";
import * as cron from 'node-cron';
import nodemailer from 'nodemailer';
import { createClient } from "@supabase/supabase-js";
import multer from 'multer';
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON parsing
app.use(express.json());

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
} else if (fs.existsSync(".env.example")) {
  dotenv.config({ path: ".env.example" });
}

// Multer Setup
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, ''));
    }
  })
});

// Serve uploads directory specifically
app.use('/uploads', express.static(uploadsDir));

// Initialize Supabase Server Client
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseUrl = rawSupabaseUrl.replace(/^["']|["']$/g, '');
const supabaseKey = (process.env.VITE_SUPABASE_ANON_KEY || 'mock-key').replace(/^["']|["']$/g, '');
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Midtrans Core API / Snap
const processMidtransServerKey = process.env.MIDTRANS_SERVER_KEY || "dummy_server_key";
const processMidtransClientKey = process.env.VITE_MIDTRANS_CLIENT_KEY || "dummy_client_key";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: processMidtransServerKey.replace(/^["']|["']$/g, ''),
  clientKey: processMidtransClientKey.replace(/^["']|["']$/g, ''),
});

// ==========================================
// API ROUTES
// ==========================================

// Seed Themes Endpoint (Initial manual seeding to Supabase)
app.post("/api/admin/themes/seed", async (req, res) => {
  try {
    if (supabaseUrl === 'https://mock.supabase.co') {
      return res.status(400).json({ error: "Connect to real Supabase to seed" });
    }
    const { themes } = req.body;
    if (!themes || !Array.isArray(themes)) {
      return res.status(400).json({ error: "Invalid themes payload" });
    }
    const { error } = await supabase.from('themes').upsert(themes, { onConflict: 'id' });
    if (error) throw error;
    res.json({ success: true, message: "Themes seeded successfully" });
  } catch (err: any) {
    console.error("Failed to seed themes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch all Themes Endpoint
app.get("/api/themes", async (req, res) => {
  try {
    if (supabaseUrl === 'https://mock.supabase.co') return res.json([]);
    const { data, error } = await supabase.from('themes').select('*').order('created_at', { ascending: false });
    if (error) {
       console.error("Supabase fetch error:", error);
       return res.json([]);
    }
    res.json(data || []);
  } catch (err) {
    console.error("Failed to fetch themes:", err);
    res.json([]);
  }
});

// Create Theme Endpoint
app.post("/api/admin/themes", upload.fields([{ name: 'zipFile', maxCount: 1 }, { name: 'images', maxCount: 5 }]), async (req: any, res: any) => {
  try {
    const { id, name, category, price, thumbnail, config_json } = req.body;
    
    if (supabaseUrl === 'https://mock.supabase.co') return res.json({ success: true, message: "Simulated theme creation" });
    
    let parsedConfig: any = null;
    try {
        if (config_json) parsedConfig = typeof config_json === 'string' ? JSON.parse(config_json) : config_json;
    } catch {
       return res.status(400).json({ error: "Invalid JSON format in config_json" });
    }

    let finalThumbnail = thumbnail || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop';
    
    // Process uploaded images
    if (req.files && Array.isArray(req.files['images'])) {
       const uploadedImages = req.files['images'].map((f: any) => `/uploads/${f.filename}`);
       if (uploadedImages.length > 0) {
           finalThumbnail = uploadedImages[0];
           if (!parsedConfig) parsedConfig = {};
           parsedConfig.gallery = uploadedImages;
       }
    }

    const { data, error } = await supabase.from('themes').insert([{
       id: id || `theme-${Date.now()}`,
       name,
       category,
       price: Number(price),
       thumbnail: finalThumbnail,
       sales: 0,
       config_json: parsedConfig
    }]).select().single();
    
    if (error) throw error;
    return res.json({ success: true, theme: data });
  } catch (err: any) {
    console.error("Failed to create theme:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Edit Theme Endpoint
app.put("/api/admin/themes/:id", upload.fields([{ name: 'thumbnailFile', maxCount: 1 }, { name: 'images', maxCount: 5 }]), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, category, price, thumbnail: currentThumbnail, config_json } = req.body;
    
    let finalThumbnail = currentThumbnail || '';
    if (req.files && req.files['thumbnailFile']) {
      finalThumbnail = `/uploads/${req.files['thumbnailFile'][0].filename}`;
    }

    if (supabaseUrl === 'https://mock.supabase.co') return res.json({ success: true, thumbnail: finalThumbnail });
    
    let parsedConfig: any = undefined;
    try {
        if (config_json) parsedConfig = typeof config_json === 'string' ? JSON.parse(config_json) : config_json;
    } catch {
       return res.status(400).json({ error: "Invalid JSON format in config_json" });
    }

    // Process new gallery images
    if (req.files && Array.isArray(req.files['images'])) {
       const newGalleryImages = req.files['images'].map((f: any) => `/uploads/${f.filename}`);
       if (newGalleryImages.length > 0) {
           if (!parsedConfig) parsedConfig = {};
           let currentGallery = Array.isArray(parsedConfig.gallery) ? parsedConfig.gallery : [];
           // Overwrite or append? The user selects new files. Let's just overwrite for now or combine. We can overwrite to keep things simple if they upload new 5 ones.
           // Actually if they upload new ones, we'll overwrite the gallery. If they didn't upload any, we keep what's in config_json.
           parsedConfig.gallery = newGalleryImages;
           if (!finalThumbnail) finalThumbnail = newGalleryImages[0];
       }
    }

    const updatePayload: any = {
       name,
       category,
       price: Number(price),
       thumbnail: finalThumbnail
    };
    if (parsedConfig !== undefined) updatePayload.config_json = parsedConfig;

    const { data: dbData, error } = await supabase.from('themes').update(updatePayload).eq('id', id).select().single();
    
    if (error) throw error;
    return res.json({ success: true, thumbnail: finalThumbnail, theme: dbData });
  } catch (err: any) {
    console.error("Failed to update theme:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 1. Fetch all orders
app.get("/api/orders", async (req, res) => {
  try {
    if (supabaseUrl === 'https://mock.supabase.co') return res.json([]);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
       console.error("Supabase fetch error:", error);
       return res.json([]);
    }
    res.json(data || []);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.json([]);
  }
});

// Fetch single order
app.get("/api/orders/:orderCode", async (req, res) => {
  try {
    if (supabaseUrl === 'https://mock.supabase.co') return res.status(404).json({error: "Not found"});
    const { data, error } = await supabase.from('orders').select('*').eq('unique_code', req.params.orderCode).single();
    if (error || !data) {
       return res.status(404).json({error: "Not found"});
    }
    res.json(data);
  } catch (err) {
    console.error("Failed to fetch order:", err);
    res.status(500).json({error: "Server error"});
  }
});

// Update single order
app.put("/api/orders/:orderCode", upload.fields([{ name: 'cover_image' }, { name: 'hero_image' }]), async (req, res) => {
  try {
    const orderCode = req.params.orderCode;
    const { 
      groom_name, bride_name, groom_parents, bride_parents, 
      akad_date, resepsi_date, location_name, maps_link, story, music_url, slug 
    } = req.body;

    let updateData: any = {
      groom_name, bride_name, groom_parents, bride_parents, 
      location_name, maps_link, story, music_url, slug
    };

    updateData.akad_date = akad_date || null;
    updateData.resepsi_date = resepsi_date || null;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files['cover_image']?.[0]) {
        updateData.cover_image = `/uploads/${files['cover_image'][0].filename}`;
      }
      if (files['hero_image']?.[0]) {
        updateData.hero_image = `/uploads/${files['hero_image'][0].filename}`;
      }
    }

    if (supabaseUrl === 'https://mock.supabase.co') {
      return res.json({ status: "success", data: updateData });
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('unique_code', orderCode)
      .select()
      .single();

    if (error) {
       console.error("Supabase update error:", error);
       return res.status(500).json({error: error.message || "Failed to update order", details: error});
    }
    res.json(data);
  } catch (err: any) {
    console.error("Failed to update order:", err);
    res.status(500).json({error: err.message || "Server error", details: err});
  }
});

app.post("/api/order/create", async (req, res) => {
  try {
    const { order_id, gross_amount, first_name, email, theme_id, groom_name, bride_name } = req.body;
    
    // Save to Supabase
    try {
      if (supabaseUrl !== 'https://mock.supabase.co') {
        const insertData: any = {
           unique_code: order_id,
           groom_name,
           bride_name,
           theme_id,
           status: 'PENDING',
           slug: req.body.slug,
           akad_date: req.body.akad_date || null,
           customer_email: email
        };

        let { error } = await supabase.from('orders').insert([insertData]);
        
        if (error && error.message && error.message.includes('customer_email')) {
           console.log("customer_email column not found in orders table, retrying without it...");
           // Retry without customer_email for backwards compatibility
           const fallbackData = { ...insertData };
           delete fallbackData.customer_email;
           const result = await supabase.from('orders').insert([fallbackData]);
           error = result.error;
        }

        if (error) {
           console.error("Supabase insert error:", JSON.stringify(error));
           if ((error.code === '23505' || (error.message && error.message.includes('unique constraint'))) && error.message?.includes('slug')) {
             return res.status(400).json({ error: "Custom URL (slug) ini sudah digunakan. Silakan pilih URL lain (contoh: tambahkan angka atau nama belakang)." });
           }
           return res.status(500).json({ error: "Terdapat kesalahan saat menyimpan pesanan (Database Error)." });
        }
      } else {
        console.log("Mocking Supabase insert for order:", order_id);
      }
    } catch (insertError) {
      console.error("Exception when inserting to Supabase:", insertError);
      return res.status(500).json({ error: "Exception inserting error" });
    }

    let token = "debug-token-12345";
    let redirect_url = "#";
    
    // Fallback if Midtrans is not configured, simulate success for preview
    if (!process.env.MIDTRANS_SERVER_KEY) {
      console.log("No MIDTRANS_SERVER_KEY, returning debug token.");
    } else {
        const parameter = {
          transaction_details: {
            order_id: order_id,
            gross_amount: Math.round(gross_amount),
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            first_name: first_name || "Guest",
            email: email || "guest@example.com",
          },
        };
        const transaction = await snap.createTransaction(parameter);
        token = transaction.token;
        redirect_url = transaction.redirect_url;
    }

    res.json({
      token,
      redirect_url,
    });
  } catch (error) {
    console.error("Midtrans Snap Error:", error);
    res.status(500).json({ error: "Failed to generate payment token" });
  }
});

// Helper for sending email
async function sendEmailNotification(to: string, subject: string, text: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'dummy_user',
      pass: process.env.SMTP_PASS || 'dummy_pass'
    }
  });

  if (process.env.SMTP_USER) {
    await transporter.sendMail({
      from: '"FiveInvitation" <noreply@fiveinvitation.com>',
      to,
      subject,
      text,
      html
    });
  } else {
    console.log(`[SIMULATED EMAIL to ${to}] Subject: ${subject}`);
  }
}

// 2. Midtrans Webhook Callback
app.post("/api/webhook/midtrans", async (req, res) => {
  try {
    const statusResponse = await snap.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Payment notification received. OrderId: ${orderId}, Status: ${transactionStatus}`);
    
    // Normal payment flow resolutions
    let status = 'PENDING';
    if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge'){
          status = 'CHALLENGE';
        } else if (fraudStatus == 'accept'){
          status = 'PAID';
        }
    } else if (transactionStatus == 'settlement') {
        status = 'PAID';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
        status = 'CANCELLED';
    } else if (transactionStatus == 'pending'){
        status = 'PENDING';
    }
    
    // Update Supabase DB order status
    try {
      if (supabaseUrl !== 'https://mock.supabase.co') {
        const { data: orderData } = await supabase.from('orders').select('*').eq('unique_code', orderId).single();
        
        await supabase.from('orders').update({ status }).eq('unique_code', orderId);

        // Send payment success email
        if (status === 'PAID' && orderData && orderData.status !== 'PAID' && orderData.customer_email) {
          await sendEmailNotification(
            orderData.customer_email,
            `Pembayaran Berhasil - Undangan ${orderData.groom_name} & ${orderData.bride_name}`,
            `Pembayaran untuk order ${orderId} telah berhasil. Anda sekarang dapat menyebarkan undangan Anda.`,
            `<p>Halo,</p><p>Pembayaran untuk pesanan undangan Anda dengan kode <strong>${orderId}</strong> telah berhasil.</p><p>Anda sekarang dapat melengkapi data dan menyebarkan undangan Anda.</p>`
          );
        }
      } else {
        if (status === 'PAID') {
           await sendEmailNotification(
            'customer@example.com',
            `Mock Pembayaran Berhasil - Order ${orderId}`,
            `Mock email: Pembayaran untuk order ${orderId} telah berhasil.`,
            `<p>Mock email: Pembayaran untuk order ${orderId} telah berhasil.</p>`
          );
        }
      }
    } catch(dbErr) {
       console.error("Failed to update status in Supabase:", dbErr);
    }

    res.status(200).json({ status: "OK", order_id: orderId, resolved_status: status });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});


// Daily / Hourly Cron Job for Payment Reminders (Orders pending > 24h)
cron.schedule('0 * * * *', async () => {
  console.log("Running hourly check for pending orders > 24 hours...");
  if (supabaseUrl === 'https://mock.supabase.co') return;
  
  // Real DB fetch
  const { data: overdueOrders } = await supabase
     .from('orders')
     .select('*')
     .eq('status', 'PENDING')
     .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (!overdueOrders || overdueOrders.length === 0) return;

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'dummy_user',
      pass: process.env.SMTP_PASS || 'dummy_pass'
    }
  });

  for (const order of overdueOrders) {
    try {
      if (process.env.SMTP_USER) {
        // Send email only if SMTP credentials are provided, else just log
        await transporter.sendMail({
          from: '"FiveInvitation" <noreply@fiveinvitation.com>',
          to: order.customer_email || 'customer@example.com',
          subject: `Pengingat Pembayaran Undangan: ${order.groom_name} & ${order.bride_name}`,
          text: `Halo, pesanan undangan dengan kode ${order.unique_code} Anda masih menunggu pembayaran. Segera selesaikan pembayaran agar link undangan Anda aktif.`,
          html: `<p>Halo,</p><p>Pesanan undangan dengan kode <strong>${order.unique_code}</strong> Anda masih menunggu pembayaran.</p><p>Segera selesaikan pembayaran agar link undangan Anda aktif.</p>`
        });
        console.log(`Reminder email sent successfully to ${order.customer_email} for order ${order.unique_code}`);
      } else {
        console.log(`[SIMULATED EMAIL] Reminder sent to ${order.customer_email || 'customer@example.com'} for pending order ${order.unique_code}`);
      }
    } catch (error) {
      console.error(`Failed to send reminder email to ${order.customer_email}:`, error);
    }
  }
});

// ==========================================
// VITE MIDDLEWARE / SPA FALLBACK
// ==========================================

async function setupServer() {
  // Catch-all API error handler to prevent HTML responses
  app.use('/api', (err: any, req: any, res: any, next: any) => {
    console.error("API Error caught:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  app.listen(portNumber, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${portNumber}`);
  });
}

setupServer();
