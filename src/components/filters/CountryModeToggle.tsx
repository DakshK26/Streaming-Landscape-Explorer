'use client';

import { useFilters } from '@/context/FilterContext';

export default function CountryModeToggle() {
  const { filters, updateFilter } = useFilters();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[#a3a3a3]">Country Mode</h3>
      <div className="flex rounded-lg overflow-hidden border border-[#2a2a2a]">
        <button
          onClick={() => updateFilter('countryMode', 'all')}
          className={`
            flex-1 py-2 px-3 text-sm font-medium
            transition-all duration-200
            ${
              filters.countryMode === 'all'
                ? 'bg-[#e50914] text-white'
                : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#2a2a2a]'
            }
          `}
        >
          All Countries
        </button>
        <button
          onClick={() => updateFilter('countryMode', 'primary')}
          className={`
            flex-1 py-2 px-3 text-sm font-medium
            transition-all duration-200
            ${
              filters.countryMode === 'primary'
                ? 'bg-[#e50914] text-white'
                : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#2a2a2a]'
            }
          `}
        >
          Primary Only
        </button>
      </div>
      <p className="text-xs text-[#666]">
        {filters.countryMode === 'all'
          ? 'Count all countries for co-productions'
          : 'Only count the primary producing country'}
      </p>
    </div>
  );
}
