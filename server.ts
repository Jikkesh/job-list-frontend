import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

function generateSitemapXml(urls: string[]): string {
  const xmlUrls = urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmlUrls}
  </urlset>`;
}

async function getJobUrls(): Promise<string[]> {
  return [
    'https://jobsai.in/jobs/fresher',
    'https://jobsai.in/jobs/internship',
    'https://jobsai.in/jobs/experienced',
    'https://jobsai.in/jobs/remote',
  ];
}


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  const staticOpts = {
    index: false,
    setHeaders(res: any, filePath: string) {
      if (/\.(js|css|png|jpg|svg|ico|webp)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  };

  // Middleware to handle static files and cache control
  server.use((req, res, next) => {
    if (req.path.endsWith('.html') || req.path === '/') {
      return next();
    }
    // serve all other files if they exist on disk
    express.static(browserDistFolder, staticOpts)(req, res, next);
  });

  // 2) No‐cache middleware for any HTML (SSR) request
  server.use((req, res, next) => {
    if (!req.path.includes('.') || req.path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  });

  // server.get('/favicon.ico', (_req, res) =>
  //   res.sendFile(join(browserDistFolder, 'favicon.ico'))
  // );

  server.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://jobsai.in/sitemap-jobs.xml</loc>
  </sitemap>
</sitemapindex>`);
  });


  server.get('/sitemap-jobs.xml', async (req, res) => {
    const urls = await getJobUrls();
    res.setHeader('Content-Type', 'application/xml');
    res.send(generateSitemapXml(urls));
  });

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: 'CACHE_BUSTER', useValue: Date.now() },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = 4000;
  const host = '0.0.0.0';

  // Start up the Node server
  const server = app();
  server.listen(port, host, () => {
    console.log(`Node Express server listening on http://${host}:${port}`);
  });
}

run();
