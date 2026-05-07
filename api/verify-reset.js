const SUPABASE_URL = 'https://ayyuetqyfjdbxmnqhgyz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Same hash function used in index.html
function hp(s){let h=0;for(let i=0;i<s.length;i++)h=(Math.imul(31,h)+s.charCodeAt(i))|0;return h.toString(36);}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, new_password } = req.body;
  if (!token || !new_password) return res.status(400).json({ error: 'Missing fields' });

  try {
    // Verify token
    const tokenRes = await fetch(
      `${SUPABASE_URL}/rest/v1/password_resets?token=eq.${token}&used=eq.false&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    const tokens = await tokenRes.json();
    if (!tokens.length) return res.status(400).json({ error: 'invalid_token' });

    const reset = tokens[0];

    // Check expiry
    if (new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: 'expired_token' });
    }

    // Hash new password using same algorithm as index.html
    const pw_hash = hp(new_password);

    // Update password in applications table
    await fetch(
      `${SUPABASE_URL}/rest/v1/applications?email=eq.${encodeURIComponent(reset.email)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pw_hash })
      }
    );

    // Mark token as used
    await fetch(
      `${SUPABASE_URL}/rest/v1/password_resets?id=eq.${reset.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ used: true })
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
