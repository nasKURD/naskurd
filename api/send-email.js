module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }

  const { type, twitter, name, email, country, region } = req.body;

  let subject, html, to;

  if (type === 'new_application') {
    to = 'kurdnasname@gmail.com';
    subject = `nasKURD — Serlêdana nû: @${twitter}`;
    html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#020B18;color:#eee;border-radius:12px;overflow:hidden">
        <div style="height:4px;background:linear-gradient(90deg,#C8202A,#F5C518 50%,#1B7040)"></div>
        <div style="padding:24px">
          <h2 style="color:#C4A24C;margin:0 0 16px">☀️ nasKURD — Serlêdana Nû</h2>
          <p style="color:#aaa;margin:0 0 16px">Serlêdaneke nû hat. Agahiyên jêrîn binêre:</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#C4A24C;width:120px">X/Twitter</td><td style="padding:8px 0">@${twitter}</td></tr>
            <tr><td style="padding:8px 0;color:#C4A24C">Nav</td><td style="padding:8px 0">${name || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#C4A24C">Welat</td><td style="padding:8px 0">${country || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#C4A24C">Herêm</td><td style="padding:8px 0">${region || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#C4A24C">E-mail</td><td style="padding:8px 0">${email || '—'}</td></tr>
          </table>
          <div style="margin-top:20px">
            <a href="https://rojtevkurdi.vercel.app/admin" style="background:linear-gradient(90deg,#C8202A,#C4A24C 50%,#1B7040);color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">Admin Panelê Veke →</a>
          </div>
        </div>
        <div style="height:4px;background:linear-gradient(90deg,#1B7040,#F5C518 50%,#C8202A)"></div>
      </div>
    `;
  } else if (type === 'approved') {
    to = email;
    subject = `nasKURD — Serlêdana te hat erêkirin! ✅`;
    html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#020B18;color:#eee;border-radius:12px;overflow:hidden">
        <div style="height:4px;background:linear-gradient(90deg,#C8202A,#F5C518 50%,#1B7040)"></div>
        <div style="padding:24px;text-align:center">
          <h2 style="color:#4EC87A;margin:0 0 8px">✅ Hûn û Kurdistan her hebin!</h2>
          <p style="color:#C4A24C;font-size:18px;font-weight:700;margin:0 0 16px">@${twitter}</p>
          <p style="color:#aaa;margin:0 0 20px">Serlêdana te hat erêkirin. Niha dikari bi hesabê xwe yê X/Twitter ketî nasKURD û nasnameya xwe ya dîjîtal bibîni.</p>
          <a href="https://naskurd.com" style="background:linear-gradient(90deg,#C8202A,#C4A24C 50%,#1B7040);color:#000;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">nasKURD.com — Têkeve →</a>
          <p style="color:rgba(196,162,76,.4);font-size:10px;margin-top:24px">@rojtevkurdi · @torakurdakurdi · @_nasKURD</p>
        </div>
        <div style="height:4px;background:linear-gradient(90deg,#1B7040,#F5C518 50%,#C8202A)"></div>
      </div>
    `;
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'nasKURD <onboarding@resend.dev>',
        to: [to],
        subject,
        html
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
