import { useState, useMemo } from 'react';
import { AFRICAN_COUNTRIES, getTotalImportValue, getTotalExportValue } from '../utils/dataUtils';
import { africaMapPaths } from '../data/africaMapPaths';

interface AfricaMapProps {
  selectedYear: number;
  selectedCountry: string | null;
  onCountryClick: (country: string) => void;
}

export function AfricaMap({ selectedYear, selectedCountry, onCountryClick }: AfricaMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Calculate trade values for color coding
  const countryTradeData = useMemo(() => {
    const data: Record<string, { imports: number; exports: number; balance: number }> = {};
    AFRICAN_COUNTRIES.forEach((country) => {
      const imports = getTotalImportValue(country, selectedYear);
      const exports = getTotalExportValue(country, selectedYear);
      const balance = exports - imports;
      data[country] = { imports, exports, balance };
    });
    return data;
  }, [selectedYear]);

  // Get color based on trade balance
  const getCountryColor = (country: string): string => {
    const data = countryTradeData[country];
    if (!data) return 'rgba(255, 255, 255, 0.05)';

    const { balance } = data;
    if (balance > 0) {
      // Positive balance (Brand Yellow for surplus)
      const intensity = Math.min(balance / 5_000_000_000, 1);
      return `rgba(250, 187, 37, ${0.3 + intensity * 0.6})`;
    } else if (balance < 0) {
      // Negative balance (Brand Red for deficit)
      const intensity = Math.min(Math.abs(balance) / 5_000_000_000, 1);
      return `rgba(183, 43, 24, ${0.3 + intensity * 0.6})`;
    }
    return 'rgba(255, 255, 255, 0.1)'; // Neutral
  };

  const getCountryStroke = (country: string): string => {
    if (selectedCountry === country) {
      return 'rgb(183, 43, 24)'; // Brand red for selected in light mode
    }
    if (hoveredCountry === country) {
      return 'rgba(0, 0, 0, 0.4)';
    }
    return 'rgba(0, 0, 0, 0.05)';
  };

  const getCountryStrokeWidth = (country: string): number => {
    if (selectedCountry === country) return 2.5;
    if (hoveredCountry === country) return 2;
    return 1;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (hoveredCountry) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoverPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
    setHoverPosition(null);
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-gray-100/50">
      <svg
        viewBox="150 50 650 600"
        className="w-full h-full max-h-[90vh]"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="text-gray-200" fill="currentColor" />
          </pattern>
        </defs>
        {/* Ocean Background */}
        <rect x="150" y="50" width="650" height="600" fill="url(#dotPattern)" className="opacity-50" />

        {AFRICAN_COUNTRIES.map((country) => {
          const countryData = africaMapPaths[country];
          if (!countryData) return null;

          const isSelected = selectedCountry === country;
          const isHovered = hoveredCountry === country;

          return (
            <g key={country}>
              <path
                d={countryData.path}
                fill={getCountryColor(country)}
                stroke={getCountryStroke(country)}
                strokeWidth={getCountryStrokeWidth(country)}
                className="cursor-pointer transition-all duration-300 ease-out outline-none"
                onClick={() => onCountryClick(country)}
                onMouseEnter={() => setHoveredCountry(country)}
                style={{
                  opacity: selectedCountry && !isSelected ? 0.3 : 1,
                  filter: isHovered ? 'brightness(1.05)' : 'none',
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Simplified Tooltip */}
      {hoveredCountry && hoverPosition && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 z-50 pointer-events-none rounded shadow-lg text-xs"
          style={{
            left: `${hoverPosition.x + 20}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translateY(-50%)',
          }}
        >
          <span className="font-bold">{hoveredCountry}</span>
        </div>
      )}

      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Trade Balance</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
            <span className="text-[10px] font-bold text-gray-600">Surplus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-red"></div>
            <span className="text-[10px] font-bold text-gray-600">Deficit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
