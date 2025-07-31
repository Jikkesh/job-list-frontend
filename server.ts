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

// Helper function to normalize URLs for canonical tags
function normalizeCanonicalUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Ensure HTTPS in production
    if (process.env['NODE_ENV'] === 'production') {
      urlObj.protocol = 'https:';
    }
    
    // Remove trailing slash (except root)
    const pathname = urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/$/, '');
    
    // Remove common tracking parameters
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
    paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
    
    const search = urlObj.searchParams.toString();
    return `${urlObj.protocol}//${urlObj.host}${pathname}${search ? '?' + search : ''}`;
  } catch {
    return url; // Fallback to original if URL parsing fails
  }
}

// Add structured data for better indexing
function addStructuredData(html: string, url: string): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": url,
    "name": "Jobs AI - Find Your Perfect Job",
    "description": "Discover the best job opportunities with Jobs AI",
    "publisher": {
      "@type": "Organization",
      "name": "Jobs AI",
      "url": "https://jobsai.in"
    }
  };

  return html.replace(
    /<\/head>/i,
    `  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>\n</head>`
  );
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

  // Force HTTPS redirect in production
  server.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env['NODE_ENV'] === 'production') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
    next();
  });

  // Redirect trailing slashes to non-trailing (except root)
  server.use((req, res, next) => {
    if (req.path !== '/' && req.path.endsWith('/')) {
      const redirectUrl = req.path.slice(0, -1) + (req.url.includes('?') ? req.url.substring(req.path.length) : '');
      return res.redirect(301, redirectUrl);
    }
    next();
  });

  // Middleware to prevent caching of 404 static files
  server.use((req, res, next) => {
    if (req.path.match(/\.(ico|png|jpg|jpeg|gif|css|js|woff|woff2|ttf|eot|svg|txt)$/)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
  });

  // EXPLICIT STATIC FILE ROUTES - These must come BEFORE the catch-all route

  // Serve favicon.ico with proper error handling
  server.get('/favicon.ico', (req, res) => {
    console.log('Serving favicon.ico');
    const faviconPath = join(browserDistFolder, 'favicon.ico');

    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    res.sendFile(faviconPath, (err) => {
      if (err) {
        console.log('Favicon error:', err);
        res.status(404)
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .send('Favicon not found');
      }
    });
  });

  // Serve ads.txt
  server.get('/ads.txt', (req, res) => {
    console.log('Serving ads.txt');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, 'ads.txt'), (err) => {
      if (err) {
        res.status(404)
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .send('ads.txt not found');
      }
    });
  });

  // Serve robots.txt
  server.get('/robots.txt', (req, res) => {
    console.log('Serving robots.txt');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, 'robots.txt'), (err) => {
      if (err) {
        res.status(404)
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .send('robots.txt not found');
      }
    });
  });

  // Serve CSS files
  server.get('/styles-*.css', (req, res) => {
    console.log('Serving CSS:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path), (err) => {
      if (err) {
        res.status(404)
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .send('CSS file not found');
      }
    });
  });

  // Serve JS files
  server.get('/main-*.js', (req, res) => {
    console.log('Serving JS:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path), (err) => {
      if (err) {
        res.status(404)
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .send('JS file not found');
      }
    });
  });

  server.get('/polyfills-*.js', (req, res) => {
    console.log('Serving polyfills:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path), (err) => {
      if (err) {
        res.status(404)
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .send('Polyfills file not found');
      }
    });
  });

  server.get('/chunk-*.js', (req, res) => {
    console.log('Serving chunk:', req.path);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(join(browserDistFolder, req.path), (err) => {
      if (err) {
        res.status(404)
          .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          .send('Chunk file not found');
      }
    });
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
    if (!req.path.includes('.') || req.path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  });

  // All regular routes use the Angular engine (this should be LAST)
  server.get('*', (req, res, next) => {
    const fullUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    const canonicalUrl = normalizeCanonicalUrl(fullUrl);
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
      .then((html) => {
        // Remove any existing canonical tags and add the correct one
        let updatedHtml = html.replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/gi,
          ''
        );
        
        // Insert canonical tag in head section
        updatedHtml = updatedHtml.replace(
          /<\/head>/i,
          `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`
        );

        // Add structured data for better SEO
        updatedHtml = addStructuredData(updatedHtml, canonicalUrl);
        
        res.send(updatedHtml);
      })
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