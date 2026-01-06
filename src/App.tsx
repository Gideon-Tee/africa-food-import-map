import { useState } from 'react';
import { Globe2, BarChart3, ChevronRight, LayoutDashboard } from 'lucide-react';
import { AfricaMap } from './components/AfricaMap';
import { CountryDashboard } from './components/features/analytics/CountryDashboard';
import { YEARS } from './utils/dataUtils';
import { CountrySearch } from './components/features/navigation/CountrySearch';

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(YEARS[YEARS.length - 1]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
    setIsMapCollapsed(true);
  };

  const handleCloseDashboard = () => {
    setSelectedCountry(null);
    setIsMapCollapsed(false);
  };

  const toggleMap = () => {
    setIsMapCollapsed(!isMapCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-brand-red/30">
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col hidden lg:flex relative z-30 flex-shrink-0">
          <div className="p-8 border-b border-gray-100 bg-white">
            <div className="flex flex-col gap-1 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-10 bg-brand-red rounded-full shadow-sm"></div>
                <h1 className="text-4xl font-[900] tracking-tighter leading-none flex flex-col">
                  <span className="text-brand-red">GBHub</span>
                  <span className="text-gray-900 -mt-2">Africa</span>
                </h1>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-3 px-1">
                Food map
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                  Fiscal Period
                </h2>
              </div>

              {/* Prominent Year Selection */}
              <div className="flex flex-col gap-3">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`
                        w-full py-5 px-6 text-xl font-[900] rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group
                        ${selectedYear === year
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-[1.02]'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-brand-red hover:text-brand-red hover:bg-red-50/30'}
                        `}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="tracking-tight">{year}</span>
                      {selectedYear === year && <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></div>}
                    </div>
                    {selectedYear === year && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-end">
            <div className="bg-gradient-to-br from-brand-red/5 to-transparent p-6 rounded-2xl border border-brand-red/10">
              <p className="text-xs text-brand-red font-bold uppercase tracking-widest mb-2"></p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-bold text-gray-900">Live Data Feed</span>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">v2.4.0 Stable</span>
            </div>
            <p className="text-[9px] text-gray-300 font-medium text-center uppercase tracking-tighter">
              © 2024 GB FOODS STRATEGY
            </p>
          </div> */}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
          {/* Top Bar */}
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20 shrink-0">
            <div className="flex items-center gap-4 lg:hidden">
              <span className="text-xl font-black text-brand-red">GB FOODS</span>
            </div>



            <div className="hidden lg:flex items-center gap-6 flex-1 justify-end max-w-3xl">
              <div className="w-80">
                <CountrySearch
                  selectedCountry={selectedCountry}
                  onSelect={handleCountryClick}
                />
              </div>

              <button
                onClick={toggleMap}
                disabled={!selectedCountry}
                className={`
                  flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm border flex-shrink-0
                  ${isMapCollapsed
                    ? 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm'
                    : 'bg-gray-900 border-gray-900 text-white shadow-lg'}
                   ${!selectedCountry ? 'opacity-50 cursor-not-allowed grayscale' : 'opacity-100'}
                `}
              >
                {isMapCollapsed ? <Globe2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>{isMapCollapsed ? 'Show Interactive Map' : 'Focus Dashboard'}</span>
              </button>
            </div>
          </header>

          {/* Main Layout Content */}
          <div className="flex-1 flex flex-row overflow-hidden p-6 gap-6 relative">

            {/* Map Section (Collapsible) */}
            <div className={`
               ${isMapCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-full lg:w-[45%] opacity-100'}
               h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-0
            `}>
              <div className="w-full h-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
                <AfricaMap
                  selectedYear={selectedYear}
                  selectedCountry={selectedCountry}
                  onCountryClick={handleCountryClick}
                />

                {/* Floating Map Indicators */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Map Mode</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Section (Right Panel) */}
            <div className={`
               ${isMapCollapsed ? 'w-full' : 'w-[55%]'}
               ${!selectedCountry && !isMapCollapsed ? 'lg:w-[55%]' : ''}
               h-full bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10
            `}>
              {selectedCountry ? (
                <CountryDashboard
                  country={selectedCountry}
                  year={selectedYear}
                  onClose={handleCloseDashboard}
                />
              ) : (
                <div className="flex-1 h-full flex items-center justify-center bg-gray-50/50">
                  <div className="text-center p-10">
                    <div className="w-20 h-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-3">
                      <BarChart3 className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Analytics Ready</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Select a country on the map to visualize trade flows, volume metrics, and historical trends.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
