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
    <div className="w-full h-full relative flex flex-col p-6">
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Map Legend</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-brand-yellow shadow-[0_0_10px_rgba(250,187,37,0.4)]"></div>
              <span className="text-[11px] font-bold text-gray-500 uppercase">Trade Surplus</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-brand-red shadow-[0_0_10px_rgba(183,43,24,0.4)]"></div>
              <span className="text-[11px] font-bold text-gray-500 uppercase">Trade Deficit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        <svg
          viewBox="150 50 650 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
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
                  className="cursor-pointer transition-all duration-500 ease-out outline-none"
                  onClick={() => onCountryClick(country)}
                  onMouseEnter={() => setHoveredCountry(country)}
                  style={{
                    filter: isSelected ? 'url(#glow) brightness(0.9)' : isHovered ? 'brightness(1.05)' : 'none',
                    opacity: selectedCountry && !isSelected ? 0.2 : 1,
                    transform: isHovered || isSelected ? 'scale(1.02) translate(-1%, -1%)' : 'scale(1)',
                    transformOrigin: 'center center',
                    zIndex: isHovered || isSelected ? 50 : 0
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Glassy hover tooltip */}
        {hoveredCountry && hoverPosition && (
          <div
            className="absolute bg-white/90 px-4 py-3 z-20 pointer-events-none animate-fade-in backdrop-blur-xl border border-gray-200 shadow-2xl"
            style={{
              left: `${hoverPosition.x + 20}px`,
              top: `${hoverPosition.y}px`,
              transform: 'translateY(-50%)',
            }}
          >
            <p className="font-bold text-gray-900 text-lg mb-1">{hoveredCountry}</p>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Imports: </span>
                <span className="text-brand-red font-bold">
                  ${(countryTradeData[hoveredCountry]?.imports / 1_000_000).toFixed(0)}M
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Exports: </span>
                <span className="text-brand-yellow font-bold">
                  ${(countryTradeData[hoveredCountry]?.exports / 1_000_000).toFixed(0)}M
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
