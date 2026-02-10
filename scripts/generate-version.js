/**
 * Generates a version.json file in the build output directory.
 * This file is used by the UpdateService to detect new deployments
 * and trigger automatic page reloads.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const outputDir = path.join(__dirname, '..', 'dist', 'HAC_Pharma', 'browser');

const version = {
  hash: crypto.randomUUID().replace(/-/g, ''),
  timestamp: new Date().toISOString(),
};

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  console.warn(`Output directory not found: ${outputDir}`);
  process.exit(1);
}

fs.writeFileSync(
  path.join(outputDir, 'version.json'),
  JSON.stringify(version, null, 2)
);

console.log(`Generated version.json: ${version.hash} at ${version.timestamp}`);
