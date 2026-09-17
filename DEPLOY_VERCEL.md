# Panduan Menghubungkan Database Supabase ke Vercel

Undangan pernikahan ini sudah siap di-deploy ke **Vercel** dengan backend database **Supabase** (100% Gratis).

---

### Langkah 1: Buat Proyek & Tabel di Supabase (2 Menit)

1. Buka [https://supabase.com](https://supabase.com) dan login/daftar gratis.
2. Klik **New Project**, beri nama (contoh: `wedding-invitation`), masukkan password database, dan pilih region terdekat (misal: `Singapore`).
3. Setelah proyek siap, buka menu **SQL Editor** di sidebar kiri.
4. Buka file `supabase_schema.sql` di proyek ini, salin semua isinya, tempel di SQL Editor Supabase, lalu klik **Run**.
5. Tabel `rsvp` beserta kebijakan keamanan publik (RLS) berhasil dibuat!

> Jalankan file SQL ini setelah perubahan terbaru agar validasi jumlah tamu dan status kehadiran ikut diterapkan. Jumlah entri ucapan tidak dibatasi oleh aplikasi.

---

### Langkah 2: Ambil URL & Kunci API Supabase

1. Di dashboard Supabase, klik ikon gerigi **Project Settings** (di kiri bawah).
2. Pilih tab **API**.
3. Salin dua nilai berikut:
   - **Project URL** (contoh: `https://xyzproject.supabase.co`)
   - **anon / public key** (kunci panjang `eyJhbGci...`)

---

### Langkah 3: Deploy ke Vercel

#### Jika Deploy via GitHub:
1. Push proyek ini ke GitHub Anda.
2. Buka [https://vercel.com](https://vercel.com) dan klik **Add New Project** -> pilih repositori Anda.
3. Pada bagian **Environment Variables**, tambahkan 2 variabel:
   - `SUPABASE_URL` = (Project URL Anda)
   - `SUPABASE_ANON_KEY` = (anon public key Anda)
4. Klik **Deploy**!

> Jangan masukkan `SUPABASE_SERVICE_ROLE_KEY`. Endpoint publik ini hanya menggunakan `SUPABASE_ANON_KEY`.

#### Jika Deploy via Vercel CLI:
Jalankan perintah berikut di terminal:
```bash
npm i -g vercel
vercel
```
Lalu tambahkan environment variable di menu Project Settings -> Environment Variables pada dashboard Vercel.

---

### Fitur yang Sudah Disediakan:
- **Tampilan UI Serasi**: Kartu ucapan, badge kehadiran, dan statistik kini tampil serasi dengan tema mewah Bali (aesthetic paper & monochrome borders).
- **Endpoint Serverless Vercel (`/api/rsvp`)**:
  - `GET /api/rsvp`: Mengambil data kehadiran & ucapan tamu secara realtime dari Supabase.
  - `POST /api/rsvp`: Menyimpan konfirmasi kehadiran & ucapan baru ke Supabase.
- **Validasi RSVP**: Data hanya dianggap berhasil setelah Supabase mengonfirmasi penyimpanan. Ucapan dapat dikirim sebanyak-banyaknya tanpa batas jumlah entri dari aplikasi.
- **Dashboard Tamu**: Mempelai dapat membuka menu **Table Editor** -> `rsvp` di Supabase untuk melihat, memfilter, atau mengunduh (export to CSV/Excel) seluruh daftar tamu yang hadir.
