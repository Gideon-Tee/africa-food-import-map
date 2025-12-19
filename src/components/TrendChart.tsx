import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/dataUtils';

interface TrendChartProps {
  data: { year: number; value: number }[];
  title: string;
  color: string;
}

export function TrendChart({ data, title, color }: TrendChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-xl">
          <p className="text-gray-900 font-semibold mb-1">{payload[0].payload.year}</p>
          <p style={{ color }} className="text-lg font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8"
            style={{ fontSize: '14px' }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, r: 6, strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 8, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
