/**
 * Script to process and optimize world ports data
 * Converts raw port data into optimized format for frontend autocomplete
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read raw data
const rawData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../constants/world-ports-raw.json'),
    'utf-8'
  )
);

console.log(`Processing ${rawData.length} ports...`);

// Process and deduplicate ports
const portsMap = new Map();

rawData.forEach((port) => {
  const key = `${port.CITY}|${port.COUNTRY}`;

  // Keep first occurrence or merge data
  if (!portsMap.has(key)) {
    portsMap.set(key, {
      city: port.CITY,
      country: port.COUNTRY,
      state: port.STATE,
      latitude: port.LATITUDE,
      longitude: port.LONGITUDE,
      label: `${port.CITY}, ${port.COUNTRY}`,
      value: key
    });
  }
});

// Convert to array and sort
const processedPorts = Array.from(portsMap.values()).sort((a, b) => {
  // Sort by country first, then city
  const countryCompare = a.country.localeCompare(b.country);
  return countryCompare !== 0 ? countryCompare : a.city.localeCompare(b.city);
});

console.log(`Processed ${processedPorts.length} unique ports`);

// Generate optimized dataset
const outputPath = path.join(__dirname, '../constants/world-ports.json');
fs.writeFileSync(
  outputPath,
  JSON.stringify(processedPorts, null, 2),
  'utf-8'
);

console.log(`✓ Generated optimized dataset: ${outputPath}`);

// Generate statistics
const countries = new Set(processedPorts.map(p => p.country));
console.log(`\nStatistics:`);
console.log(`- Total ports: ${processedPorts.length}`);
console.log(`- Total countries: ${countries.size}`);

// File size comparison
const rawSize = fs.statSync(path.join(__dirname, '../constants/world-ports-raw.json')).size;
const processedSize = fs.statSync(outputPath).size;
console.log(`- Raw file size: ${(rawSize / 1024).toFixed(2)} KB`);
console.log(`- Processed file size: ${(processedSize / 1024).toFixed(2)} KB`);
console.log(`- Reduction: ${(((rawSize - processedSize) / rawSize) * 100).toFixed(1)}%`);

// Top 10 countries by port count
const countryCounts = {};
processedPorts.forEach(port => {
  countryCounts[port.country] = (countryCounts[port.country] || 0) + 1;
});

const topCountries = Object.entries(countryCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

console.log(`\nTop 10 countries by port count:`);
topCountries.forEach(([country, count], i) => {
  console.log(`${i + 1}. ${country}: ${count} ports`);
});
