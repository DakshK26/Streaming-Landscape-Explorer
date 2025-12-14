'use client';

import { useFilters } from '@/context/FilterContext';

export default function CountryModeToggle() {
    const { filters, updateFilter } = useFilters();

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#b8b8a8]">Country Mode</h3>
            <div className="flex rounded-xl overflow-hidden border border-[#2a2a2a]">
                <button
                    onClick={() => updateFilter('countryMode', 'all')}
                    className={`
            flex-1 py-2.5 px-3 text-sm font-medium
            transition-all duration-300
            ${filters.countryMode === 'all'
                            ? 'bg-gradient-to-r from-[#c9a227] to-[#e07b4c] text-[#0f0f0f] shadow-inner'
                            : 'bg-[#1a1a1a]/50 text-[#b8b8a8] hover:bg-[#252525]/70'
                        }
          `}
                >
                    All Countries
                </button>
                <button
                    onClick={() => updateFilter('countryMode', 'primary')}
                    className={`
            flex-1 py-2.5 px-3 text-sm font-medium
            transition-all duration-300
            ${filters.countryMode === 'primary'
                            ? 'bg-gradient-to-r from-[#c9a227] to-[#e07b4c] text-[#0f0f0f] shadow-inner'
                            : 'bg-[#1a1a1a]/50 text-[#b8b8a8] hover:bg-[#252525]/70'
                        }
          `}
                >
                    Primary Only
                </button>
            </div>
            <p className="text-xs text-[#8a8a7a]">
                {filters.countryMode === 'all'
                    ? 'Count all countries for co-productions'
                    : 'Only count the primary producing country'}
            </p>
        </div>
    );
}
