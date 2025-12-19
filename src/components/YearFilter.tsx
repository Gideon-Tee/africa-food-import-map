import { YEARS } from '../utils/dataUtils';

interface YearFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  isMobile?: boolean;
}

export function YearFilter({ selectedYear, onYearChange, isMobile }: YearFilterProps) {
  if (isMobile) {
    return (
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-red"
      >
        {YEARS.map((year) => (
          <option key={year} value={year} className="bg-slate-900">
            {year}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {YEARS.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`
            w-full px-4 py-3 text-left font-bold transition-all duration-200 flex items-center justify-between
            ${
              selectedYear === year
                ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
            }
          `}
        >
          <span>{year} Analysis</span>
          {selectedYear === year && (
            <div className="w-2 h-2 bg-brand-yellow animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );
}

