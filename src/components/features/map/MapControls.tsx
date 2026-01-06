import { YEARS } from '../../../utils/dataUtils';

interface MapControlsProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
    onResetZoom: () => void;
}

export function MapControls({ selectedYear, onYearChange, onResetZoom }: MapControlsProps) {
    return (
        <div className="absolute top-6 left-6 flex flex-col gap-4 z-20">
            {/* Brand / Logo Area */}
            <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-4 rounded-xl">
                <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">
                    <span className="text-brand-red">GB</span> FOODS
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-1">
                    Trade Intelligence
                </p>
            </div>

            {/* Year Filter */}
            <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-2 rounded-xl flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-gray-400 px-2 pt-1">Fiscal Year</label>
                {YEARS.map((year) => (
                    <button
                        key={year}
                        onClick={() => onYearChange(year)}
                        className={`
              px-3 py-2 text-sm font-bold rounded-lg transition-all text-left flex items-center justify-between
              ${selectedYear === year
                                ? 'bg-brand-red text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'}
            `}
                    >
                        {year}
                        {selectedYear === year && <div className="w-1.5 h-1.5 bg-white rounded-full ml-2" />}
                    </button>
                ))}
            </div>

            {/* Reset Zoom Button */}
            <button
                onClick={onResetZoom}
                className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-3 rounded-xl font-bold text-xs text-gray-600 hover:text-brand-red hover:bg-red-50 transition-colors uppercase tracking-wider"
            >
                Reset View
            </button>
        </div>
    );
}
