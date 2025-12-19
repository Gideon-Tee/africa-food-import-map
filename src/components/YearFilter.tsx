import { YEARS } from '../utils/dataUtils';

interface YearFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearFilter({ selectedYear, onYearChange }: YearFilterProps) {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Select Year</h2>
      <div className="flex gap-4">
        {YEARS.map((year) => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`
              flex-1 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200
              ${
                selectedYear === year
                  ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-lg shadow-brand-red/40 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}

