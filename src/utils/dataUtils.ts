import { importsData } from '../data/importsData';
import { exportsData } from '../data/exportsData';

export interface ImportData {
  country: string;
  year: number;
  product: string;
  valueUSD: number;
  sourceCountry: string;
  rank: number;
}

export interface ExportData {
  country: string;
  year: number;
  product: string;
  valueUSD: number;
  destinationCountry: string;
  rank: number;
}

export const AFRICAN_COUNTRIES = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo",
  "Côte d'Ivoire",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Togo",
  "Tunisia",
  "Uganda",
  "United Republic of Tanzania",
  "Zambia",
  "Zimbabwe"
] as const;

export const YEARS = [2021, 2022, 2023] as const;

export function getImportsForCountry(country: string, year: number): ImportData[] {
  return importsData.filter(
    (item: ImportData) => item.country === country && item.year === year
  ).sort((a: ImportData, b: ImportData) => a.rank - b.rank);
}

export function getExportsForCountry(country: string, year: number): ExportData[] {
  return exportsData.filter(
    (item: ExportData) => item.country === country && item.year === year
  ).sort((a: ExportData, b: ExportData) => a.rank - b.rank);
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function getTotalImportValue(country: string, year: number): number {
  return getImportsForCountry(country, year).reduce(
    (sum: number, item: ImportData) => sum + item.valueUSD,
    0
  );
}

export function getTotalExportValue(country: string, year: number): number {
  return getExportsForCountry(country, year).reduce(
    (sum: number, item: ExportData) => sum + item.valueUSD,
    0
  );
}

export function getYearlyTrend(country: string, type: 'imports' | 'exports') {
  return YEARS.map(year => {
    const value = type === 'imports'
      ? getTotalImportValue(country, year)
      : getTotalExportValue(country, year);
    return { year, value };
  });
}

