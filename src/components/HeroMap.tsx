import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const AFRICAN_ISO_SET = new Set([
  '12','24','204','72','854','108','132','120','140','148','174','178','384','180',
  '262','818','226','232','748','231','266','270','288','324','624','404','426',
  '430','434','450','454','466','478','480','504','508','516','562','566','646',
  '678','686','690','694','706','710','728','729','768','788','800','834','894','716',
  '012','024','072',
]);

// Earth-tone palette per country (by ISO mod 6)
const FILLS = ['#e8d5a3','#cddbb0','#d6c89a','#b8d4b0','#e0c898','#c8d8a8'];
const getFill = (id: string) => FILLS[parseInt(id || '0') % FILLS.length];

const FOOD_MARKERS: { name: string; emoji: string; coords: [number,number]; delay: number }[] = [
  { name: 'Coffee',   emoji: '☕', coords: [40,  8],  delay: 0    },
  { name: 'Cocoa',    emoji: '🍫', coords: [-3,  7],  delay: 0.6  },
  { name: 'Wheat',    emoji: '🌾', coords: [3,  36],  delay: 1.1  },
  { name: 'Palm Oil', emoji: '🌴', coords: [8,   5],  delay: 0.3  },
  { name: 'Fish',     emoji: '🐟', coords: [-17,15],  delay: 1.5  },
  { name: 'Maize',    emoji: '🌽', coords: [28,-13],  delay: 0.8  },
  { name: 'Sesame',   emoji: '🫘', coords: [32, 16],  delay: 2.0  },
  { name: 'Olive',    emoji: '🫒', coords: [-6, 32],  delay: 1.3  },
  { name: 'Tea',      emoji: '🍵', coords: [37, -2],  delay: 0.5  },
  { name: 'Cassava',  emoji: '🥬', coords: [24, -6],  delay: 1.8  },
];

type GeoObj = { id: string | number; properties: Record<string, unknown> };

export function HeroMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full" style={{ background: 'linear-gradient(160deg, #f5f0e8 0%, #e8f0e0 100%)' }}>
      {/* Decorative background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(250,187,37) 0%, transparent 70%)', top:'10%', right:'5%' }} />
        <div className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(183,43,24) 0%, transparent 70%)', bottom:'15%', left:'10%' }} />
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [22, 2], scale: 380 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} center={[22, 2]} minZoom={1} maxZoom={1}>
          {/* Countries */}
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoObj[] }) =>
              geographies
                .filter(geo => AFRICAN_ISO_SET.has(String(geo.id)))
                .map(geo => (
                  <Geography
                    key={String(geo.id)}
                    geography={geo}
                    fill={getFill(String(geo.id))}
                    stroke="#ffffff"
                    strokeWidth={0.8}
                    style={{
                      default: { outline: 'none', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' },
                      hover:   { outline: 'none', fill: '#f0b060', cursor: 'default' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
            }
          </Geographies>

          {/* Food markers */}
          {FOOD_MARKERS.map(({ name, emoji, coords, delay }) => (
            <Marker key={name} coordinates={coords}>
              {/* Pulse ring */}
              <circle
                r={18} fill="none"
                stroke={hovered === name ? 'rgb(183,43,24)' : 'rgba(183,43,24,0.35)'}
                strokeWidth={1.5}
                style={{ animation: `markerPulse 2.4s ease-in-out ${delay}s infinite` }}
              />
              {/* Badge */}
              <circle
                r={14}
                fill={hovered === name ? 'rgb(183,43,24)' : 'white'}
                stroke={hovered === name ? 'rgb(183,43,24)' : 'rgba(0,0,0,0.1)'}
                strokeWidth={1}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                  cursor: 'pointer',
                  transition: 'fill 0.2s',
                  animation: `markerFloat 3s ease-in-out ${delay}s infinite`,
                }}
                onMouseEnter={() => setHovered(name)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                y={5} textAnchor="middle"
                style={{ fontSize: 13, pointerEvents: 'none', userSelect: 'none' }}
              >
                {emoji}
              </text>
              {/* Label on hover */}
              {hovered === name && (
                <g transform="translate(0, -28)">
                  <rect x={-28} y={-12} width={56} height={16} rx={4}
                    fill="rgb(17,24,39)" opacity={0.9} />
                  <text y={0} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'white', fontWeight: 700, letterSpacing: '0.05em', pointerEvents: 'none' }}>
                    {name.toUpperCase()}
                  </text>
                </g>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 shadow-md">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Key Commodities</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {FOOD_MARKERS.slice(0, 6).map(({ name, emoji }) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className="text-xs">{emoji}</span>
              <span className="text-[10px] font-semibold text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes markerPulse {
          0%,100% { r: 18; opacity: 0.4; }
          50%      { r: 24; opacity: 0;   }
        }
        @keyframes markerFloat {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
