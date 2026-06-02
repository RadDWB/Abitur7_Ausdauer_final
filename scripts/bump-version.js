const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../version.json');
const versionTsFile = path.join(__dirname, '../app/lib/version.ts');
const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));

const parts = versionData.version.split('.');
parts[2] = (parseInt(parts[2]) + 1).toString();
versionData.version = parts.join('.');

fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2) + '\n');
fs.writeFileSync(versionTsFile, `export const APP_VERSION = '${versionData.version}';\n`);
console.log(`Version bumped to ${versionData.version}`);
