import { useMemo } from 'react';
import {
  AFRICAN_COUNTRIES,
  getImportsForCountry, getExportsForCountry,
  formatCurrency, getTotalImportValue, getTotalExportValue,
  type ImportData, type ExportData,
} from '../../../utils/dataUtils';
import { TrendingDown, TrendingUp, Globe2, Package, MapPin } from 'lucide-react';

interface AfricaOverviewProps {
  year: number;
}

interface RankedItem { name: string; value: number }

function TopList({ items, color }: { items: RankedItem[]; color: string }) {
  const max = items[0]?.value || 1;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.name} className="flex items-center gap-3">
          <span className="text-[11px] font-black text-gray-400 w-4 flex-shrink-0">#{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-700 truncate">{item.name}</span>
              <span className="text-xs font-black text-gray-900 ml-2 flex-shrink-0">{formatCurrency(item.value)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(item.value / max) * 100}%`, background: color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AfricaOverview({ year }: AfricaOverviewProps) {
  const data = useMemo(() => {
    const allImports: ImportData[] = [];
    const allExports: ExportData[] = [];

    AFRICAN_COUNTRIES.forEach(country => {
      allImports.push(...getImportsForCountry(country, year));
      allExports.push(...getExportsForCountry(country, year));
    });

    // Total sums
    const totalImports = allImports.reduce((s, d) => s + d.valueUSD, 0);
    const totalExports = allExports.reduce((s, d) => s + d.valueUSD, 0);

    // Top imported products
    const importsByProduct: Record<string, number> = {};
    allImports.forEach(d => { importsByProduct[d.product] = (importsByProduct[d.product] || 0) + d.valueUSD; });
    const topImportProducts = Object.entries(importsByProduct)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    // Top exported products
    const exportsByProduct: Record<string, number> = {};
    allExports.forEach(d => { exportsByProduct[d.product] = (exportsByProduct[d.product] || 0) + d.valueUSD; });
    const topExportProducts = Object.entries(exportsByProduct)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    // Top import source countries
    const sourceMap: Record<string, number> = {};
    allImports.forEach(d => { sourceMap[d.sourceCountry] = (sourceMap[d.sourceCountry] || 0) + d.valueUSD; });
    const topSources = Object.entries(sourceMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    // Top export destination countries
    const destMap: Record<string, number> = {};
    allExports.forEach(d => { destMap[d.destinationCountry] = (destMap[d.destinationCountry] || 0) + d.valueUSD; });
    const topDestinations = Object.entries(destMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    const countryCount = AFRICAN_COUNTRIES.filter(c =>
      getTotalImportValue(c, year) > 0 || getTotalExportValue(c, year) > 0
    ).length;

    return { totalImports, totalExports, topImportProducts, topExportProducts, topSources, topDestinations, countryCount };
  }, [year]);

  const balance = data.totalExports - data.totalImports;

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Globe2 className="w-4 h-4 text-brand-orange" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Continent Overview</span>
        </div>
        <h2 className="text-2xl font-[900] tracking-tight text-gray-900">Africa Food Trade</h2>
        <p className="text-sm text-gray-400 mt-0.5">{year} · {data.countryCount} countries with data</p>
      </div>

      <div className="px-8 py-6 space-y-8 flex-1">
        {/* ── Metric cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {/* Imports */}
          <div className="col-span-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-red" />
            <TrendingDown className="w-4 h-4 text-brand-red mb-3" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Top-3 Imports</p>
            <p className="text-xl font-[900] text-gray-900 tracking-tight">{formatCurrency(data.totalImports)}</p>
            <p className="text-[9px] text-gray-400 mt-1">Combined inflow</p>
          </div>

          {/* Exports */}
          <div className="col-span-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-yellow" />
            <TrendingUp className="w-4 h-4 text-brand-yellow mb-3" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Top-3 Exports</p>
            <p className="text-xl font-[900] text-gray-900 tracking-tight">{formatCurrency(data.totalExports)}</p>
            <p className="text-[9px] text-gray-400 mt-1">Combined outflow</p>
          </div>

          {/* Balance */}
          <div className="col-span-1 bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange" />
            <Package className="w-4 h-4 text-brand-orange mb-3" />
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Net Balance</p>
            <p className={`text-xl font-[900] tracking-tight ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
            </p>
            <p className={`text-[9px] mt-1 font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </div>
        </div>

        {/* ── Products ── */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-brand-red rounded-full" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Top Imported Products</h3>
            </div>
            <TopList items={data.topImportProducts} color="rgb(183,43,24)" />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-brand-yellow rounded-full" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Top Exported Products</h3>
            </div>
            <TopList items={data.topExportProducts} color="rgb(250,187,37)" />
          </div>
        </div>

        {/* ── Trade partners ── */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-3.5 h-3.5 text-brand-red" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Top Import Sources</h3>
            </div>
            <p className="text-[9px] text-gray-400 font-medium mb-3 -mt-2">Countries supplying food to Africa</p>
            <TopList items={data.topSources} color="rgb(237,104,67)" />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Top Export Destinations</h3>
            </div>
            <p className="text-[9px] text-gray-400 font-medium mb-3 -mt-2">Countries receiving food from Africa</p>
            <TopList items={data.topDestinations} color="rgb(250,187,37)" />
          </div>
        </div>

        {/* Hint */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-brand-red/10 flex items-center justify-center flex-shrink-0">
            <Globe2 className="w-4 h-4 text-brand-red" />
          </div>
          <p className="text-xs text-gray-500">
            <span className="font-black text-gray-700">Drill deeper →</span>{' '}
            Click any country on the map or use the search bar to see its individual trade breakdown.
            Select multiple countries to compare them side by side.
          </p>
        </div>
      </div>
    </div>
  );
}
