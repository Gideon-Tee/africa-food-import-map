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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl p-6 border-l-4 border-brand-red">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Imports</h3>
            <TrendingDown className="w-5 h-5 text-brand-red" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalImports)}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 border-l-4 border-brand-yellow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Exports</h3>
            <TrendingUp className="w-5 h-5 text-brand-yellow" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalExports)}</p>
        </div>

        <div className={`glass-strong rounded-2xl p-6 border-l-4 ${tradeBalance === 'positive' ? 'border-green-400' : 'border-red-400'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Trade Balance</h3>
            {tradeBalance === 'positive' ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className={`text-2xl font-bold ${tradeBalance === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(Math.abs(netTrade))}
          </p>
        </div>
      </div>

      {/* Imports and Exports Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imports */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-brand-red/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-brand-red" />
            </div>
            <h2 className="text-xl font-semibold text-white">Top Imports</h2>
          </div>
          <div className="space-y-3">
            {imports.length > 0 ? (
              imports.map((item) => (
                <div
                  key={`${item.product}-${item.rank}`}
                  className="glass rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-brand-red bg-brand-red/20 px-2 py-1 rounded">
                          #{item.rank}
                        </span>
                        <Package className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold text-white">{item.product}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="w-3 h-3" />
                        <span>From: {item.sourceCountry}</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-brand-red ml-4">
                      {formatCurrency(item.valueUSD)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No import data available</p>
            )}
          </div>
        </div>

        {/* Exports */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-brand-yellow/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-brand-yellow" />
            </div>
            <h2 className="text-xl font-semibold text-white">Top Exports</h2>
          </div>
          <div className="space-y-3">
            {exports.length > 0 ? (
              exports.map((item) => (
                <div
                  key={`${item.product}-${item.rank}`}
                  className="glass rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/20 px-2 py-1 rounded">
                          #{item.rank}
                        </span>
                        <Package className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold text-white">{item.product}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="w-3 h-3" />
                        <span>To: {item.destinationCountry}</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-brand-yellow ml-4">
                      {formatCurrency(item.valueUSD)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No export data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

