import { formatCurrency } from '../../../utils/dataUtils';

interface ImportExportPanelProps {
    imports: any[];
    exports: any[];
    totalImports: number;
    totalExports: number;
}

export function ImportExportPanel({ imports, exports }: ImportExportPanelProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Imports Table */}
            <div>
                <h3 className="text-sm font-black uppercase text-gray-900 tracking-wider mb-6 pb-2 border-b border-gray-100">
                    Received Shipments (Imports)
                </h3>
                <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        <div className="col-span-1">#</div>
                        <div className="col-span-8">Product Category</div>
                        <div className="col-span-3 text-right">Value (USD)</div>
                    </div>
                    {imports.map((item, index) => (
                        <div key={`${item.product}-${index}`} className="grid grid-cols-12 items-center py-3 px-2 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <div className="col-span-1 font-mono text-xs text-brand-red/50 font-bold">{index + 1}</div>
                            <div className="col-span-8 font-medium text-gray-700 text-sm truncate pr-4">{item.product}</div>
                            <div className="col-span-3 text-right font-bold text-gray-900 text-sm">{formatCurrency(item.valueUSD)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exports Table */}
            <div>
                <h3 className="text-sm font-black uppercase text-gray-900 tracking-wider mb-6 pb-2 border-b border-gray-100">
                    Outbound Trade (Exports)
                </h3>
                <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        <div className="col-span-1">#</div>
                        <div className="col-span-8">Product Category</div>
                        <div className="col-span-3 text-right">Value (USD)</div>
                    </div>
                    {exports.map((item, index) => (
                        <div key={`${item.product}-${index}`} className="grid grid-cols-12 items-center py-3 px-2 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <div className="col-span-1 font-mono text-xs text-brand-yellow font-bold">{index + 1}</div>
                            <div className="col-span-8 font-medium text-gray-700 text-sm truncate pr-4">{item.product}</div>
                            <div className="col-span-3 text-right font-bold text-gray-900 text-sm">{formatCurrency(item.valueUSD)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
