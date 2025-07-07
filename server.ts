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

  // Add logging to debug
  server.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.path}`);
    next();
  });

  // EXPLICIT STATIC FILE ROUTES - These must come BEFORE the catch-all route

  // Replace your favicon.ico route with this fixed version:
  const faviconPath = join(browserDistFolder, 'favicon.ico');
  console.log('Looking for favicon at:', faviconPath);
  const fs = require('fs');
  if (!fs.existsSync(faviconPath)) {
    console.log('ERROR: favicon.ico not found at path:', faviconPath);
  }

  server.get('/favicon.ico', (req, res) => {
    console.log('Serving favicon.ico');
    const faviconPath = join(browserDistFolder, 'favicon.ico');
    console.log('Looking for favicon at:', faviconPath);

    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(faviconPath)) {
      console.log('ERROR: favicon.ico not found at path:', faviconPath);
      res.status(404).send('favicon.ico not found');
      return;
    }

    console.log('favicon.ico exists, serving...');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(faviconPath, (err) => {
      if (err) {
        console.log('Error serving favicon.ico:', err);
        res.status(500).send('Error serving favicon.ico');
      } else {
        console.log('favicon.ico served successfully');
      }
    });
  });

  // Serve ads.txt
  server.get('/ads.txt', (req, res) => {
    console.log('Serving ads.txt');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, 'ads.txt'));
  });

  // Serve robots.txt
  server.get('/robots.txt', (req, res) => {
    console.log('Serving robots.txt');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, 'robots.txt'));
  });

  // Serve CSS files
  server.get('/styles-*.css', (req, res) => {
    console.log('Serving CSS:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path));
  });

  // Serve JS files
  server.get('/main-*.js', (req, res) => {
    console.log('Serving JS:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path));
  });

  server.get('/polyfills-*.js', (req, res) => {
    console.log('Serving polyfills:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path));
  });

  server.get('/chunk-*.js', (req, res) => {
    console.log('Serving chunk:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path));
  });

  // Serve assets folder
  server.use('/assets', express.static(join(browserDistFolder, 'assets'), {
    maxAge: '1y',
    setHeaders(res) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));

  // Serve media folder
  server.use('/media', express.static(join(browserDistFolder, 'media'), {
    maxAge: '1y',
    setHeaders(res) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));

  // Custom routes for dynamic content
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

  // No-cache middleware for HTML requests (SSR pages)
  server.use((req, res, next) => {
    // Only apply no-cache to routes that don't have file extensions
    // or explicitly end with .html
    if (!req.path.includes('.') || req.path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  });

  // All regular routes use the Angular engine (this should be LAST)
  server.get('*', (req, res, next) => {
    console.log('SSR route:', req.path);
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