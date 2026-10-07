const GOOGLE_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQHcYv-r8uosvEI4amr5_wL6wlnbE156MxZfi0mPpVDYLwXVbSg7POJgpuWSPaP2Q6-ayW4TY2XLRe5/pub?gid=2145433271&single=true&output=csv';

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const separator = GOOGLE_CSV.includes('?') ? '&' : '?';
    const sourceUrl = `${GOOGLE_CSV}${separator}_=${Date.now()}`;

    const response = await fetch(sourceUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/csv,text/plain;q=0.9,*/*;q=0.8',
        'User-Agent': 'Fostra-Leads-Dashboard/1.0'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Google returned HTTP ${response.status}`);
    }

    const csv = await response.text();

    if (!csv.includes('date_from') || !csv.includes('week') || !csv.includes('applications')) {
      throw new Error('Unexpected Google CSV response');
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Fostra Leads API error:', error);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({
      error: 'Unable to load Fostra Leads data',
      detail: error instanceof Error ? error.message : String(error)
    });
  }
};
