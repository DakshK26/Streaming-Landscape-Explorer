'use client';

import { useFetch } from '@/hooks/useFetch';
import { useFilters, FilterProvider } from '@/context/FilterContext';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import AnimatedInsightsTicker from '@/components/AnimatedInsightsTicker';
import MovieSearch from '@/components/MovieSearch';
import TimelineChart from '@/components/charts/TimelineChart';
import GenreBarChart from '@/components/charts/GenreBarChart';
import GenreTrendChart from '@/components/charts/GenreTrendChart';
import ChoroplethMap from '@/components/charts/ChoroplethMap';
import InsightCards from '@/components/insights/InsightCards';
import GenreFilter from '@/components/filters/GenreFilter';
import YearRangeSlider from '@/components/filters/YearRangeSlider';
import TypeFilter from '@/components/filters/TypeFilter';
import CountryModeToggle from '@/components/filters/CountryModeToggle';
import type { SummaryData, TimelineDataPoint, GenreStats, ScatterDataPoint, Insight, CountryData } from '@/types';

function DashboardContent() {
    const { setSummary, buildQueryString, filters } = useFilters();
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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

    // Fetch countries for View 3
    const { data: countryData, loading: countryLoading } = useFetch<CountryData[]>(
        `/api/countries${queryString ? `?${queryString}` : ''}`
    );

    // Handle genre click from bar chart
    const handleGenreClick = (genre: string) => {
        setSelectedGenre(selectedGenre === genre ? null : genre);
    };

    // Handle country click from choropleth map
    const handleCountryClick = (country: CountryData | null) => {
        setSelectedCountry(country?.country || null);
    };

    // Update summary in context when loaded
    useEffect(() => {
        if (summaryData) {
            setSummary(summaryData);
        }
    }, [summaryData, setSummary]);

    return (
        <div className="min-h-screen relative">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Hero Section */}
                <section className="mb-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            Streaming Landscape
                        </span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Explore the evolution of streaming content across time, genres, and regions.
                        Discover trends and insights in the world of entertainment.
                    </p>

                    {/* Animated Insights Ticker */}
                    <AnimatedInsightsTicker
                        summary={summaryData}
                        timeline={timelineData || []}
                        genres={genreData || []}
                        countries={countryData || []}
                    />

                    {/* Movie Search */}
                    <MovieSearch />

                    {/* Quick Stats */}
                    {summaryData && (
                        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            <div className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-all duration-300">
                                <p className="text-3xl font-bold text-white">{summaryData.totalTitles.toLocaleString()}</p>
                                <p className="text-sm text-zinc-500 mt-1">Total Titles</p>
                            </div>
                            <div className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300">
                                <p className="text-3xl font-bold text-violet-400">{summaryData.totalMovies.toLocaleString()}</p>
                                <p className="text-sm text-zinc-500 mt-1">Movies</p>
                            </div>
                            <div className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300">
                                <p className="text-3xl font-bold text-cyan-400">{summaryData.totalTVShows.toLocaleString()}</p>
                                <p className="text-sm text-zinc-500 mt-1">TV Shows</p>
                            </div>
                            <div className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300">
                                <p className="text-3xl font-bold text-emerald-400">{summaryData.totalCountries}</p>
                                <p className="text-sm text-zinc-500 mt-1">Countries</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Filters Section */}
                <section className="mb-12 card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Filters</h2>
                        {(filters.genres.length > 0 || filters.types.length > 0) && (
                            <span className="text-xs text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-1 rounded-full">
                                Active filters
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <GenreFilter genres={genreData || []} loading={genreLoading} maxVisible={8} />
                        </div>
                        <div className="space-y-8">
                            <TypeFilter />
                            {summaryData && (
                                <YearRangeSlider
                                    minYear={summaryData.yearRange[0]}
                                    maxYear={summaryData.yearRange[1]}
                                />
                            )}
                            <CountryModeToggle />
                        </div>
                    </div>
                </section>

                {/* View 1: Global Content Timeline */}
                <section className="mb-12">
                    <div className="card">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-1">
                                    Content Timeline
                                </h2>
                                <p className="text-sm text-[#71717a]">
                                    Track catalog growth over time
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                                    <span className="text-[#a1a1aa]">Movies</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                                    <span className="text-[#a1a1aa]">TV Shows</span>
                                </span>
                            </div>
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
                        <h2 className="text-xl font-semibold text-white mb-1">Key Insights</h2>
                        <p className="text-sm text-[#71717a]">
                            Dynamic analysis based on current filters
                        </p>
                    </div>
                    <InsightCards insights={insightsData || []} loading={insightsLoading} />
                </section>

                {/* View 2: Genre & Quality Explorer */}
                <section className="mb-12">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-1">
                            Genre Explorer
                        </h2>
                        <p className="text-sm text-[#71717a]">
                            Click a genre bar to filter the scatter plot
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Genre Bar Chart */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-white">Genre Distribution</h3>
                                {selectedGenre && (
                                    <button
                                        onClick={() => setSelectedGenre(null)}
                                        className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] flex items-center gap-1"
                                    >
                                        <span className="bg-[#8b5cf6]/20 px-2 py-0.5 rounded">
                                            {selectedGenre}
                                        </span>
                                        <span>×</span>
                                    </button>
                                )}
                            </div>
                            <GenreBarChart
                                data={genreData || []}
                                loading={genreLoading}
                                selectedGenre={selectedGenre}
                                onGenreClick={handleGenreClick}
                            />
                        </div>

                        {/* Genre Trend Chart */}
                        <div className="card">
                            <div className="mb-4">
                                <h3 className="font-medium text-white">Genre Trends Over Time</h3>
                                <p className="text-xs text-[#71717a] mt-1">
                                    How genres have grown since 2000
                                </p>
                            </div>
                            <GenreTrendChart
                                data={scatterData || []}
                                loading={scatterLoading}
                                selectedGenre={selectedGenre}
                            />
                        </div>
                    </div>
                </section>

                {/* View 3: Country Choropleth Map */}
                <section className="mb-12">
                    <div className="card">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-1">
                                    Global Distribution
                                </h2>
                                <p className="text-sm text-[#71717a]">
                                    Content production by country
                                </p>
                            </div>
                            {selectedCountry && (
                                <button
                                    onClick={() => setSelectedCountry(null)}
                                    className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] flex items-center gap-1"
                                >
                                    <span className="bg-[#8b5cf6]/20 px-2 py-0.5 rounded">
                                        {selectedCountry}
                                    </span>
                                    <span>×</span>
                                </button>
                            )}
                        </div>
                        <ChoroplethMap
                            data={countryData || []}
                            loading={countryLoading}
                            selectedCountry={selectedCountry}
                            onCountryClick={handleCountryClick}
                        />
                        {selectedCountry && (() => {
                            const country = countryData?.find(c => c.country === selectedCountry);
                            if (!country) return null;
                            return (
                                <div className="mt-4 pt-4 border-t border-[#27272a] flex items-center gap-6 text-sm">
                                    <span className="text-[#a1a1aa]">
                                        <span className="text-white font-medium">{country.count.toLocaleString()}</span> titles
                                    </span>
                                    <span className="text-[#71717a]">
                                        {country.movieCount} movies · {country.tvShowCount} TV shows
                                    </span>
                                </div>
                            );
                        })()}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#27272a] py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-[#52525b] text-sm">
                        Data from Netflix titles dataset · Built with Next.js, Nivo & Tailwind
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
