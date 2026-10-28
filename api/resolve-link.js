export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.query?.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const finalUrl = response.url || url;
    const html = await response.text();

    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                         html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
    const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                         html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);

    let rawTitle = ogTitleMatch?.[1] || titleTagMatch?.[1] || '';
    let cleanTitle = rawTitle
      .replace(/\s*\|\s*Daraz\.lk.*$/i, '')
      .replace(/\s*\|\s*Daraz\s+Sri Lanka.*$/i, '')
      .replace(/\s*-\s*Buy at best price.*$/i, '')
      .replace(/^Buy\s+/i, '')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .trim();

    let slugTitle = '';
    try {
      const finalParsed = new URL(finalUrl);
      const pathParts = finalParsed.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1] || '';
      const match = lastPart.match(/^([a-z0-9\-]+)-i\d+/i);
      if (match && match[1]) {
        slugTitle = match[1]
          .split('-')
          .filter((s) => s.length > 0 && !s.match(/^\d+$/))
          .slice(0, 11)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
      }
    } catch (e) {}

    const resolvedTitle = cleanTitle || slugTitle || '';
    const imageUrl = ogImageMatch?.[1] || '';

    return res.status(200).json({
      success: true,
      finalUrl,
      title: resolvedTitle,
      imageUrl
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: err.message
    });
  }
}
