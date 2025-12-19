import { useState } from 'react';
import { MapPin, Globe2 } from 'lucide-react';
import { CountrySelector } from './components/CountrySelector';
import { YearFilter } from './components/YearFilter';
import { ImportExportPanel } from './components/ImportExportPanel';
import { TradeChart } from './components/TradeChart';
import { ProductChart } from './components/ProductChart';
import {
  getImportsForCountry,
  getExportsForCountry,
  getTotalImportValue,
  getTotalExportValue,
  AFRICAN_COUNTRIES,
  YEARS,
} from './utils/dataUtils';

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>(AFRICAN_COUNTRIES[0]);
  const [selectedYear, setSelectedYear] = useState<number>(YEARS[YEARS.length - 1]);

  const imports = getImportsForCountry(selectedCountry, selectedYear);
  const exports = getExportsForCountry(selectedCountry, selectedYear);
  const totalImports = getTotalImportValue(selectedCountry, selectedYear);
  const totalExports = getTotalExportValue(selectedCountry, selectedYear);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-red/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-brand-yellow/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="glass-strong rounded-3xl p-6 md:p-8 mb-8 border border-white/10 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-brand-red to-brand-orange rounded-2xl shadow-lg shadow-brand-red/30">
                <Globe2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                  Africa Food Import Map
                </h1>
                <p className="text-gray-400 text-xs md:text-sm lg:text-base">
                  Comprehensive trade data visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-lg">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold text-white">{selectedCountry}</span>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>
          <div>
            <YearFilter
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6">
          {/* Trade Overview Panel */}
          <ImportExportPanel
            imports={imports}
            exports={exports}
            totalImports={totalImports}
            totalExports={totalExports}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TradeChart imports={imports} exports={exports} />
            <ProductChart imports={imports} exports={exports} type="imports" />
          </div>

          {/* Export Products Chart */}
          <ProductChart imports={imports} exports={exports} type="exports" />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 GB Foods - Africa Food Import/Export Data Visualization</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
