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
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  // GET: Ambil semua data RSVP dari Supabase
  if (req.method === 'GET') {
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rsvp?select=*&order=created_at.desc`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return res.status(200).json(data);
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    }

    // Empty fallback until Supabase is connected and receives new RSVPs.
    return res.status(200).json([]);
  }

  // POST: Simpan data RSVP baru ke Supabase
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, guests, attend, msg } = body || {};

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Nama wajib diisi' });
      }

      const newEntry = {
        name: name.trim(),
        guests: parseInt(guests, 10) || 1,
        attend: attend || 'Hadir',
        msg: (msg || '').trim(),
        created_at: new Date().toISOString()
      };

      if (supabaseUrl && supabaseKey) {
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

        if (response.ok) {
          const inserted = await response.json();
          return res.status(201).json(inserted[0] || newEntry);
        } else {
          const errText = await response.text();
          console.error('Supabase insert error:', errText);
        }
      }

      // Fallback jika belum dihubungkan ke Supabase (misal testing lokal)
      return res.status(201).json({ id: 'local-' + Date.now(), ...newEntry });
    } catch (err) {
      console.error('POST /api/rsvp error:', err);
      return res.status(500).json({ error: 'Gagal memproses data RSVP' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
