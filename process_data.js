
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const fs = require('fs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the Excel file
const excelPath = resolve('Africa Food Import Map.xlsx');
const outputPathImports = resolve('src/data/importsData.ts');
const outputPathExports = resolve('src/data/exportsData.ts');

console.log(`Reading from: ${excelPath}`);

if (!fs.existsSync(excelPath)) {
    console.error(`File not found: ${excelPath}`);
    process.exit(1);
}

const workbook = XLSX.readFile(excelPath);

// Helper function to map keys
function mapKeys(row) {
    const newRow = {};
    for (const key in row) {
        const cleanKey = key.trim();
        const value = row[key];

        if (cleanKey === 'Country') newRow.country = value ? value.trim() : value;
        else if (cleanKey === 'Year') newRow.year = value;
        else if (cleanKey === 'Product') newRow.product = value ? value.trim() : value;
        else if (cleanKey === 'Value(USD)') newRow.valueUSD = value;
        else if (cleanKey === 'Source Country') newRow.sourceCountry = value ? value.trim() : value;
        else if (cleanKey === 'Destination Country' || cleanKey === 'Destination Country(Top)') newRow.destinationCountry = value ? value.trim() : value;
        else if (cleanKey === 'Rank') newRow.rank = value;
        else newRow[cleanKey] = value; // Keep others if any
    }
    return newRow;
}

// Helper function to process a sheet
function processSheet(sheetName) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.error(`Sheet "${sheetName}" not found! Available sheets: ${workbook.SheetNames.join(', ')}`);
        return [];
    }

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);
    return data
        .map(mapKeys)
        .filter(row => row.country && row.year && row.product && row.valueUSD !== undefined);
}

const importsData = processSheet('Cleaned Imports');
const exportsData = processSheet('Cleaned Exports');

// Write to files
const writeData = (path, variableName, data) => {
    const content = `export const ${variableName} = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Written ${data.length} rows to ${path}`);
};

if (importsData.length > 0) {
    writeData(outputPathImports, 'importsData', importsData);
}

if (exportsData.length > 0) {
    writeData(outputPathExports, 'exportsData', exportsData);
}

console.log('Done!');
