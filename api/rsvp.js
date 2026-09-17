export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // GET: Ambil semua data RSVP dari Supabase
  if (req.method === 'GET') {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({ error: 'Database belum dikonfigurasi' });
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rsvp?select=*&order=created_at.desc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (!response.ok) {
        console.error('Supabase fetch error:', await response.text());
        return res.status(502).json({ error: 'Gagal mengambil data RSVP' });
      }
      return res.status(200).json(await response.json());
    } catch (err) {
      console.error('Supabase fetch error:', err);
      return res.status(502).json({ error: 'Gagal menghubungi database RSVP' });
    }
  }

  // POST: Simpan data RSVP baru ke Supabase
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, guests, attend, msg } = body || {};
      const allowedAttendance = ['Hadir', 'Tidak Hadir', 'Masih Ragu'];

      if (typeof name !== 'string' || !name.trim() || name.trim().length > 200) {
        return res.status(400).json({ error: 'Nama wajib diisi' });
      }

      const guestCount = Number(guests);
      if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
        return res.status(400).json({ error: 'Jumlah tamu harus antara 1 dan 10' });
      }
      if (!allowedAttendance.includes(attend)) {
        return res.status(400).json({ error: 'Status kehadiran tidak valid' });
      }
      if (msg !== undefined && typeof msg !== 'string') {
        return res.status(400).json({ error: 'Ucapan tidak valid' });
      }

      if (!supabaseUrl || !supabaseKey) {
        return res.status(503).json({ error: 'Database belum dikonfigurasi' });
      }

      const newEntry = {
        name: name.trim(),
        guests: guestCount,
        attend: attend,
        msg: (msg || '').trim(),
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${supabaseUrl}/rest/v1/rsvp`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify([newEntry])
      });

      if (!response.ok) {
        console.error('Supabase insert error:', await response.text());
        return res.status(502).json({ error: 'Gagal menyimpan RSVP' });
      }

      const inserted = await response.json();
      return res.status(201).json(inserted[0] || newEntry);
    } catch (err) {
      console.error('POST /api/rsvp error:', err);
      return res.status(500).json({ error: 'Gagal memproses data RSVP' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
