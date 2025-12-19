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
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-red/[0.08] via-brand-red/[0.02] to-transparent pointer-events-none z-0"></div>

      {/* Header */}
      <div className="p-10 pb-6 flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">
                Country Analytics
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{year} Fiscal</span>
            </div>
          </div>
          <h2 className="text-6xl font-[900] text-gray-900 tracking-tighter uppercase leading-none">{country}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-4 bg-white/50 backdrop-blur-md hover:bg-brand-red hover:text-white text-gray-400 transition-all border border-gray-100 rounded-2xl group shadow-sm hover:shadow-xl hover:shadow-brand-red/20"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-10 pb-20 space-y-12 relative z-10 custom-scrollbar pt-4">
          {/* Metrics Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-red/20"></div>
              <div className="flex flex-col h-full justify-between relative z-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Imports</span>
                <div>
                  <p className="text-3xl font-[900] text-gray-900 mb-1 tracking-tight">{formatCurrency(totalImports)}</p>
                  <div className="flex items-center gap-1.5 text-brand-red text-[10px] font-black uppercase tracking-widest">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Outflow</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow/30"></div>
              <div className="flex flex-col h-full justify-between relative z-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Exports</span>
                <div>
                  <p className="text-3xl font-[900] text-gray-900 mb-1 tracking-tight">{formatCurrency(totalExports)}</p>
                  <div className="flex items-center gap-1.5 text-brand-yellow text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Inflow</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange/20"></div>
              <div className="flex flex-col h-full justify-between relative z-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Trade Balance</span>
                <div>
                  <p className={`text-3xl font-[900] mb-1 tracking-tight ${tradeBalance >= 0 ? 'text-green-600' : 'text-brand-red'}`}>
                    {formatCurrency(Math.abs(tradeBalance))}
                  </p>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${tradeBalance >= 0 ? 'text-green-600/60' : 'text-brand-red/60'}`}>
                    {tradeBalance >= 0 ? 'SURPLUS' : 'DEFICIT'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 border border-gray-800 shadow-xl rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
              <div className="flex flex-col h-full justify-between relative z-10">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Trade Volume</span>
                <div>
                  <p className="text-3xl font-[900] text-white mb-1 tracking-tight">{formatCurrency(totalImports + totalExports)}</p>
                  <span className="text-[10px] font-black uppercase text-brand-red tracking-widest">Aggregate USD</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-red/10 rounded-full blur-2xl group-hover:bg-brand-red/20 transition-colors"></div>
            </div>
          </div>

          {/* Visualization Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-6 w-1 bg-brand-red rounded-full"></div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Trade Flow Analysis</h3>
              </div>
              <TradeChart imports={imports} exports={exports} />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-6 w-1 bg-brand-yellow rounded-full"></div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Import Composition</h3>
              </div>
              <ProductChart imports={imports} exports={exports} type="imports" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-6 w-1 bg-brand-orange rounded-full"></div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Export Breakdown</h3>
            </div>
            <ProductChart imports={imports} exports={exports} type="exports" />
          </div>

          {/* Trend Analysis */}
          <div className="space-y-10 pt-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-brand-red rounded-full"></div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Historical Trajectory</h3>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Temporal Insights 2021-2023</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TrendChart data={importTrend} title="Import Growth" color="rgb(183, 43, 24)" />
              <TrendChart data={exportTrend} title="Export Performance" color="rgb(250, 187, 37)" />
            </div>
          </div>

          {/* Detailed Analytics Panel */}
          <div className="pt-12 border-t border-gray-100">
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

