'use client';

import { useFetch } from '@/hooks/useFetch';
import { useFilters, FilterProvider } from '@/context/FilterContext';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import TimelineChart from '@/components/charts/TimelineChart';
import GenreBarChart from '@/components/charts/GenreBarChart';
import GenreScatterChart from '@/components/charts/GenreScatterChart';
import InsightCards from '@/components/insights/InsightCards';
import GenreFilter from '@/components/filters/GenreFilter';
import YearRangeSlider from '@/components/filters/YearRangeSlider';
import TypeFilter from '@/components/filters/TypeFilter';
import CountryModeToggle from '@/components/filters/CountryModeToggle';
import type { SummaryData, TimelineDataPoint, GenreStats, ScatterDataPoint, Insight } from '@/types';

function DashboardContent() {
  const { setSummary, summary, buildQueryString, filters, updateFilter } = useFilters();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
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

  // Fetch scatter data for View 2
  const { data: scatterData, loading: scatterLoading } = useFetch<ScatterDataPoint[]>(
    `/api/scatter${queryString ? `?${queryString}` : ''}`
  );

  // Fetch dynamic insights
  const { data: insightsData, loading: insightsLoading } = useFetch<Insight[]>(
    `/api/insights${queryString ? `?${queryString}` : ''}`
  );

  // Handle genre click from bar chart
  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

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

        {/* Dynamic Insights */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#e5e5e5] mb-2">
              Key Insights
            </h2>
            <p className="text-[#a3a3a3]">
              Dynamic insights based on your current filter selection.
            </p>
          </div>
          <InsightCards insights={insightsData || []} loading={insightsLoading} />
        </section>

        {/* View 2: Genre & Quality Explorer */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#e5e5e5] mb-2">
              Genre & Quality Explorer
            </h2>
            <p className="text-[#a3a3a3]">
              Explore the distribution of content across genres. Click on a genre bar to
              filter the scatter plot and see how titles vary by year and duration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Genre Bar Chart */}
            <div className="card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#e5e5e5]">
                  Genre Distribution
                </h3>
                <p className="text-sm text-[#a3a3a3]">
                  Click a bar to filter the scatter plot
                </p>
              </div>
              <GenreBarChart
                data={genreData || []}
                loading={genreLoading}
                selectedGenre={selectedGenre}
                onGenreClick={handleGenreClick}
              />
              {selectedGenre && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-[#a3a3a3]">Filtering by:</span>
                  <span className="px-3 py-1 bg-[#e50914] text-white text-sm rounded-full">
                    {selectedGenre}
                  </span>
                  <button
                    onClick={() => setSelectedGenre(null)}
                    className="text-sm text-[#a3a3a3] hover:text-[#e5e5e5]"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Genre Scatter Chart */}
            <div className="card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#e5e5e5]">
                  Year vs Duration
                </h3>
                <p className="text-sm text-[#a3a3a3]">
                  Each dot represents a title. Hover for details.
                </p>
              </div>
              <GenreScatterChart
                data={scatterData || []}
                loading={scatterLoading}
                selectedGenre={selectedGenre}
              />
            </div>
          </div>
        </section>

        {/* View 3 placeholder - will be added in next commit */}
        <section className="mb-12">
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
