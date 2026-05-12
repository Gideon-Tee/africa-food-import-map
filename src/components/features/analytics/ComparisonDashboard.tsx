import { ArrowLeft, X } from 'lucide-react';
import {
    getTotalImportValue,
    getTotalExportValue,
    formatCurrency,
} from '../../../utils/dataUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ComparisonDashboardProps {
    countries: string[];
    year: number;
    onClose: () => void;
    onRemoveCountry: (country: string) => void;
}

export function ComparisonDashboard({ countries, year, onClose, onRemoveCountry }: ComparisonDashboardProps) {
    const comparisonData = countries.map(country => {
        const imports = getTotalImportValue(country, year);
        const exports = getTotalExportValue(country, year);
        return {
            country,
            imports,
            exports,
            balance: exports - imports,
            volume: imports + exports
        };
    }).sort((a, b) => b.volume - a.volume);

    return (
        <div className="w-full h-full bg-white flex flex-col relative overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-8 pb-6 flex items-start justify-between relative z-10 border-b border-gray-100 bg-white">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-md">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
                                Comparative Analysis
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-md border border-gray-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{year} Fiscal</span>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight uppercase leading-none">
                        Market Comparison
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        Comparing <span className="text-gray-900 font-bold">{countries.length}</span> active markets
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Map</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-20 pt-8 custom-scrollbar">

                {/* Selected Countries Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {countries.map(country => (
                        <div key={country} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg shadow-sm">
                            <span className="text-xs font-bold uppercase tracking-wider">{country}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemoveCountry(country); }}
                                className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Comparative Charts */}
                <div className="space-y-12">

                    {/* Import/Export Comparison */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-6 w-1 bg-brand-red rounded-full"></div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Trade Volume Comparison</h3>
                        </div>

                        <div className="h-80 w-full bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="country" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => formatCurrency(value as number)}
                                    />
                                    <Legend />
                                    <Bar dataKey="imports" name="Imports" fill="#B72B18" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="exports" name="Exports" fill="#FABB25" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed Stats Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-6 w-1 bg-gray-900 rounded-full"></div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Key Metrics Breakdown</h3>
                        </div>

                        <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Market</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Imports</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Exports</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Balance</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Total Vol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {comparisonData.map((data) => (
                                        <tr key={data.country} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">{data.country}</td>
                                            <td className="px-6 py-4 text-right font-mono text-sm font-medium text-gray-600">
                                                {formatCurrency(data.imports)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-sm font-medium text-gray-600">
                                                {formatCurrency(data.exports)}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-mono text-sm font-bold ${data.balance >= 0 ? 'text-green-600' : 'text-brand-red'}`}>
                                                {data.balance > 0 ? '+' : ''}{formatCurrency(data.balance)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-sm font-black text-gray-900">
                                                {formatCurrency(data.volume)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
