import { formatCurrency } from '../utils/dataUtils';
import type { ImportData, ExportData } from '../utils/dataUtils';
import { TrendingUp, TrendingDown, Package, Globe } from 'lucide-react';

interface ImportExportPanelProps {
  imports: ImportData[];
  exports: ExportData[];
  totalImports: number;
  totalExports: number;
}

export function ImportExportPanel({
  imports,
  exports,
  totalImports,
  totalExports,
}: ImportExportPanelProps) {
  const netTrade = totalExports - totalImports;
  const tradeBalance = netTrade > 0 ? 'positive' : 'negative';

  return (
    <div className="space-y-16">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-50 p-10 border border-gray-100 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-red group-hover:w-2 transition-all"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total Imports</h3>
            <div className="p-3 bg-brand-red/10">
              <TrendingDown className="w-5 h-5 text-brand-red" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 leading-none">{formatCurrency(totalImports)}</p>
        </div>

        <div className="bg-gray-50 p-10 border border-gray-100 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow group-hover:w-2 transition-all"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total Exports</h3>
            <div className="p-3 bg-brand-yellow/10">
              <TrendingUp className="w-5 h-5 text-brand-yellow" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 leading-none">{formatCurrency(totalExports)}</p>
        </div>

        <div className={`bg-gray-50 p-10 border border-gray-100 relative overflow-hidden group shadow-sm`}>
          <div className={`absolute top-0 left-0 w-1 h-full group-hover:w-2 transition-all ${tradeBalance === 'positive' ? 'bg-green-500' : 'bg-brand-red'}`}></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Trade Balance</h3>
            <div className={`p-3 ${tradeBalance === 'positive' ? 'bg-green-500/10' : 'bg-brand-red/10'}`}>
              {tradeBalance === 'positive' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-brand-red" />
              )}
            </div>
          </div>
          <p className={`text-4xl font-black leading-none ${tradeBalance === 'positive' ? 'text-green-500' : 'text-brand-red'}`}>
            {formatCurrency(Math.abs(netTrade))}
          </p>
        </div>
      </div>

      {/* Imports and Exports Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Imports */}
        <div className="space-y-8">
          <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
            <div className="p-4 bg-brand-red/10">
              <TrendingDown className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Top Imports</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Inflow breakdown</p>
            </div>
          </div>
          <div className="space-y-6">
            {imports.length > 0 ? (
              imports.map((item) => (
                <div
                  key={`${item.product}-${item.rank}`}
                  className="bg-white p-8 border border-gray-100 hover:border-brand-red/30 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                      <span className="text-5xl font-black text-gray-100 group-hover:text-brand-red/10 transition-colors">
                        0{item.rank}
                      </span>
                      <div>
                        <p className="text-xl font-black text-gray-900 uppercase tracking-tight group-hover:text-brand-red transition-colors">
                          {item.product}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Source: {item.sourceCountry}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-[140px]">
                      <p className="text-3xl font-black text-gray-900 leading-none mb-2">
                        {formatCurrency(item.valueUSD)}
                      </p>
                      <span className="text-[11px] font-black uppercase text-brand-red/40 tracking-widest">USD Value</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-16 text-center border border-gray-100 border-dashed">
                <p className="text-gray-400 font-bold uppercase tracking-widest">No import data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Exports */}
        <div className="space-y-8">
          <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
            <div className="p-4 bg-brand-yellow/10">
              <TrendingUp className="w-8 h-8 text-brand-yellow" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Top Exports</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Outflow breakdown</p>
            </div>
          </div>
          <div className="space-y-6">
            {exports.length > 0 ? (
              exports.map((item) => (
                <div
                  key={`${item.product}-${item.rank}`}
                  className="bg-white p-8 border border-gray-100 hover:border-brand-yellow/30 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                      <span className="text-5xl font-black text-gray-100 group-hover:text-brand-yellow/10 transition-colors">
                        0{item.rank}
                      </span>
                      <div>
                        <p className="text-xl font-black text-gray-900 uppercase tracking-tight group-hover:text-brand-yellow transition-colors">
                          {item.product}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Destination: {item.destinationCountry}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-[140px]">
                      <p className="text-3xl font-black text-gray-900 leading-none mb-2">
                        {formatCurrency(item.valueUSD)}
                      </p>
                      <span className="text-[11px] font-black uppercase text-brand-yellow/60 tracking-widest">USD Value</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-16 text-center border border-gray-100 border-dashed">
                <p className="text-gray-400 font-bold uppercase tracking-widest">No export data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

