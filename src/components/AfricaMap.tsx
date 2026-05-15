import { useState, useMemo, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import {
  AFRICAN_COUNTRIES,
  getTotalImportValue,
  getTotalExportValue,
  formatCurrency,
} from '../utils/dataUtils';

// Natural Earth GeoJSON with name properties — more reliable than ISO numeric codes
const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

// ISO 3166-1 numeric → our exact country name (from AFRICAN_COUNTRIES)
const ISO_TO_COUNTRY: Record<string, string> = {
  '12': 'Algeria',           '24': 'Angola',          '204': 'Benin',
  '72': 'Botswana',          '854': 'Burkina Faso',   '108': 'Burundi',
  '132': 'Cabo Verde',       '120': 'Cameroon',       '140': 'Central African Republic',
  '148': 'Chad',             '174': 'Comoros',        '178': 'Congo',
  '384': "Côte d'Ivoire",   '180': 'Democratic Republic of the Congo',
  '262': 'Djibouti',         '818': 'Egypt',          '226': 'Equatorial Guinea',
  '232': 'Eritrea',          '748': 'Eswatini',       '231': 'Ethiopia',
  '266': 'Gabon',            '270': 'Gambia',         '288': 'Ghana',
  '324': 'Guinea',           '624': 'Guinea-Bissau',  '404': 'Kenya',
  '426': 'Lesotho',          '430': 'Liberia',        '434': 'Libya',
  '450': 'Madagascar',       '454': 'Malawi',         '466': 'Mali',
  '478': 'Mauritania',       '480': 'Mauritius',      '504': 'Morocco',
  '508': 'Mozambique',       '516': 'Namibia',        '562': 'Niger',
  '566': 'Nigeria',          '646': 'Rwanda',         '678': 'Sao Tome and Principe',
  '686': 'Senegal',          '690': 'Seychelles',     '694': 'Sierra Leone',
  '706': 'Somalia',          '710': 'South Africa',   '728': 'South Sudan',
  '729': 'Sudan',            '768': 'Togo',           '788': 'Tunisia',
  '800': 'Uganda',           '834': 'United Republic of Tanzania',
  '894': 'Zambia',           '716': 'Zimbabwe',
  // Zero-padded variants — only needed for codes < 100 (1–2 digit originals)
  '012': 'Algeria',
  '024': 'Angola',
  '072': 'Botswana',
};

const AFRICAN_ISO_SET = new Set(Object.keys(ISO_TO_COUNTRY));

// Country name variants from Natural Earth / other GeoJSON sources
// Used as fallback when numeric ID lookup fails
const NAME_VARIANTS: Record<string, string> = {
  'Algeria': 'Algeria',
  'Angola': 'Angola',
  'Benin': 'Benin',
  'Botswana': 'Botswana',
  'Burkina Faso': 'Burkina Faso',
  'Burundi': 'Burundi',
  'Cabo Verde': 'Cabo Verde',
  'Cape Verde': 'Cabo Verde',
  'Cameroon': 'Cameroon',
  'Central African Rep.': 'Central African Republic',
  'Central African Republic': 'Central African Republic',
  'Chad': 'Chad',
  'Comoros': 'Comoros',
  'Congo': 'Congo',
  'Republic of the Congo': 'Congo',
  "Côte d'Ivoire": "Côte d'Ivoire",
  "Ivory Coast": "Côte d'Ivoire",
  "Cote d'Ivoire": "Côte d'Ivoire",
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
  'Congo, Dem. Rep.': 'Democratic Republic of the Congo',
  'Djibouti': 'Djibouti',
  'Egypt': 'Egypt',
  'Equatorial Guinea': 'Equatorial Guinea',
  'Eq. Guinea': 'Equatorial Guinea',
  'Eritrea': 'Eritrea',
  'Eswatini': 'Eswatini',
  'Swaziland': 'Eswatini',
  'Ethiopia': 'Ethiopia',
  'Gabon': 'Gabon',
  'Gambia': 'Gambia',
  'Ghana': 'Ghana',
  'Guinea': 'Guinea',
  'Guinea-Bissau': 'Guinea-Bissau',
  'Kenya': 'Kenya',
  'Lesotho': 'Lesotho',
  'Liberia': 'Liberia',
  'Libya': 'Libya',
  'Madagascar': 'Madagascar',
  'Malawi': 'Malawi',
  'Mali': 'Mali',
  'Mauritania': 'Mauritania',
  'Mauritius': 'Mauritius',
  'Morocco': 'Morocco',
  'Mozambique': 'Mozambique',
  'Namibia': 'Namibia',
  'Niger': 'Niger',
  'Nigeria': 'Nigeria',
  'Rwanda': 'Rwanda',
  'Sao Tome and Principe': 'Sao Tome and Principe',
  'São Tomé and Príncipe': 'Sao Tome and Principe',
  'S. Tome and Principe': 'Sao Tome and Principe',
  'Senegal': 'Senegal',
  'Seychelles': 'Seychelles',
  'Sierra Leone': 'Sierra Leone',
  'Somalia': 'Somalia',
  'South Africa': 'South Africa',
  'South Sudan': 'South Sudan',
  'S. Sudan': 'South Sudan',
  'Sudan': 'Sudan',
  'Togo': 'Togo',
  'Tunisia': 'Tunisia',
  'Uganda': 'Uganda',
  'Tanzania': 'United Republic of Tanzania',
  'United Republic of Tanzania': 'United Republic of Tanzania',
  'Zambia': 'Zambia',
  'Zimbabwe': 'Zimbabwe',
};

const AFRICAN_NAME_SET = new Set(Object.keys(NAME_VARIANTS));

type GeoObject = {
  id: string | number;
  rsmKey?: string;
  properties: Record<string, unknown>;
};

/** Resolve a geography feature to our canonical country name */
function resolveCountry(geo: GeoObject): string | null {
  // Primary: numeric ISO ID lookup
  const byId = ISO_TO_COUNTRY[String(geo.id)];
  if (byId) return byId;

  // Fallback: try common name properties from various GeoJSON sources
  const props = geo.properties;
  const candidates = [
    props['name'], props['NAME'], props['NAME_LONG'],
    props['ADMIN'], props['SOVEREIGNT'], props['geounit'],
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && NAME_VARIANTS[c]) {
      return NAME_VARIANTS[c];
    }
  }
  return null;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.5;

interface AfricaMapProps {
  selectedYear: number;
  selectedCountries: string[];
  onCountryClick: (country: string) => void;
}

export function AfricaMap({ selectedYear, selectedCountries, onCountryClick }: AfricaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([22, 2]);

  const countryTradeData = useMemo(() => {
    const data: Record<string, { imports: number; exports: number; balance: number }> = {};
    AFRICAN_COUNTRIES.forEach((country) => {
      const imports = getTotalImportValue(country, selectedYear);
      const exports = getTotalExportValue(country, selectedYear);
      data[country] = { imports, exports, balance: exports - imports };
    });
    return data;
  }, [selectedYear]);

  const getCountryFill = useCallback(
    (name: string, isSelected: boolean, isHovered: boolean): string => {
      if (isSelected) return '#B72B18';
      if (isHovered) return '#93c5fd';
      const d = countryTradeData[name];
      if (!d || (d.imports === 0 && d.exports === 0)) return '#D1D5DB';
      const intensity = Math.min(Math.abs(d.balance) / 5_000_000_000, 1);
      const alpha = 0.3 + intensity * 0.6;
      return d.balance >= 0 ? `rgba(250,187,37,${alpha})` : `rgba(183,43,24,${alpha})`;
    },
    [countryTradeData]
  );

  const handleMouseMove = (evt: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: evt.clientX - rect.left, y: evt.clientY - rect.top });
  };

  const zoomIn = () => setZoom((z) => Math.min(z * ZOOM_STEP, MAX_ZOOM));
  const zoomOut = () => setZoom((z) => Math.max(z / ZOOM_STEP, MIN_ZOOM));
  const resetView = () => { setZoom(1); setCenter([22, 2]); };

  const tooltipData = hoveredCountry ? countryTradeData[hoveredCountry] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#dde8f0] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center, scale: 390 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ zoom: z, coordinates }: { zoom: number; coordinates: [number, number] }) => {
            setZoom(z);
            setCenter(coordinates);
          }}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoObject[] }) =>
              geographies.map((geo: GeoObject) => {
                const name = resolveCountry(geo);
                // Skip non-African or unrecognised countries
                if (!name) {
                  // Extra check: if the feature doesn't appear in AFRICAN_ISO_SET
                  // and name lookup failed, skip
                  const inSet = AFRICAN_ISO_SET.has(String(geo.id));
                  const props = geo.properties;
                  const hasNameMatch = [props['name'], props['NAME'], props['ADMIN']]
                    .some((v) => typeof v === 'string' && AFRICAN_NAME_SET.has(v));
                  if (!inSet && !hasNameMatch) return null;
                  return null;
                }

                const isSelected = selectedCountries.includes(name);
                const isHovered = hoveredCountry === name;
                const dimmed = selectedCountries.length > 0 && !isSelected;

                return (
                  <Geography
                    key={String(geo.id)}
                    geography={geo}
                    fill={getCountryFill(name, isSelected, isHovered)}
                    stroke={isSelected ? '#7f1d1d' : '#ffffff'}
                    strokeWidth={isSelected ? 1.5 / zoom : 0.6 / zoom}
                    style={{
                      default: {
                        outline: 'none',
                        opacity: dimmed ? 0.35 : 1,
                        transition: 'opacity 0.3s, fill 0.2s',
                      },
                      hover: { outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onClick={() => onCountryClick(name)}
                    onMouseEnter={() => setHoveredCountry(name)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5">
        {[
          { icon: <Plus className="w-4 h-4 text-gray-700" />, action: zoomIn, disabled: zoom >= MAX_ZOOM, title: 'Zoom in' },
          { icon: <Minus className="w-4 h-4 text-gray-700" />, action: zoomOut, disabled: zoom <= MIN_ZOOM, title: 'Zoom out' },
          { icon: <RotateCcw className="w-3.5 h-3.5 text-gray-700" />, action: resetView, disabled: false, title: 'Reset view' },
        ].map(({ icon, action, disabled, title }) => (
          <button
            key={title}
            onClick={action}
            disabled={disabled}
            className="w-9 h-9 bg-white border border-gray-200 rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title={title}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredCountry && tooltipData && (
        <div
          className="absolute pointer-events-none z-50 bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden min-w-[190px]"
          style={{
            left: Math.min(mousePos.x + 16, (containerRef.current?.clientWidth ?? 400) - 210),
            top: Math.max(8, mousePos.y - 100),
          }}
        >
          <div className="px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="font-black text-sm tracking-tight">{hoveredCountry}</p>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            <div className="flex justify-between gap-8">
              <span className="text-gray-400 text-[11px]">Imports</span>
              <span className="text-red-400 text-[11px] font-black">{formatCurrency(tooltipData.imports)}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-gray-400 text-[11px]">Exports</span>
              <span className="text-yellow-400 text-[11px] font-black">{formatCurrency(tooltipData.exports)}</span>
            </div>
            <div className="flex justify-between gap-8 pt-1.5 border-t border-gray-700/60">
              <span className="text-gray-400 text-[11px]">Balance</span>
              <span className={`text-[11px] font-black ${tooltipData.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tooltipData.balance >= 0 ? '+' : ''}{formatCurrency(tooltipData.balance)}
              </span>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-gray-800/60 border-t border-gray-700">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Click to analyse</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-5 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-md">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Trade Balance</p>
        <div className="flex flex-col gap-1.5">
          {[
            { color: 'bg-yellow-400', label: 'Surplus' },
            { color: 'bg-red-600', label: 'Deficit' },
            { color: 'bg-gray-300', label: 'No data' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-2.5 rounded-sm ${color}`} />
              <span className="text-[10px] font-bold text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {zoom > 1 && (
        <div className="absolute bottom-5 right-4 bg-white/90 border border-gray-200 rounded-lg px-2.5 py-1 shadow-sm">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{zoom.toFixed(1)}×</span>
        </div>
      )}

      {selectedCountries.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {selectedCountries.length} market{selectedCountries.length > 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
