import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');

/** Read the build version hash generated at build time. */
let buildVersion = Date.now().toString();
try {
  const versionFile = join(browserDistFolder, 'version.json');
  const parsed = JSON.parse(readFileSync(versionFile, 'utf-8'));
  buildVersion = parsed.hash || buildVersion;
  console.log(`[Server] Build version: ${buildVersion}`);
} catch {
  console.warn('[Server] version.json not found — using timestamp as fallback');
}

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Global middleware: stamp EVERY response with anti-cache headers.
 * This tells Railway's proxy, CDNs, and the browser to never serve stale HTML.
 */
app.use((req, res, next) => {
  // Skip fingerprinted assets (they have content hashes in their names)
  if (!/\.[a-f0-9]{8,}\.\w+$/i.test(req.path)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Vary', '*');
  }
  res.setHeader('X-App-Version', buildVersion);
  next();
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser.
 * Fingerprinted assets (JS/CSS with hashes) are cached immutably for 1 year.
 * Everything else gets anti-cache headers from the global middleware above.
 */
app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    etag: false,
    lastModified: false,
    setHeaders(res, filePath) {
      if (/\.[a-f0-9]{8,}\.\w+$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 * Anti-cache headers are already set by the global middleware above.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
