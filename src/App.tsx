import { useState } from 'react';
import { Globe2, BarChart3 } from 'lucide-react';
import { AfricaMap } from './components/AfricaMap';
import { CountryDashboard } from './components/CountryDashboard';
import { YearFilter } from './components/YearFilter';
import { Methodology } from './components/Methodology';
import { DownloadButton } from './components/DownloadButton';
import { YEARS } from './utils/dataUtils';

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(YEARS[YEARS.length - 1]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCloseDashboard = () => {
    setSelectedCountry(null);
  };

  const toggleMap = () => {
    setIsMapCollapsed(!isMapCollapsed);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 selection:bg-brand-red/30">
      {/* Background patterns */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(183,43,24,0.05),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col hidden lg:flex shadow-xl relative z-30">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-brand-red rounded-full"></div>
                <h1 className="text-3xl font-[900] tracking-tighter leading-none flex flex-col">
                  <span className="text-brand-red">GB</span>
                  <span className="text-gray-900 -mt-1">FOODS</span>
                </h1>
              </div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-brand-orange font-black mt-2 px-1">
                Africa Insights Hub
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Time Period</h2>
                <div className="h-[1px] flex-1 bg-gray-100 ml-4"></div>
              </div>
              <YearFilter
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="bg-brand-red/[0.02] p-6 border border-brand-red/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-4 text-brand-red">
                  <div className="p-2 bg-brand-red/10 rounded-lg">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-tight">Analytics Guide</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Explore food trade flows across the continent. Select a country to view detailed import/export metrics and year-on-year trends.
                </p>
              </div>
              
              <div className="px-2">
                <DownloadButton />
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 bg-gray-50/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Analytics Platform v2.0
              </p>
            </div>
            <p className="text-[9px] text-gray-400 font-medium text-center uppercase tracking-tighter">
              © 2024 GB FOODS • DATA DRIVEN STRATEGY
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Top Bar (Mobile/Tablet and for search/actions) */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 z-20 shadow-sm sticky top-0">
            <div className="flex items-center gap-4 lg:hidden">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-brand-red">GB</span>
                <span className="text-xl font-black tracking-tighter text-gray-900">FOODS</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-red/5 rounded-xl flex items-center justify-center">
                  <Globe2 className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h2 className="text-lg font-[900] text-gray-900 tracking-tight leading-none uppercase">Africa Food Trade</h2>
                  <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest mt-1">Interactive Mapping System</p>
                </div>
              </div>
              
              <div className="h-10 w-[1px] bg-gray-100"></div>

              <button 
                onClick={toggleMap}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-bold text-sm
                  ${isMapCollapsed 
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                    : 'bg-brand-red/10 text-brand-red hover:bg-brand-red/20'}
                `}
                title={isMapCollapsed ? "Show Map" : "Hide Map"}
              >
                <Globe2 className={`w-4 h-4`} />
                <span>{isMapCollapsed ? 'Expand Map' : 'Compact View'}</span>
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="lg:hidden">
                <YearFilter
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  isMobile
                />
              </div>
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Live Analysis</span>
              </div>
            </div>
          </header>

          {/* Main Content Split View */}
          <div className="flex-1 flex flex-row overflow-hidden bg-[#f8f9fa] p-8 gap-8">
            {/* Map Section */}
            <div className={`
              ${isMapCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-[45%] opacity-100'} 
              h-full relative transition-all duration-500 ease-in-out
            `}>
              <div className="w-full h-full bg-white overflow-hidden relative border border-gray-100 shadow-2xl rounded-3xl">
                <AfricaMap
                  selectedYear={selectedYear}
                  selectedCountry={selectedCountry}
                  onCountryClick={handleCountryClick}
                />
              </div>
            </div>

            {/* Dashboard Section */}
            <div className={`
              ${isMapCollapsed ? 'w-full' : 'w-[55%]'} 
              h-full relative flex flex-col transition-all duration-500 ease-in-out bg-white border border-gray-100 shadow-2xl overflow-hidden rounded-3xl
            `}>
              {selectedCountry ? (
                <CountryDashboard
                  country={selectedCountry}
                  year={selectedYear}
                  onClose={handleCloseDashboard}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50/50">
                  <div className="text-center">
                    <div className="p-10 bg-gray-50/50 border border-gray-100 mb-8 inline-flex items-center justify-center rounded-3xl">
                      <BarChart3 className="w-24 h-24 text-brand-red/20" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                      Analytics Hub
                    </h3>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 max-w-[240px] mx-auto leading-relaxed">
                      Select a nation on the map to initialize deep-dive analysis
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Methodology Info */}
          <div className="absolute bottom-12 right-12 z-20 max-w-sm hidden xl:block">
             <Methodology isCompact />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
