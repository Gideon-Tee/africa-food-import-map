import { X, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ImportExportPanel } from './ImportExportPanel';
import { TradeChart } from './TradeChart';
import { ProductChart } from './ProductChart';
import { TrendChart } from './TrendChart';
import {
  getImportsForCountry,
  getExportsForCountry,
  getTotalImportValue,
  getTotalExportValue,
  getYearlyTrend,
  formatCurrency,
} from '../utils/dataUtils';

interface CountryDashboardProps {
  country: string;
  year: number;
  onClose: () => void;
}

export function CountryDashboard({ country, year, onClose }: CountryDashboardProps) {
  const imports = getImportsForCountry(country, year);
  const exports = getExportsForCountry(country, year);
  const totalImports = getTotalImportValue(country, year);
  const totalExports = getTotalExportValue(country, year);
  const tradeBalance = totalExports - totalImports;
  const importTrend = getYearlyTrend(country, 'imports');
  const exportTrend = getYearlyTrend(country, 'exports');

  return (
    <div className="w-full h-full bg-white border-l border-gray-100 flex flex-col relative overflow-hidden animate-fade-in">
      {/* Decorative Header Background */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-brand-red/[0.05] to-transparent pointer-events-none opacity-50"></div>

      {/* Header */}
      <div className="p-8 pb-4 flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-brand-red text-[10px] font-black uppercase tracking-widest text-white">
              Country Profile
            </span>
            <span className="text-gray-400 text-sm font-bold">{year} Analytics</span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">{country}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-4 bg-gray-50 hover:bg-brand-red hover:text-white text-gray-400 transition-all border border-gray-100 group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-10 pb-16 space-y-16 relative z-10 custom-scrollbar mt-6">
          {/* Metrics Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col h-full justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Total Imports</span>
                <div>
                  <p className="text-3xl font-black text-gray-900 mb-1">{formatCurrency(totalImports)}</p>
                  <div className="flex items-center gap-1 text-brand-red text-xs font-bold">
                    <TrendingDown className="w-3 h-3" />
                    <span>OUTFLOW</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col h-full justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Total Exports</span>
                <div>
                  <p className="text-3xl font-black text-gray-900 mb-1">{formatCurrency(totalExports)}</p>
                  <div className="flex items-center gap-1 text-brand-yellow text-xs font-bold">
                    <TrendingUp className="w-3 h-3" />
                    <span>INFLOW</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col h-full justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trade Balance</span>
                <div>
                  <p className={`text-3xl font-black mb-1 ${tradeBalance >= 0 ? 'text-green-600' : 'text-brand-red'}`}>
                    {formatCurrency(Math.abs(tradeBalance))}
                  </p>
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    {tradeBalance >= 0 ? 'SURPLUS' : 'DEFICIT'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brand-red/[0.03] p-6 border border-brand-red/10">
              <div className="flex flex-col h-full justify-between">
                <span className="text-xs font-bold text-brand-red uppercase tracking-widest mb-4">Total Trade</span>
                <div>
                  <p className="text-3xl font-black text-gray-900 mb-1">{formatCurrency(totalImports + totalExports)}</p>
                  <span className="text-[10px] font-black uppercase text-brand-red/40">Volume (USD)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tighter text-gray-900">Trade Distribution</h3>
              <TradeChart imports={imports} exports={exports} />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tighter text-gray-900">Import Products</h3>
              <ProductChart imports={imports} exports={exports} type="imports" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tighter text-gray-900">Export Products</h3>
            <ProductChart imports={imports} exports={exports} type="exports" />
          </div>

          {/* Trend Analysis */}
          <div className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-gray-900 border-b border-gray-100 pb-2">Growth Trends (2021-2023)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TrendChart data={importTrend} title="Import Trajectory" color="rgb(183, 43, 24)" />
              <TrendChart data={exportTrend} title="Export Trajectory" color="rgb(250, 187, 37)" />
            </div>
          </div>

          {/* Detailed Analytics Panel */}
          <div className="pt-8">
            <ImportExportPanel
              imports={imports}
              exports={exports}
              totalImports={totalImports}
              totalExports={totalExports}
            />
          </div>
        </div>
      </div>
    );
}

