const origin = 'https://ricky-orange.github.io';

export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
      'Vary': 'Origin'
    };
    const json = (body, status) => Response.json(body, { status, headers });
    if (new URL(request.url).pathname !== '/search') return json({ error: 'Not found' }, 404);
    if (request.headers.get('Origin') !== origin) return json({ error: 'Forbidden' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    if (!env.BP_API_SECRET || !env.APPS_SCRIPT_URL) return json({ error: 'Service unavailable' }, 503);

    let query;
    try {
      query = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
    if (typeof query?.id !== 'string' || typeof query?.name !== 'string') {
      return json({ error: 'Invalid query' }, 400);
    }
    const id = query.id.trim();
    const name = query.name.trim();
    if ((!id && !name) || id.length > 100 || name.length > 100 || name.length === 1) {
      return json({ error: 'Invalid query' }, 400);
    }

    try {
      const upstream = await fetch(env.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, secret: env.BP_API_SECRET }),
        signal: AbortSignal.timeout(15000)
      });
      if (!upstream.ok) return json({ error: 'Search failed' }, 502);
      const data = await upstream.json();
      if (!Array.isArray(data.rows)) return json({ error: 'Search failed' }, 502);
      return json(data, 200);
    } catch {
      return json({ error: 'Search failed' }, 502);
    }
  }
};
