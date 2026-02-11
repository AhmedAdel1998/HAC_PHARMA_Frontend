/**
 * Generates a version.json file in the build output directory.
 * This file is used by:
 *   1. The inline <script> in index.html to detect stale pages instantly
 *   2. The UpdateService to detect new deployments while the app is open
 *   3. The Express server to stamp every response with X-App-Version
 *
 * A unique hash is generated on every build so that any deployment —
 * even if no code changed — produces a new version fingerprint.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const browserDir = path.join(__dirname, '..', 'dist', 'HAC_Pharma', 'browser');

const version = {
  hash: crypto.randomUUID().replace(/-/g, ''),
  timestamp: new Date().toISOString(),
};

// Ensure the output directory exists
if (!fs.existsSync(browserDir)) {
  console.warn(`Output directory not found: ${browserDir}`);
  process.exit(1);
}

// Write to /browser so the inline script can fetch it
fs.writeFileSync(
  path.join(browserDir, 'version.json'),
  JSON.stringify(version, null, 2)
);

console.log(`Generated version.json: ${version.hash} at ${version.timestamp}`);
