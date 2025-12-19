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
    <div className="grid grid-cols-1 gap-3">
      {YEARS.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`
            group relative w-full px-5 py-4 transition-all duration-300 rounded-xl border-2 flex items-center justify-between overflow-hidden
            ${
              selectedYear === year
                ? 'bg-brand-red border-brand-red text-white shadow-xl shadow-brand-red/20 scale-[1.02]'
                : 'bg-white border-gray-100 text-gray-400 hover:border-brand-red/30 hover:text-gray-600 hover:shadow-md'
            }
          `}
        >
          <div className="flex flex-col items-start relative z-10">
            <span className={`text-[10px] uppercase tracking-[0.2em] font-black ${selectedYear === year ? 'text-brand-yellow' : 'text-gray-300 group-hover:text-brand-orange'}`}>
              Fiscal Year
            </span>
            <span className="text-xl font-black tracking-tight mt-0.5">{year}</span>
          </div>
          
          <div className="relative z-10">
            {selectedYear === year ? (
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-brand-yellow rounded-full animate-pulse"></div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-brand-red/5 transition-colors">
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover:bg-brand-red/30"></div>
              </div>
            )}
          </div>

          {/* Background Decoration */}
          {selectedYear === year && (
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          )}
        </button>
      ))}
    </div>
  );
}

