'use client';

import { useFilters } from '@/context/FilterContext';

export default function CountryModeToggle() {
    const { filters, updateFilter } = useFilters();

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-400">Country Mode</h3>
            <div className="flex rounded-xl overflow-hidden border border-zinc-700/50">
                <button
                    onClick={() => updateFilter('countryMode', 'all')}
                    className={`
            flex-1 py-2.5 px-3 text-sm font-medium
            transition-all duration-300
            ${filters.countryMode === 'all'
                            ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-inner'
                            : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/70'
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
                            ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-inner'
                            : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/70'
                        }
          `}
                >
                    Primary Only
                </button>
            </div>
            <p className="text-xs text-zinc-500">
                {filters.countryMode === 'all'
                    ? 'Count all countries for co-productions'
                    : 'Only count the primary producing country'}
            </p>
        </div>
    );
}
