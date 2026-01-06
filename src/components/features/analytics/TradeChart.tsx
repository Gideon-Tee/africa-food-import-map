import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../../utils/dataUtils';

interface TradeChartProps {
    imports: any[];
    exports: any[];
}

export function TradeChart({ imports, exports }: TradeChartProps) {
    const data = [
        ...imports.map(i => ({ name: i.product, value: i.valueUSD, type: 'Import' })),
        ...exports.map(e => ({ name: e.product, value: e.valueUSD, type: 'Export' }))
    ].sort((a, b) => b.value - a.value).slice(0, 5);

    return (
        <div className="h-64 w-full bg-gray-50 rounded-xl p-4 border border-gray-100">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => formatCurrency(value)}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.type === 'Import' ? '#B72B18' : '#FABB25'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
