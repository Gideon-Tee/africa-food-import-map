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
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col hidden lg:flex shadow-sm">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-red shadow-lg shadow-brand-red/20">
                <Globe2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter leading-none text-gray-900">
                  GBFOODS
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-orange font-bold">
                  Africa Insights
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-gray-400 px-2 mb-2">TIME PERIOD</h2>
              <YearFilter
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3 text-brand-red">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="font-bold">Dashboard Tip</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Hover over a country to see quick stats, or click for a deep-dive analysis of food trade flows.
                </p>
              </div>
              
              <div className="p-4">
                <DownloadButton />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium text-center">
              © 2024 GB FOODS ANALYTICS HUB
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Top Bar (Mobile/Tablet and for search/actions) */}
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20 shadow-sm">
            <div className="flex items-center gap-4 lg:hidden">
              <div className="p-2 bg-brand-red">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight text-gray-900">GBFOODS</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <button 
                onClick={toggleMap}
                className="p-2 hover:bg-gray-100 transition-colors text-gray-500"
                title={isMapCollapsed ? "Show Map" : "Hide Map"}
              >
                <Globe2 className={`w-6 h-6 ${!isMapCollapsed ? 'text-brand-red' : ''}`} />
              </button>
              <h2 className="text-lg font-bold text-gray-900">Africa Food Import/Export Map</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <YearFilter
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  isMobile
                />
              </div>
            </div>
          </header>

          {/* Main Content Split View */}
          <div className="flex-1 flex flex-row overflow-hidden bg-[#f8f9fa] p-6 gap-6">
            {/* Map Section */}
            <div className={`
              ${isMapCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-[40%] opacity-100'} 
              h-full relative transition-all duration-500 ease-in-out
            `}>
              <div className="w-full h-full bg-white overflow-hidden relative border border-gray-200 shadow-xl">
                <AfricaMap
                  selectedYear={selectedYear}
                  selectedCountry={selectedCountry}
                  onCountryClick={handleCountryClick}
                />
              </div>
            </div>

            {/* Dashboard Section */}
            <div className={`
              ${isMapCollapsed ? 'w-full' : 'w-[60%]'} 
              h-full relative flex flex-col transition-all duration-500 ease-in-out bg-white border border-gray-200 shadow-xl overflow-hidden
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
                    <div className="p-8 bg-white border border-gray-200 mb-6 inline-block shadow-sm">
                      <BarChart3 className="w-20 h-20 text-brand-red/10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter">
                      Analytics Dashboard
                    </h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                      Select a country on the map to begin
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Methodology Info */}
          <div className="absolute bottom-12 right-12 z-20 max-w-md hidden xl:block">
             <Methodology isCompact />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
