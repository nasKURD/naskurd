module.exports = async function handler(req, res) {
  const { code, state, error } = req.query;

  // Handle Twitter error
  if (error) {
    return res.writeHead(302, { Location: '/?tw_error=access_denied' }), res.end();
  }

  // Parse cookies
  const cookies = {};
  (req.headers.cookie || '').split(';').forEach(c => {
    const [k, v] = c.trim().split('=');
    if (k) cookies[k] = v;
  });

  // Verify state
  if (!state || state !== cookies['oauth_state']) {
    return res.writeHead(302, { Location: '/?tw_error=state_mismatch' }), res.end();
  }

  const codeVerifier = cookies['code_verifier'];
  if (!codeVerifier) {
    return res.writeHead(302, { Location: '/?tw_error=no_verifier' }), res.end();
  }

  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const redirectUri = process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/api/auth/callback/twitter`
    : 'https://naskurd.com/api/auth/callback/twitter';

  try {
    // Exchange code for access token
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Token error:', tokenData);
      return res.writeHead(302, { Location: '/?tw_error=token_failed' }), res.end();
    }

    // Get Twitter user info
    const userRes = await fetch('https://api.twitter.com/2/users/me?user.fields=username,name,profile_image_url', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userData = await userRes.json();

    if (!userData.data || !userData.data.username) {
      return res.writeHead(302, { Location: '/?tw_error=user_failed' }), res.end();
    }

    const username = userData.data.username;

    // Clear state cookies, redirect with verified handle
    res.setHeader('Set-Cookie', [
      'oauth_state=; HttpOnly; Secure; Path=/; Max-Age=0',
      'code_verifier=; HttpOnly; Secure; Path=/; Max-Age=0'
    ]);

    res.writeHead(302, { Location: `/?tw_handle=${encodeURIComponent(username)}&tw_verified=1` });
    res.end();

  } catch (err) {
    console.error('OAuth callback error:', err);
    res.writeHead(302, { Location: '/?tw_error=server_error' });
    res.end();
  }
};
