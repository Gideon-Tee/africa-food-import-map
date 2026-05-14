import { useState } from 'react';
import { Globe2, ChevronRight, LayoutDashboard } from 'lucide-react';
import { AfricaMap } from './components/AfricaMap';
import { CountryDashboard } from './components/features/analytics/CountryDashboard';
import { ComparisonDashboard } from './components/features/analytics/ComparisonDashboard';
import { AfricaOverview } from './components/features/analytics/AfricaOverview';
import { CountrySearch } from './components/features/navigation/CountrySearch';
import { LandingPage } from './components/LandingPage';
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

  const handleRemoveCountry = (country: string) =>
    setSelectedCountries((prev) => prev.filter((c) => c !== country));

  const handleCloseDashboard = () => {
    setSelectedCountries([]);
    setIsMapCollapsed(false);
  };

  const toggleMap = () => setIsMapCollapsed((v) => !v);

  const scrollToLanding = () =>
    document.getElementById('landing-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    /*
     * Outer scroll container: two full-viewport sections, snapped on scroll.
     * The native scrollbar appears on the right and lets the user navigate between pages.
     */
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
      }}
    >
      {/* ── PAGE 1: Landing ── */}
      <section
        id="landing-section"
        style={{ height: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
      >
        <LandingPage />
      </section>

      {/* ── PAGE 2: Dashboard ── */}
      <section
        id="dashboard-section"
        style={{ height: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
        className="flex overflow-hidden bg-gray-50 text-gray-900 selection:bg-brand-red/30"
      >
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 hidden lg:flex flex-col flex-shrink-0 z-30">
          <div className="p-8 border-b border-gray-100">
            {/* App name — click scrolls back to landing */}
            <div
              className="flex flex-col items-start gap-1 mb-10 cursor-pointer group"
              onClick={scrollToLanding}
              title="Back to overview"
            >
              <h1 className="text-2xl font-[900] leading-tight tracking-tight group-hover:opacity-75 transition-opacity">
                <span className="text-brand-red">Africa Food</span>
                <br />
                <span className="text-gray-900">EXIM Map</span>
              </h1>
              <div className="mt-2 h-0.5 w-12 bg-brand-red rounded-full" />
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">↑ Back to overview</p>
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

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Top Bar */}
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20 shrink-0">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="text-xl font-[900] text-brand-red">Africa Food</span>
              <span className="text-xl font-[900] text-gray-900">EXIM Map</span>
            </div>
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
            {/* Map — with hint overlay */}
            <div className={`${isMapCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-full lg:w-[45%] opacity-100'}
              h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative flex flex-col gap-2`}>
              {/* Hint banner */}
              {!isMapCollapsed && (
                <div className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse flex-shrink-0" />
                  <p className="text-[11px] text-gray-500 font-medium">
                    <span className="font-black text-gray-700">Select a country</span> on the map or use the search bar.
                    Pick multiple to compare side by side.
                  </p>
                </div>
              )}
              <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden min-h-0">
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
                <CountryDashboard country={selectedCountries[0]} year={selectedYear} onClose={handleCloseDashboard} />
              ) : selectedCountries.length > 1 ? (
                <ComparisonDashboard
                  countries={selectedCountries} year={selectedYear}
                  onClose={handleCloseDashboard} onRemoveCountry={handleRemoveCountry}
                />
              ) : (
                <AfricaOverview year={selectedYear} />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 h-9 bg-gray-900 flex items-center justify-center z-50 border-t border-gray-800">
          <p className="text-[11px] font-bold text-gray-400 tracking-wide">
            Powered by{' '}
            <span className="text-brand-red font-black">GBHub</span>
            <span className="text-brand-yellow font-black"> Africa</span>
          </p>
        </footer>
      </section>
    </div>
  );
}

export default App;
