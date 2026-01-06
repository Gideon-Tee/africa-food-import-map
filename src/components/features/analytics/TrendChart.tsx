import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../../utils/dataUtils';

interface TrendChartProps {
    data: any[];
    title: string;
    color: string;
}

export function TrendChart({ data, title, color }: TrendChartProps) {
    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h4 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">{title}</h4>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`color${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: any) => [formatCurrency(value), 'Value']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#color${title.replace(/\s/g, '')})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
