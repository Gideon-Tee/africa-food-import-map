import { AFRICAN_COUNTRIES } from '../utils/dataUtils';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Select Country</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-2">
        {AFRICAN_COUNTRIES.map((country) => (
          <button
            key={country}
            onClick={() => onCountryChange(country)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                selectedCountry === country
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            {country}
          </button>
        ))}
      </div>
    </div>
  );
}

