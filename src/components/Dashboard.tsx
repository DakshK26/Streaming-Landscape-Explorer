'use client';

import { useFetch } from '@/hooks/useFetch';
import { useFilters, FilterProvider } from '@/context/FilterContext';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import TimelineChart from '@/components/charts/TimelineChart';
import GenreFilter from '@/components/filters/GenreFilter';
import YearRangeSlider from '@/components/filters/YearRangeSlider';
import TypeFilter from '@/components/filters/TypeFilter';
import CountryModeToggle from '@/components/filters/CountryModeToggle';
import type { SummaryData, TimelineDataPoint, GenreStats } from '@/types';

function DashboardContent() {
  const { setSummary, summary, buildQueryString, filters } = useFilters();
  
  // Fetch summary data
  const { data: summaryData, loading: summaryLoading } = useFetch<SummaryData>('/api/summary');
  
  // Fetch timeline data with filters
  const queryString = buildQueryString();
  const { data: timelineData, loading: timelineLoading } = useFetch<TimelineDataPoint[]>(
    `/api/timeline${queryString ? `?${queryString}` : ''}`
  );
  
  // Fetch genres for filter
  const { data: genreData, loading: genreLoading } = useFetch<GenreStats[]>(
    `/api/genres${queryString ? `?${queryString}` : ''}`
  );

  // Update summary in context when loaded
  useEffect(() => {
    if (summaryData) {
      setSummary(summaryData);
    }
  }, [summaryData, setSummary]);

  // Update year range when summary loads
  useEffect(() => {
    if (summaryData && filters.yearRange[0] === 1900) {
      // Set initial year range from data
    }
  }, [summaryData, filters.yearRange]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Explore the Streaming Landscape</span>
          </h1>
          <p className="text-lg text-[#a3a3a3] max-w-3xl">
            This dashboard explores the streaming catalog across time, genres, and regions.
            Use the filters and charts to discover content trends and uncover insights
            about how entertainment has evolved.
          </p>
        </section>

        {/* Filters Section */}
        <section className="mb-8 card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <GenreFilter genres={genreData || []} loading={genreLoading} maxVisible={10} />
            </div>
            <div>
              <TypeFilter />
            </div>
            <div>
              {summaryData && (
                <YearRangeSlider
                  minYear={summaryData.yearRange[0]}
                  maxYear={summaryData.yearRange[1]}
                />
              )}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
            <CountryModeToggle />
          </div>
        </section>

        {/* View 1: Global Content Timeline */}
        <section className="mb-12">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#e5e5e5] mb-2">
                Global Content Timeline
              </h2>
              <p className="text-[#a3a3a3]">
                Track how the catalog has evolved over time. See the growth of movies and
                TV shows by year.
              </p>
            </div>
            <TimelineChart
              data={timelineData || []}
              loading={timelineLoading || summaryLoading}
            />
          </div>
        </section>

        {/* More views will be added in subsequent commits */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card h-64 flex items-center justify-center">
            <p className="text-[#a3a3a3]">Genre & Quality Explorer coming soon...</p>
          </div>
          <div className="card h-64 flex items-center justify-center">
            <p className="text-[#a3a3a3]">Country Choropleth Map coming soon...</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[#666] text-sm">
            Data sourced from Netflix titles dataset. Built with Next.js, Nivo, and
            Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Dashboard() {
  return (
    <FilterProvider>
      <DashboardContent />
    </FilterProvider>
  );
}
