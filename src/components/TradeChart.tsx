import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/dataUtils';
import type { ImportData, ExportData } from '../utils/dataUtils';

interface TradeChartProps {
  imports: ImportData[];
  exports: ExportData[];
}

export function TradeChart({ imports, exports }: TradeChartProps) {
  const chartData = [
    {
      name: 'Imports',
      value: imports.reduce((sum, item) => sum + item.valueUSD, 0),
    },
    {
      name: 'Exports',
      value: exports.reduce((sum, item) => sum + item.valueUSD, 0),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong rounded-lg p-4 border border-white/20">
          <p className="text-white font-semibold mb-1">{payload[0].name}</p>
          <p className="text-brand-yellow text-lg font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6 text-white">Trade Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af"
            style={{ fontSize: '14px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="url(#colorGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(183, 43, 24)" stopOpacity={0.8} />
              <stop offset="100%" stopColor="rgb(237, 104, 67)" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

