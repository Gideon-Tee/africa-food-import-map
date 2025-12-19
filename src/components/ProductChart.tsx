import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/dataUtils';
import type { ImportData, ExportData } from '../utils/dataUtils';

interface ProductChartProps {
  imports: ImportData[];
  exports: ExportData[];
  type: 'imports' | 'exports';
}

export function ProductChart({ imports, exports, type }: ProductChartProps) {
  const data = type === 'imports' ? imports : exports;
  
  const chartData = data.map((item) => ({
    name: item.product.length > 20 ? `${item.product.substring(0, 20)}...` : item.product,
    fullName: item.product,
    value: item.valueUSD,
  }));

  const COLORS = [
    'rgb(183, 43, 24)',
    'rgb(250, 187, 37)',
    'rgb(237, 104, 67)',
    'rgba(183, 43, 24, 0.7)',
    'rgba(250, 187, 37, 0.7)',
    'rgba(237, 104, 67, 0.7)',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong rounded-lg p-4 border border-white/20">
          <p className="text-white font-semibold mb-1">{payload[0].payload.fullName}</p>
          <p className="text-brand-yellow text-lg font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-white">
          {type === 'imports' ? 'Import' : 'Export'} Products Distribution
        </h2>
        <p className="text-gray-400 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6 text-white">
        {type === 'imports' ? 'Import' : 'Export'} Products Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => percent ? `${(percent * 100).toFixed(0)}%` : ''}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

