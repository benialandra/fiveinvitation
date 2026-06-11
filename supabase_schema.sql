-- ==========================================
-- FIVEINVITATION WEDDING PLATFORM SCHEMA
-- SECURE VERSION (v2)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Orders Table
-- Menyimpan detail pesanan tanpa harus login.
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unique_code VARCHAR(20) UNIQUE NOT NULL, -- cth: INV-A1B2C
    theme_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',    -- PENDING, PAID, CANCELLED
    midtrans_token VARCHAR(255),
    
    -- Data Pasangan
    groom_name VARCHAR(100) NOT NULL,
    bride_name VARCHAR(100) NOT NULL,
    groom_parents VARCHAR(255),
    bride_parents VARCHAR(255),
    
    -- Acara
    akad_date TIMESTAMP WITH TIME ZONE,
    resepsi_date TIMESTAMP WITH TIME ZONE,
    location_name TEXT,
    maps_link TEXT,
    
    -- Extra
    story TEXT,
    music_url TEXT,
    slug VARCHAR(100) UNIQUE, -- cth: beni-salsa
    customer_email VARCHAR(255),
    cover_image TEXT,
    hero_image TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Guest Books Table
-- Menyimpan ucapan dari tamu
CREATE TABLE IF NOT EXISTS public.guest_books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. RSVP Table
-- Menyimpan konfirmasi kehadiran
CREATE TABLE IF NOT EXISTS public.rsvp (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    guest_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- ATTENDING, NOT_ATTENDING
    guest_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Themes Table
-- Menyimpan katalog tema
CREATE TABLE IF NOT EXISTS public.themes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    thumbnail TEXT,
    sales INTEGER DEFAULT 0,
    config_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- SECURITY: Policies are now restrictive by default
-- ==========================================

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies if they exist (for migration)
DO $$ BEGIN
  -- Themes
  DROP POLICY IF EXISTS "Enable insertions for everyone" ON public.themes;
  DROP POLICY IF EXISTS "Enable updates for everyone" ON public.themes;
  DROP POLICY IF EXISTS "Enable select for everyone" ON public.themes;
  DROP POLICY IF EXISTS "Enable deletions for everyone" ON public.themes;
  -- Orders
  DROP POLICY IF EXISTS "Enable insertions for everyone" ON public.orders;
  DROP POLICY IF EXISTS "Enable updates for everyone based on code" ON public.orders;
  DROP POLICY IF EXISTS "Enable select for everyone" ON public.orders;
  -- Guest Books
  DROP POLICY IF EXISTS "Enable insertions for everyone" ON public.guest_books;
  DROP POLICY IF EXISTS "Enable select for everyone" ON public.guest_books;
  -- RSVP
  DROP POLICY IF EXISTS "Enable insertions for everyone" ON public.rsvp;
  DROP POLICY IF EXISTS "Enable select for everyone" ON public.rsvp;
END $$;

-- ==========================================
-- THEMES RLS: Public read-only, mutations via service_role/server only
-- ==========================================
CREATE POLICY "themes_select_public" ON public.themes 
  FOR SELECT USING (true);

CREATE POLICY "themes_insert_service" ON public.themes 
  FOR INSERT WITH CHECK (
    current_setting('role', true) = 'service_role'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

CREATE POLICY "themes_update_service" ON public.themes 
  FOR UPDATE USING (
    current_setting('role', true) = 'service_role'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

CREATE POLICY "themes_delete_service" ON public.themes 
  FOR DELETE USING (
    current_setting('role', true) = 'service_role'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ==========================================
-- ORDERS RLS: Public can read & insert, updates via service_role only
-- ==========================================
CREATE POLICY "orders_select_public" ON public.orders 
  FOR SELECT USING (true);

CREATE POLICY "orders_insert_public" ON public.orders 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_update_service" ON public.orders 
  FOR UPDATE USING (
    current_setting('role', true) = 'service_role'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ==========================================
-- GUEST BOOKS RLS: Public can read & insert (for wedding guests)
-- ==========================================
CREATE POLICY "guestbooks_select_public" ON public.guest_books 
  FOR SELECT USING (true);

CREATE POLICY "guestbooks_insert_public" ON public.guest_books 
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- RSVP RLS: Public can read & insert (for wedding guests)
-- ==========================================
CREATE POLICY "rsvp_select_public" ON public.rsvp 
  FOR SELECT USING (true);

CREATE POLICY "rsvp_insert_public" ON public.rsvp 
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- INDEXES for better query performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_orders_unique_code ON public.orders(unique_code);
CREATE INDEX IF NOT EXISTS idx_orders_slug ON public.orders(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guest_books_order_id ON public.guest_books(order_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_order_id ON public.rsvp(order_id);

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
-- Agar guestbook update secara realtime, pastikan untuk mengaktifkan publication:
-- ALTER PUBLICATION supabase_realtime ADD TABLE guest_books;
-- ALTER PUBLICATION supabase_realtime ADD TABLE rsvp;
