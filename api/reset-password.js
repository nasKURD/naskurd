const SUPABASE_URL = 'https://ayyuetqyfjdbxmnqhgyz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    // Kullanıcı var mı kontrol et
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/applications?email=eq.${encodeURIComponent(email)}&status=eq.approved&select=email,twitter`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const users = await checkRes.json();
    if (!users.length) return res.status(404).json({ error: 'not_found' });

    const twitter = users[0].twitter;

    // Token oluştur
    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 saat

    // Token'ı Supabase'e kaydet
    await fetch(`${SUPABASE_URL}/rest/v1/password_resets`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, token, expires_at })
    });

    // Email gönder
    const resetLink = `https://naskurd.com/?reset=${token}`;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'nasKURD <noreply@naskurd.com>',
        to: [email],
        subject: 'nasKURD — Şîfreya xwe ji nû ve saz bike',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#020B18;color:#eee;border-radius:12px;overflow:hidden">
            <div style="height:4px;background:linear-gradient(90deg,#C8202A,#F5C518 50%,#1B7040)"></div>
            <div style="padding:24px;text-align:center">
              <h2 style="color:#C4A24C;margin:0 0 8px">🔑 Şîfreya Nû</h2>
              <p style="color:#C4A24C;font-size:16px;font-weight:700;margin:0 0 16px">@${twitter}</p>
              <p style="color:#aaa;margin:0 0 20px">Ji bo şîfreya xwe ji nû ve saz bikî, li ser bişkoja jêrîn bitikîne. Ev girêdan tenê 1 saetê derbasdar e.</p>
              <a href="${resetLink}" style="background:linear-gradient(90deg,#C8202A,#C4A24C 50%,#1B7040);color:#000;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">Şîreya xwe ji nû ve saz bike →</a>
              <p style="color:rgba(196,162,76,.4);font-size:10px;margin-top:24px">@rojtevkurdi · @torakurdakurdi · @_nasKURD</p>
            </div>
            <div style="height:4px;background:linear-gradient(90deg,#1B7040,#F5C518 50%,#C8202A)"></div>
          </div>
        `
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
