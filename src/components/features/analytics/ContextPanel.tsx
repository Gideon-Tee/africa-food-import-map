import { X, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { formatCurrency, getTotalImportValue, getTotalExportValue, getImportsForCountry, getExportsForCountry } from '../../../utils/dataUtils';

interface ContextPanelProps {
    country: string | null;
    year: number;
    onClose: () => void;
}

export function ContextPanel({ country, year, onClose }: ContextPanelProps) {
    if (!country) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 bg-gray-50">
                <div className="w-16 h-16 bg-white rounded-2xl border border-gray-200 flex items-center justify-center mb-6 shadow-sm">
                    <ArrowUpRight className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Market</h3>
                <p className="text-sm leading-relaxed max-w-[240px]">
                    Click on any country on the map to inspect trade metrics for {year}.
                </p>
            </div>
        );
    }

    const totalImports = getTotalImportValue(country, year);
    const totalExports = getTotalExportValue(country, year);
    const topImports = getImportsForCountry(country, year).slice(0, 3);
    const topExports = getExportsForCountry(country, year).slice(0, 3);

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-white shrink-0">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Market Analysis</span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-1">{country}</h2>
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase tracking-wide text-gray-600">
                        <span>{year} Dataset</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Total Volume</span>
                            <TrendingUp className="w-4 h-4 text-gray-300" />
                        </div>
                        <p className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(totalImports + totalExports)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                            <div className="flex items-center gap-2 mb-2 text-brand-red">
                                <ArrowDownRight className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Imports</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalImports)}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50/50">
                            <div className="flex items-center gap-2 mb-2 text-brand-yellow">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Exports</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalExports)}</p>
                        </div>
                    </div>
                </div>

                {/* Trade Balance */}
                <div className="space-y-3">
                    <span className="text-xs font-bold uppercase text-gray-900 tracking-wider">Net Trade Balance</span>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-brand-red transition-all duration-500"
                            style={{ width: `${(totalImports / (totalImports + totalExports)) * 100}%` }}
                        />
                        <div
                            className="h-full bg-brand-yellow transition-all duration-500"
                            style={{ width: `${(totalExports / (totalImports + totalExports)) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>Import {(totalImports / (totalImports + totalExports) * 100).toFixed(1)}%</span>
                        <span>Export {(totalExports / (totalImports + totalExports) * 100).toFixed(1)}%</span>
                    </div>
                </div>

                {/* Top Products */}
                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs font-bold uppercase text-gray-900 tracking-wider mb-4 border-b border-gray-100 pb-2">Top Imports</h4>
                        <div className="space-y-3">
                            {topImports.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm group">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-gray-300 font-bold">0{i + 1}</span>
                                        <span className="font-medium text-gray-700">{item.product}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{formatCurrency(item.valueUSD)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase text-gray-900 tracking-wider mb-4 border-b border-gray-100 pb-2">Top Exports</h4>
                        <div className="space-y-3">
                            {topExports.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm group">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-gray-300 font-bold">0{i + 1}</span>
                                        <span className="font-medium text-gray-700">{item.product}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{formatCurrency(item.valueUSD)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Data sourced from OECD & FAO {year}</p>
            </div>
        </div>
    );
}
