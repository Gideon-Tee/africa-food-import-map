import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { AFRICAN_COUNTRIES } from '../../../utils/dataUtils';

interface CountrySearchProps {
    onSelect: (country: string) => void;
    selectedCountry: string | null;
}

export function CountrySearch({ onSelect, selectedCountry }: CountrySearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = AFRICAN_COUNTRIES.filter(country =>
        country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (country: string) => {
        onSelect(country);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-full max-w-md" ref={wrapperRef}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (searchTerm || filteredCountries.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50 animate-fade-in custom-scrollbar">
                    {filteredCountries.length > 0 ? (
                        <div className="p-2">
                            <div className="px-3 py-2 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                Available Markets
                            </div>
                            {filteredCountries.map((country) => (
                                <button
                                    key={country}
                                    onClick={() => handleSelect(country)}
                                    className={`
                    w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors group
                    ${selectedCountry === country ? 'bg-brand-red/5 text-brand-red font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}
                  `}
                                >
                                    <span>{country}</span>
                                    {selectedCountry === country && <ChevronRight className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-sm font-bold text-gray-900">No markets found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
