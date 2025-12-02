'use client';

import { useFilters } from '@/context/FilterContext';

export default function TypeFilter() {
    const { filters, updateFilter } = useFilters();

    const toggleType = (type: 'Movie' | 'TV Show') => {
        const current = filters.types;
        if (current.includes(type)) {
            updateFilter('types', current.filter((t) => t !== type));
        } else {
            updateFilter('types', [...current, type]);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-400">Content Type</h3>
            <div className="flex gap-2">
                <button
                    onClick={() => toggleType('Movie')}
                    className={`
            flex-1 py-2.5 px-4 rounded-xl text-sm font-medium
            transition-all duration-300 border
            ${filters.types.includes('Movie')
                            ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white border-violet-500/50 shadow-lg shadow-violet-500/25'
                            : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/70 border-zinc-700/50 hover:border-zinc-600/50'
                        }
          `}
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h-2v-2h2zm-2-2h2V9h-2v2zm-4 4v-2H9v2h2zm0-4H9V9h2v2zm-4 4v-2H5v2h2zm0-4H5V9h2v2z" />
                        </svg>
                        Movies
                    </span>
                </button>
                <button
                    onClick={() => toggleType('TV Show')}
                    className={`
            flex-1 py-2.5 px-4 rounded-xl text-sm font-medium
            transition-all duration-300 border
            ${filters.types.includes('TV Show')
                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-cyan-500/50 shadow-lg shadow-cyan-500/25'
                            : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/70 border-zinc-700/50 hover:border-zinc-600/50'
                        }
          `}
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v6h8V6z" clipRule="evenodd" />
                            <path d="M2 15h16v2H2v-2z" />
                        </svg>
                        TV Shows
                    </span>
                </button>
            </div>
        </div>
    );
}
