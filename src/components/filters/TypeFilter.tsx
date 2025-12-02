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
      <h3 className="text-sm font-medium text-[#a3a3a3]">Content Type</h3>
      <div className="flex gap-2">
        <button
          onClick={() => toggleType('Movie')}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-medium
            transition-all duration-200
            ${
              filters.types.includes('Movie')
                ? 'bg-[#e50914] text-white'
                : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#2a2a2a]'
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
            flex-1 py-2 px-4 rounded-lg text-sm font-medium
            transition-all duration-200
            ${
              filters.types.includes('TV Show')
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#2a2a2a]'
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
