/**
 * Vercel Serverless Function: /api/log-signup
 * Dispatches registration telemetry securely from server-side.
 * The webhook URL is stored strictly in Vercel Environment Variables:
 * GOOGLE_SHEET_WEBHOOK_URL
 * (Never exposed to browser clients or public GitHub repositories!)
 */

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    // If not configured yet in Vercel environment variables, return silently without errors
    return res.status(200).json({ status: 'deferred', message: 'Webhook URL not configured in Vercel env' });
  }

  try {
    const payload = req.body || {};
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({ status: 'logged' });
  } catch (err) {
    // Fail gracefully so user signup is never interrupted
    return res.status(200).json({ status: 'error', error: err.message });
  }
};
