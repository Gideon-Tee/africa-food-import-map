/**
 * process_data.js
 * Reads both the original Excel file (2021-2023) and a 2024 Excel file,
 * merges them, and writes combined output to src/data/importsData.ts
 * and src/data/exportsData.ts.
 *
 * Usage: node process_data.js
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const fs = require('fs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── File paths ────────────────────────────────────────────────────────────────
const ORIGINAL_FILE = resolve('Africa Food Import Map.xlsx');
const OUTPUT_IMPORTS = resolve('src/data/importsData.ts');
const OUTPUT_EXPORTS = resolve('src/data/exportsData.ts');

// Try several possible names for the 2024 file
const POSSIBLE_2024_FILES = [
  'Africa_Food_Import_Map_2024.xlsx',
  'Africa Food Import Map 2024.xlsx',
  'Africa_Food_EXIM_Map_2024.xlsx',
  'Africa Food EXIM Map 2024.xlsx',
];

// ── Key normaliser ────────────────────────────────────────────────────────────
function mapKeys(row) {
  const out = {};
  for (const key in row) {
    const k = key.trim();
    const v = row[key];
    const str = (x) => (typeof x === 'string' ? x.trim() : x);

    if      (k === 'Country')                                   out.country            = str(v);
    else if (k === 'Year')                                      out.year               = Number(v);
    else if (k === 'Product')                                   out.product            = str(v);
    else if (k === 'Value(USD)' || k === 'ValueUSD'
          || k === 'Value (USD)' || k === 'value_usd')         out.valueUSD           = Number(v);
    else if (k === 'Source Country')                            out.sourceCountry      = str(v);
    else if (k === 'Destination Country'
          || k === 'Destination Country(Top)')                  out.destinationCountry = str(v);
    else if (k === 'Rank')                                      out.rank               = Number(v);
  }
  return out;
}

// ── Sheet processor ───────────────────────────────────────────────────────────
function processSheet(workbook, sheetName, filePath) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.error(`  ✗ Sheet "${sheetName}" not found in ${filePath}`);
    console.error(`    Available sheets: ${workbook.SheetNames.join(', ')}`);
    return [];
  }
  const rows = XLSX.utils.sheet_to_json(sheet)
    .map(mapKeys)
    .filter(r => r.country && r.year && r.product && r.valueUSD !== undefined);
  console.log(`  ✓ Sheet "${sheetName}" — ${rows.length} rows`);
  return rows;
}

// ── Find sheet by partial name match ─────────────────────────────────────────
function findSheet(workbook, keyword) {
  return workbook.SheetNames.find(n => n.toLowerCase().includes(keyword.toLowerCase())) || null;
}

// ── Process a workbook intelligently ─────────────────────────────────────────
function processWorkbook(filePath, importSheetHint, exportSheetHint) {
  if (!fs.existsSync(filePath)) return null;
  console.log(`\nReading: ${filePath}`);
  const wb = XLSX.readFile(filePath);
  console.log(`  Sheets found: ${wb.SheetNames.join(', ')}`);

  const importSheet = importSheetHint && wb.Sheets[importSheetHint]
    ? importSheetHint
    : findSheet(wb, 'import');

  const exportSheet = exportSheetHint && wb.Sheets[exportSheetHint]
    ? exportSheetHint
    : findSheet(wb, 'export');

  const imports = importSheet ? processSheet(wb, importSheet, filePath) : [];
  const exports = exportSheet ? processSheet(wb, exportSheet, filePath) : [];

  if (!importSheet) console.warn('  ⚠ No import sheet found — skipping imports');
  if (!exportSheet) console.warn('  ⚠ No export sheet found — skipping exports');

  return { imports, exports };
}

// ── Deduplicate (country + year + product + rank) ────────────────────────────
function dedup(rows) {
  const seen = new Set();
  return rows.filter(r => {
    const key = `${r.country}|${r.year}|${r.product}|${r.rank}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Write TS data file ────────────────────────────────────────────────────────
function writeData(outputPath, varName, data) {
  const content = `export const ${varName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`\n✓ Written ${data.length} rows → ${outputPath}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('═══ Africa Food EXIM Map — Data Processor ═══');

// 1. Read original file (2021-2023)
if (!fs.existsSync(ORIGINAL_FILE)) {
  console.error(`Original file not found: ${ORIGINAL_FILE}`);
  process.exit(1);
}
const original = processWorkbook(ORIGINAL_FILE, 'Cleaned Imports', 'Cleaned Exports');

// 2. Find and read 2024 file
let file2024 = null;
for (const name of POSSIBLE_2024_FILES) {
  const p = resolve(name);
  if (fs.existsSync(p)) { file2024 = p; break; }
}

let data2024 = { imports: [], exports: [] };
if (file2024) {
  // Try common sheet names; fall back to auto-detect
  const result = processWorkbook(file2024, 'Cleaned Imports', 'Cleaned Exports');
  if (result) data2024 = result;
} else {
  console.warn('\n⚠ 2024 file not found. Tried:');
  POSSIBLE_2024_FILES.forEach(f => console.warn(`   ${f}`));
  console.warn('  Place the 2024 Excel file in the project root and re-run.');
}

// 3. Merge & deduplicate
const allImports = dedup([...original.imports, ...data2024.imports])
  .sort((a, b) => a.country.localeCompare(b.country) || a.year - b.year || a.rank - b.rank);

const allExports = dedup([...original.exports, ...data2024.exports])
  .sort((a, b) => a.country.localeCompare(b.country) || a.year - b.year || a.rank - b.rank);

// 4. Summary
const years = [...new Set(allImports.map(r => r.year))].sort();
console.log(`\nYears in merged dataset: ${years.join(', ')}`);
console.log(`Total import rows: ${allImports.length}`);
console.log(`Total export rows: ${allExports.length}`);

// 5. Write
writeData(OUTPUT_IMPORTS, 'importsData', allImports);
writeData(OUTPUT_EXPORTS, 'exportsData', allExports);

console.log('\nDone! Run `npm run dev` to preview the updated data.');
