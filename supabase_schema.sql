-- Jalankan query ini di menu "SQL Editor" pada dashboard Supabase Anda:

-- 1. Buat tabel RSVP
CREATE TABLE IF NOT EXISTS rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  guests INTEGER DEFAULT 1,
  attend TEXT NOT NULL,
  msg TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- 3. Izinkan pembacaan data untuk publik (siapapun bisa melihat daftar ucapan & kehadiran)
CREATE POLICY "Public Read RSVP" ON rsvp
  FOR SELECT
  USING (true);

-- 4. Izinkan tamu untuk mengirimkan data RSVP & Ucapan
CREATE POLICY "Public Insert RSVP" ON rsvp
  FOR INSERT
  WITH CHECK (true);
