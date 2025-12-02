'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { FilterState, SummaryData } from '@/types';

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  summary: SummaryData | null;
  setSummary: React.Dispatch<React.SetStateAction<SummaryData | null>>;
  buildQueryString: () => string;
}

const defaultFilters: FilterState = {
  genres: [],
  countries: [],
  types: [],
  yearRange: [1900, new Date().getFullYear()],
  countryMode: 'all',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      yearRange: summary?.yearRange || defaultFilters.yearRange,
    });
  }, [summary]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.genres.length > 0) {
      params.set('genres', filters.genres.join(','));
    }
    if (filters.countries.length > 0) {
      params.set('countries', filters.countries.join(','));
    }
    if (filters.types.length > 0) {
      params.set('types', filters.types.join(','));
    }
    if (filters.yearRange[0] !== (summary?.yearRange[0] || 1900)) {
      params.set('yearMin', filters.yearRange[0].toString());
    }
    if (filters.yearRange[1] !== (summary?.yearRange[1] || new Date().getFullYear())) {
      params.set('yearMax', filters.yearRange[1].toString());
    }
    if (filters.countryMode !== 'all') {
      params.set('countryMode', filters.countryMode);
    }
    
    return params.toString();
  }, [filters, summary]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        summary,
        setSummary,
        buildQueryString,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
