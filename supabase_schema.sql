-- Jalankan query ini di menu "SQL Editor" pada dashboard Supabase Anda:

-- 1. Buat tabel RSVP
CREATE TABLE IF NOT EXISTS rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  guests INTEGER DEFAULT 1 CONSTRAINT rsvp_guests_range CHECK (guests BETWEEN 1 AND 10),
  attend TEXT NOT NULL CONSTRAINT rsvp_attend_values CHECK (attend IN ('Hadir', 'Tidak Hadir', 'Masih Ragu')),
  msg TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Terapkan constraint juga jika tabel sudah dibuat sebelumnya.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rsvp_guests_range') THEN
    ALTER TABLE rsvp ADD CONSTRAINT rsvp_guests_range CHECK (guests BETWEEN 1 AND 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rsvp_attend_values') THEN
    ALTER TABLE rsvp ADD CONSTRAINT rsvp_attend_values CHECK (attend IN ('Hadir', 'Tidak Hadir', 'Masih Ragu'));
  END IF;
END $$;

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- 3. Izinkan pembacaan data untuk publik (siapapun bisa melihat daftar ucapan & kehadiran)
DROP POLICY IF EXISTS "Public Read RSVP" ON rsvp;
CREATE POLICY "Public Read RSVP" ON rsvp
  FOR SELECT
  USING (true);

-- 4. Izinkan tamu untuk mengirimkan data RSVP & Ucapan
DROP POLICY IF EXISTS "Public Insert RSVP" ON rsvp;
CREATE POLICY "Public Insert RSVP" ON rsvp
  FOR INSERT
  WITH CHECK (true);
