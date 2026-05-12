import { useState } from 'react';
import { Globe2, BarChart3, ChevronRight, LayoutDashboard } from 'lucide-react';
import { AfricaMap } from './components/AfricaMap';
import { CountryDashboard } from './components/features/analytics/CountryDashboard';
import { ComparisonDashboard } from './components/features/analytics/ComparisonDashboard';
import { CountrySearch } from './components/features/navigation/CountrySearch';
import { YEARS } from './utils/dataUtils';

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(YEARS[YEARS.length - 1]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  const handleCountryClick = (country: string) => {
    setSelectedCountries((prev) => {
      const isSelected = prev.includes(country);
      const next = isSelected ? prev.filter((c) => c !== country) : [...prev, country];
      if (next.length > 0) setIsMapCollapsed(true);
      return next;
    });
  };

  const handleRemoveCountry = (country: string) => {
    setSelectedCountries((prev) => prev.filter((c) => c !== country));
  };

  const handleCloseDashboard = () => {
    setSelectedCountries([]);
    setIsMapCollapsed(false);
  };

  const toggleMap = () => setIsMapCollapsed((v) => !v);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-brand-red/30">
      <div className="relative z-10 flex h-screen overflow-hidden">

        {/* ── Left Sidebar ── */}
        <aside className="w-80 bg-white border-r border-gray-200 hidden lg:flex flex-col flex-shrink-0 relative z-30">
          <div className="p-8 border-b border-gray-100">
            {/* Logo */}
            <div className="flex flex-col gap-1 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-10 bg-brand-red rounded-full shadow-sm" />
                <h1 className="text-4xl font-[900] tracking-tighter leading-none flex flex-col">
                  <span className="text-brand-red">Africa Food</span>
                  <span className="text-gray-900 -mt-1">Import Map</span>
                </h1>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-3 px-1">
                Trade Intelligence
              </p>
            </div>

            {/* Year selector */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 px-1">
                <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                Fiscal Period
              </h2>
              <div className="flex flex-col gap-3">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`w-full py-5 px-6 text-xl font-[900] rounded-2xl transition-all duration-300 border-2 relative overflow-hidden
                      ${selectedYear === year
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-[1.02]'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-brand-red hover:text-brand-red hover:bg-red-50/30'}`}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="tracking-tight">{year}</span>
                      {selectedYear === year && <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">

          {/* Top Bar */}
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20 shrink-0">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="text-xl font-black text-brand-red">Africa Food Import Map</span>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-end max-w-3xl">
              <div className="w-48 md:w-64 lg:w-80">
                <CountrySearch
                  selectedCountry={null}
                  onSelect={(country) => {
                    if (!selectedCountries.includes(country)) handleCountryClick(country);
                  }}
                />
              </div>

              <button
                onClick={toggleMap}
                disabled={selectedCountries.length === 0}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm border flex-shrink-0
                  ${isMapCollapsed ? 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm' : 'bg-gray-900 border-gray-900 text-white shadow-lg'}
                  ${selectedCountries.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isMapCollapsed ? <Globe2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>{isMapCollapsed ? 'Show Map' : 'Focus Dashboard'}</span>
              </button>
            </div>
          </header>

          {/* Split Layout */}
          <div className="flex-1 flex flex-row overflow-hidden p-6 gap-6">

            {/* Map (collapsible) */}
            <div className={`${isMapCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-full lg:w-[45%] opacity-100'}
              h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative`}>
              <div className="w-full h-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <AfricaMap
                  selectedYear={selectedYear}
                  selectedCountries={selectedCountries}
                  onCountryClick={handleCountryClick}
                />
              </div>
            </div>

            {/* Dashboard Panel */}
            <div className={`${isMapCollapsed ? 'w-full' : 'w-[55%]'}
              h-full bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}>

              {selectedCountries.length === 1 ? (
                <CountryDashboard
                  country={selectedCountries[0]}
                  year={selectedYear}
                  onClose={handleCloseDashboard}
                />
              ) : selectedCountries.length > 1 ? (
                <ComparisonDashboard
                  countries={selectedCountries}
                  year={selectedYear}
                  onClose={handleCloseDashboard}
                  onRemoveCountry={handleRemoveCountry}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50/50">
                  <div className="text-center p-10">
                    <div className="w-20 h-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-3">
                      <BarChart3 className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Analytics Ready</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      Select countries on the map or use search to visualise trade flows. Select multiple to compare.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 h-9 bg-gray-900 flex items-center justify-center z-50 border-t border-gray-800">
        <p className="text-[11px] font-bold text-gray-400 tracking-wide">
          Powered by{' '}
          <span className="text-brand-red font-black">GBHub</span>
          <span className="text-brand-yellow font-black"> Africa</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
