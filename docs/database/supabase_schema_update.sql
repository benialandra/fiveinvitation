-- Supabase Schema Update for Stateless Backend Migration
-- Execute this script in your Supabase SQL Editor

-- 1. Create table for Admin Sessions
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    token TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Protect the admin_sessions table from public access
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
-- No public policies created. Only the backend (via Service Role or Anon with restricted access) can manage this.

-- 2. Create table for OTP Store
CREATE TABLE IF NOT EXISTS public.otp_store (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Protect the otp_store table from public access
ALTER TABLE public.otp_store ENABLE ROW LEVEL SECURITY;
-- No public policies created.

-- 3. Important Notes on Orders and RSVP Tables
-- Since the frontend now fetches order/invitation data via the `/api/public-invitation/:slug` endpoint,
-- you can safely lock down the `orders` table so public users cannot SELECT all orders using the anon_key.
-- If you haven't enabled RLS on `orders`, run:
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- If your backend uses the anon_key (not the service_role key), it will need to bypass RLS for its operations,
-- or you must create policies that allow SELECT on `orders` for the public, which we want to avoid.
-- We recommend using the `SUPABASE_SERVICE_ROLE_KEY` in your `.env` for the Node.js server.

-- 4. Database Structure & Integrity Fixes
-- The following fixes address missing foreign keys and type mismatches.
ALTER TABLE public.orders ALTER COLUMN theme_id TYPE VARCHAR(100);
ALTER TABLE public.orders ADD CONSTRAINT fk_orders_theme_id FOREIGN KEY (theme_id) REFERENCES public.themes(id) ON DELETE RESTRICT;
