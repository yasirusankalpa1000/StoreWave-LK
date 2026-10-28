import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function resolveLinkPlugin() {
  return {
    name: 'resolve-link-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/resolve-link', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const targetUrl = urlObj.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing url parameter' }));
            return;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);

          const response = await fetch(targetUrl, {
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9'
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          const finalUrl = response.url || targetUrl;
          const html = await response.text();

          // Extract title, og:title, og:image, link rel="origin", link rel="canonical"
          const originMatch = html.match(/<link\s+rel=["'](?:origin|canonical)["']\s+href=["']([^"']+)["']/i) ||
                              html.match(/<link\s+href=["']([^"']+)["']\s+rel=["'](?:origin|canonical)["']/i);
          const canonicalUrl = originMatch?.[1] || finalUrl;

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

          // Check if canonicalUrl has product slug
          let slugTitle = '';
          try {
            const finalParsed = new URL(canonicalUrl);
            const pathParts = finalParsed.pathname.split('/');
            const lastPart = pathParts[pathParts.length - 1] || '';
            const match = lastPart.match(/^([a-z0-9\-]+)-i\d+/i);
            if (match && match[1]) {
              slugTitle = match[1]
                .split('-')
                .filter((s: string) => s.length > 0 && !s.match(/^\d+$/))
                .slice(0, 11)
                .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(' ');
            }
          } catch (e) {}

          const resolvedTitle = cleanTitle || slugTitle || '';
          const imageUrl = ogImageMatch?.[1] || '';

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            finalUrl,
            title: resolvedTitle,
            imageUrl
          }));
        } catch (err: any) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: false,
            error: err.message
          }));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), resolveLinkPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
