export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { code, client_id, client_secret } = req.body;
  if (!code || !client_id || !client_secret) return res.status(400).json({ error: 'Missing fields' });
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, client_secret, code, grant_type: 'authorization_code' }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || 'Failed' });
    return res.status(200).json({ access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}