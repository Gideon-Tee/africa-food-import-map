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
    <div className="space-y-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 border border-gray-100 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-red"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Imports</h3>
            <div className="p-3 bg-brand-red/10 rounded-xl">
              <TrendingDown className="w-5 h-5 text-brand-red" />
            </div>
          </div>
          <p className="text-4xl font-[900] text-gray-900 leading-none tracking-tight">{formatCurrency(totalImports)}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red/30"></span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Outflow</span>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-yellow"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Exports</h3>
            <div className="p-3 bg-brand-yellow/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-brand-yellow" />
            </div>
          </div>
          <p className="text-4xl font-[900] text-gray-900 leading-none tracking-tight">{formatCurrency(totalExports)}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow/30"></span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Inflow</span>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
          <div className={`absolute top-0 left-0 w-1.5 h-full ${tradeBalance === 'positive' ? 'bg-green-500' : 'bg-brand-red'}`}></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trade Balance</h3>
            <div className={`p-3 rounded-xl ${tradeBalance === 'positive' ? 'bg-green-500/10' : 'bg-brand-red/10'}`}>
              {tradeBalance === 'positive' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-brand-red" />
              )}
            </div>
          </div>
          <p className={`text-4xl font-[900] leading-none tracking-tight ${tradeBalance === 'positive' ? 'text-green-600' : 'text-brand-red'}`}>
            {formatCurrency(Math.abs(netTrade))}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${tradeBalance === 'positive' ? 'bg-green-500/30' : 'bg-brand-red/30'}`}></span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {tradeBalance === 'positive' ? 'Fiscal Surplus' : 'Fiscal Deficit'}
            </span>
          </div>
        </div>
      </div>

      {/* Imports and Exports Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Imports */}
        <div className="space-y-10">
          <div className="flex items-center gap-6 border-b border-gray-100 pb-8">
            <div className="p-4 bg-brand-red text-white rounded-2xl shadow-lg shadow-brand-red/20">
              <TrendingDown className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-[900] uppercase tracking-tighter text-gray-900 leading-none">Top Imports</h2>
              <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mt-2">Critical Inflow Categories</p>
            </div>
          </div>
          <div className="space-y-4">
            {imports.length > 0 ? (
              imports.map((item) => (
                <div
                  key={`${item.product}-${item.rank}`}
                  className="bg-white p-6 border border-gray-100 rounded-2xl hover:border-brand-red/30 transition-all group shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-brand-red/5 transition-colors">
                        <span className="text-xl font-black text-gray-300 group-hover:text-brand-red/40 transition-colors">
                          {item.rank}
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-[900] text-gray-900 uppercase tracking-tight group-hover:text-brand-red transition-colors leading-tight">
                          {item.product}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Globe className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Source: <span className="text-gray-600">{item.sourceCountry}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-[900] text-gray-900 leading-none mb-1 tracking-tight">
                        {formatCurrency(item.valueUSD)}
                      </p>
                      <span className="text-[9px] font-black uppercase text-brand-red/40 tracking-[0.2em]">USD Value</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50/50 p-16 text-center border-2 border-gray-100 border-dashed rounded-3xl">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">No primary import data found</p>
              </div>
            )}
          </div>
        </div>

        {/* Exports */}
        <div className="space-y-10">
          <div className="flex items-center gap-6 border-b border-gray-100 pb-8">
            <div className="p-4 bg-brand-yellow text-white rounded-2xl shadow-lg shadow-brand-yellow/20">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-[900] uppercase tracking-tighter text-gray-900 leading-none">Top Exports</h2>
              <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mt-2">Key Outflow Assets</p>
            </div>
          </div>
          <div className="space-y-4">
            {exports.length > 0 ? (
              exports.map((item) => (
                <div
                  key={`${item.product}-${item.rank}`}
                  className="bg-white p-6 border border-gray-100 rounded-2xl hover:border-brand-yellow/30 transition-all group shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-brand-yellow/5 transition-colors">
                        <span className="text-xl font-black text-gray-300 group-hover:text-brand-yellow/40 transition-colors">
                          {item.rank}
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-[900] text-gray-900 uppercase tracking-tight group-hover:text-brand-yellow transition-colors leading-tight">
                          {item.product}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Globe className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Destination: <span className="text-gray-600">{item.destinationCountry}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-[900] text-gray-900 leading-none mb-1 tracking-tight">
                        {formatCurrency(item.valueUSD)}
                      </p>
                      <span className="text-[9px] font-black uppercase text-brand-yellow/60 tracking-[0.2em]">USD Value</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50/50 p-16 text-center border-2 border-gray-100 border-dashed rounded-3xl">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">No primary export data found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}

