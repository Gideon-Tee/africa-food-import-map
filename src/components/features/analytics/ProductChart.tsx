import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../../utils/dataUtils';

interface ProductChartProps {
    imports: any[];
    exports: any[];
    type: 'imports' | 'exports';
}

const COLORS = ['#B72B18', '#FABB25', '#ED6843', '#1F2937', '#9CA3AF'];

export function ProductChart({ imports, exports, type }: ProductChartProps) {
    const data = type === 'imports' ? imports : exports;
    const chartData = data.slice(0, 5).map(item => ({
        name: item.product,
        value: item.valueUSD
    }));

    return (
        <div className="h-64 w-full bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-bold text-gray-500 uppercase ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
