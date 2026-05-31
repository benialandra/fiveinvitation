-- ==========================================
-- ETERNA WEDDING INVITATION PLATFORM SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Orders Table
-- Menyimpan detail pesanan tanpa harus login.
CREATE TABLE public.orders (
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
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Guest Books Table
-- Menyimpan ucapan dari tamu
CREATE TABLE public.guest_books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. RSVP Table
-- Menyimpan konfirmasi kehadiran
CREATE TABLE public.rsvp (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    guest_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- ATTENDING, NOT_ATTENDING
    guest_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;

-- Orders RLS (Public read for tracking/published, Public insert for new orders)
CREATE POLICY "Enable insertions for everyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable updates for everyone based on code" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Enable select for everyone" ON public.orders FOR SELECT USING (true);

-- Guest Books RLS
CREATE POLICY "Enable insertions for everyone" ON public.guest_books FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for everyone" ON public.guest_books FOR SELECT USING (true);

-- RSVP RLS
CREATE POLICY "Enable insertions for everyone" ON public.rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for everyone" ON public.rsvp FOR SELECT USING (true);

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
-- Agar guestbook update secara realtime, pastikan untuk mengaktifkan publication:
-- alter publication supabase_realtime add table guest_books;
