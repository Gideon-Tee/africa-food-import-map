import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
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
} from '../../../utils/dataUtils';

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
    const importTrend = getYearlyTrend(country, 'imports');
    const exportTrend = getYearlyTrend(country, 'exports');

    return (
        <div className="w-full h-full bg-white flex flex-col relative overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-8 pb-6 flex items-start justify-between relative z-10 border-b border-gray-100 bg-white">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-md">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
                                Country Analytics
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-md border border-gray-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{year} Fiscal</span>
                        </div>
                    </div>
                    <h2 className="text-5xl font-bold text-gray-900 tracking-tight uppercase leading-none">{country}</h2>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Reset Map</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-20 space-y-12 relative z-10 custom-scrollbar pt-8">
                {/* Metrics Spotlight */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Top 3 Imports</span>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{formatCurrency(totalImports)}</p>
                                <div className="flex items-center gap-1.5 text-brand-red text-[10px] font-black uppercase tracking-widest">
                                    <TrendingDown className="w-3.5 h-3.5" />
                                    <span>Outflow</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Top 3 Exports</span>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{formatCurrency(totalExports)}</p>
                                <div className="flex items-center gap-1.5 text-brand-yellow text-[10px] font-black uppercase tracking-widest">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>Inflow</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Import Sources */}
                    <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange"></div>
                        <div className="flex flex-col h-full relative z-10">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Import Sources</span>
                            <div className="space-y-2 flex-1">
                                {imports.length > 0 ? imports.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[9px] font-black text-gray-300 w-3">#{i + 1}</span>
                                            <span className="text-[11px] font-bold text-gray-700 truncate">{item.sourceCountry}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-brand-orange flex-shrink-0">{formatCurrency(item.valueUSD)}</span>
                                    </div>
                                )) : <p className="text-[10px] text-gray-400">No data</p>}
                            </div>
                        </div>
                    </div>

                    {/* Top Export Destinations */}
                    <div className="bg-gray-900 p-6 border border-gray-800 shadow-xl rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
                        <div className="flex flex-col h-full relative z-10">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Export Destinations</span>
                            <div className="space-y-2 flex-1">
                                {exports.length > 0 ? exports.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[9px] font-black text-gray-600 w-3">#{i + 1}</span>
                                            <span className="text-[11px] font-bold text-gray-300 truncate">{item.destinationCountry}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-brand-yellow flex-shrink-0">{formatCurrency(item.valueUSD)}</span>
                                    </div>
                                )) : <p className="text-[10px] text-gray-500">No data</p>}
                            </div>
                        </div>
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

                    {/* Import Composition — chart left, source countries right */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-6 w-1 bg-brand-yellow rounded-full"></div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Import Composition</h3>
                        </div>
                        <div className="flex gap-0 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="w-1/2 flex-shrink-0">
                                <ProductChart imports={imports} exports={exports} type="imports" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center gap-2.5 py-4 pr-4 pl-2">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Source Countries</p>
                                {imports.map((item, i) => (
                                    <div key={i} className="flex flex-col gap-0.5 px-3 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-black text-gray-300">#{i + 1}</span>
                                            <span className="text-[10px] font-bold text-gray-700 truncate">{item.product}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] text-gray-400 italic">from</span>
                                            <span className="text-[10px] font-black text-brand-orange truncate">{item.sourceCountry}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Export Composition — chart left, destination countries right */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-1 bg-brand-orange rounded-full"></div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Export Composition</h3>
                    </div>
                    <div className="flex gap-0 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="w-1/2 flex-shrink-0">
                            <ProductChart imports={imports} exports={exports} type="exports" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-2.5 py-4 pr-4 pl-2">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Destination Countries</p>
                            {exports.map((item, i) => (
                                <div key={i} className="flex flex-col gap-0.5 px-3 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black text-gray-300">#{i + 1}</span>
                                        <span className="text-[10px] font-bold text-gray-700 truncate">{item.product}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[9px] text-gray-400 italic">to</span>
                                        <span className="text-[10px] font-black text-brand-yellow truncate">{item.destinationCountry}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
