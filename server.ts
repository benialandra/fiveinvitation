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
import crypto from "crypto";

dotenv.config();

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
} else if (fs.existsSync(".env.example")) {
  dotenv.config({ path: ".env.example" });
}

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// SECURITY: Rate Limiting (in-memory)
// ==========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60;      // 60 requests per minute per IP
const RATE_LIMIT_AUTH_MAX = 5;            // 5 login attempts per minute

function rateLimiter(maxRequests: number = RATE_LIMIT_MAX_REQUESTS) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    entry.count++;
    return next();
  };
}

// Clean up rate limit map every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(key);
  }
}, 5 * 60 * 1000);

// ==========================================
// SECURITY: Admin Session Management
// ==========================================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSWORD) {
  console.error("CRITICAL: ADMIN_PASSWORD is not set in environment variables!");
  process.exit(1);
}
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
const adminSessions = new Map<string, { createdAt: number; expiresAt: number }>();
const otpStore = new Map<string, { otp: string; expiresAt: number }>();
const ADMIN_SESSION_TTL = 4 * 60 * 60 * 1000; // 4 hours



function generateAdminToken(): string {
  const payload = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
  const hmac = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

function validateAdminToken(token: string): boolean {
  const session = adminSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}

// Clean up expired sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of adminSessions.entries()) {
    if (now > session.expiresAt) adminSessions.delete(token);
  }
}, 30 * 60 * 1000);

// Admin auth middleware — validates Bearer token in Authorization header
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }
  const token = authHeader.slice(7);
  if (!validateAdminToken(token)) {
    return res.status(401).json({ error: "Unauthorized: Token expired or invalid" });
  }
  next();
}

// ==========================================
// SECURITY HEADERS
// ==========================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Enable JSON parsing
app.use(express.json({ limit: '2mb' }));

// Apply general rate limiting to all API routes
app.use('/api', rateLimiter(RATE_LIMIT_MAX_REQUESTS));

// Multer Setup with file size and type restrictions
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
      cb(null, Date.now() + '-' + safeName);
    }
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed. Only images (JPEG, PNG, WebP, GIF) are accepted.`));
    }
  }
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

// Admin Login Endpoint (server-side authentication)
app.post("/api/admin/login", rateLimiter(RATE_LIMIT_AUTH_MAX), (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Password salah." });
  }
  const token = generateAdminToken();
  const now = Date.now();
  adminSessions.set(token, { createdAt: now, expiresAt: now + ADMIN_SESSION_TTL });
  return res.json({ success: true, token, expiresIn: ADMIN_SESSION_TTL });
});

// Admin Logout Endpoint
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    adminSessions.delete(authHeader.slice(7));
  }
  return res.json({ success: true });
});

// Admin Session Validation Endpoint
app.get("/api/admin/session", requireAdmin, (req, res) => {
  return res.json({ authenticated: true });
});

// Seed Themes Endpoint (Initial manual seeding to Supabase)
// PROTECTED: requires admin authentication
app.post("/api/admin/themes/seed", requireAdmin, async (req, res) => {
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

import NodeCache from "node-cache";
const themeCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // Cache for 1 hour

// Fetch all Themes Endpoint
app.get("/api/themes", async (req, res) => {
  try {
    if (supabaseUrl === 'https://mock.supabase.co') return res.json([]);
    
    // Check Cache
    const cachedThemes = themeCache.get("all_themes");
    if (cachedThemes) {
      return res.json(cachedThemes);
    }
    
    const { data, error } = await supabase.from('themes').select('*').order('created_at', { ascending: false });
    if (error) {
       console.error("Supabase fetch error:", error);
       return res.json([]);
    }
    
    if (data) {
       themeCache.set("all_themes", data);
    }
    res.json(data || []);
  } catch (err) {
    console.error("Failed to fetch themes:", err);
    res.json([]);
  }
});

// Fetch single theme endpoint
app.get("/api/themes/:id", async (req, res) => {
  try {
    if (supabaseUrl === 'https://mock.supabase.co') return res.status(404).json({error: "Mock database"});
    const { data, error } = await supabase.from('themes').select('*').eq('id', req.params.id).single();
    if (error) {
       return res.status(404).json({error: "Theme not found", details: error.message});
    }
    res.json(data);
  } catch (err: any) {
    console.error("Failed to fetch single theme:", err);
    res.status(500).json({error: err.message});
  }
});

// Create Theme Endpoint
// PROTECTED: requires admin authentication
app.post("/api/admin/themes", requireAdmin, upload.fields([{ name: 'zipFile', maxCount: 1 }, { name: 'images', maxCount: 5 }]), async (req: any, res: any) => {
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
    themeCache.del("all_themes");
    return res.json({ success: true, theme: data });
  } catch (err: any) {
    console.error("Failed to create theme:", err);
    return res.status(500).json({ error: err.message });
  }
});

// SECURITY: Upload TSX endpoint has been REMOVED.
// Uploading arbitrary code files to the server is a Remote Code Execution (RCE) vulnerability.
// Theme components should be added via Git commits and proper CI/CD pipelines.
app.post("/api/admin/themes/upload-component", (req: any, res: any) => {
  return res.status(403).json({ 
    error: "This endpoint has been disabled for security reasons. Add theme components via Git." 
  });
});

// PROTECTED: requires admin authentication
app.put("/api/admin/themes/:id", requireAdmin, upload.fields([{ name: 'thumbnailFile', maxCount: 1 }, { name: 'images', maxCount: 5 }]), async (req: any, res: any) => {
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

    const { data: dbData, error } = await supabase.from('themes').update(updatePayload).eq('id', id).select();
    
    if (error) throw error;
    
    themeCache.del("all_themes");
    
    const returnedTheme = dbData && dbData.length > 0 ? dbData[0] : { id, ...updatePayload };
    return res.json({ success: true, thumbnail: finalThumbnail, theme: returnedTheme });
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
      akad_date, resepsi_date, location_name, maps_link, story, music_url, slug, cover_image, hero_image,
      customizations
    } = req.body;

    console.log("PUT order body raw customizations:", customizations);

    let updateData: any = {
      groom_name, bride_name, groom_parents, bride_parents, 
      location_name, maps_link, story, music_url, slug, cover_image, hero_image,
      customizations: customizations ? (typeof customizations === 'string' ? JSON.parse(customizations) : customizations) : null
    };

    console.log("PUT order updateData:", updateData);

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

// ==========================================
// OTP VALIDATION ENDPOINTS
// ==========================================

// Send OTP to email
app.post("/api/otp/send-email", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "Email tidak valid." });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  otpStore.set(email, { otp, expiresAt });

  try {
    if (process.env.SMTP_USER) {
      await sendEmailNotification(
        email,
        "Kode OTP Verifikasi - FiveInvitation",
        `Kode OTP Anda adalah: ${otp}. Kode ini berlaku selama 5 menit.`,
        `<div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Verifikasi Email Anda</h2>
          <p>Gunakan kode OTP berikut untuk melanjutkan pesanan Anda:</p>
          <h1 style="color: #C5A059; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          <p>Kode ini hanya berlaku selama 5 menit.</p>
        </div>`
      );
    } else {
      console.log(`[DEV MODE] Simulated OTP for ${email}: ${otp}`);
    }
    return res.json({ success: true, message: "OTP terkirim." });
  } catch (error: any) {
    console.error("Gagal mengirim OTP:", error);
    return res.status(500).json({ error: "Gagal mengirim email OTP. Pastikan konfigurasi SMTP benar." });
  }
});

// Verify OTP
app.post("/api/otp/verify", (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ error: "Kode OTP tidak ditemukan atau belum dikirim." });
  }
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: "Kode OTP sudah kedaluwarsa. Silakan kirim ulang." });
  }
  if (stored.otp !== otp) {
    return res.status(400).json({ error: "Kode OTP salah." });
  }

  // Valid
  otpStore.delete(email);
  return res.json({ success: true, message: "Email berhasil diverifikasi." });
});

app.post("/api/order/create", async (req, res) => {
  try {
    const { order_id, gross_amount, first_name, email, theme_id, groom_name, bride_name, customizations } = req.body;
    
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
           customer_email: email,
           is_email_verified: true, // Assuming they verified via OTP to reach here
           customizations: customizations || null
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
        const appUrl = process.env.VITE_APP_URL || "http://localhost:3000";
        const isLocalhost = appUrl.includes('localhost') || appUrl.includes('127.0.0.1');
        
        const parameter: any = {
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
          }
        };

        if (!isLocalhost) {
          parameter.callbacks = {
            finish: `${appUrl}/track`,
            error: `${appUrl}/track`,
            pending: `${appUrl}/track`
          };
        }

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

// 2. Midtrans Webhook Callback (with signature verification)
app.post("/api/webhook/midtrans", async (req, res) => {
  try {
    // SECURITY: Verify Midtrans webhook signature
    const serverKey = processMidtransServerKey.replace(/^["']|["']$/g, '');
    if (serverKey && serverKey !== 'dummy_server_key' && req.body.signature_key) {
      const { order_id, status_code, gross_amount, signature_key } = req.body;
      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest('hex');
      if (signature_key !== expectedSignature) {
        console.error(`Webhook signature mismatch for order ${order_id}`);
        return res.status(403).json({ error: "Invalid webhook signature" });
      }
    }

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
    app.use(express.static(distPath, { index: false })); // Disable default index.html serving
    app.get("*", async (req, res) => {
      try {
        let html = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
        const match = req.path.match(/^\/([^\/]+)$/);
        const ignoreList = ['admin', 'order', 'track', 'preview', 'themes', 'privacy-policy', 'terms-of-service', 'api'];
        if (match && !ignoreList.includes(match[1])) {
           const slug = match[1];
           if (supabaseUrl !== 'https://mock.supabase.co') {
             const { data: orderData } = await supabase.from('orders').select('groom_name, bride_name, cover_image').eq('slug', slug).single();
             if (orderData) {
                 html = html.replace(/<title>.*?<\/title>/, `<title>Undangan Pernikahan ${orderData.groom_name} & ${orderData.bride_name}</title>`);
                 html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="Undangan Pernikahan ${orderData.groom_name} & ${orderData.bride_name}" />`);
                 if (orderData.cover_image) {
                     const appUrl = process.env.VITE_APP_URL || "https://fiveinvitation.com";
                     const fullImage = orderData.cover_image.startsWith('http') ? orderData.cover_image : `${appUrl}${orderData.cover_image}`;
                     html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${fullImage}" />`);
                     html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${fullImage}" />`);
                 }
             }
           }
        }
        res.send(html);
      } catch (err) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  app.listen(portNumber, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${portNumber}`);
  });
}

setupServer();
