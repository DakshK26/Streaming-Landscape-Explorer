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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Hero Section - Retro Elegant Style */}
                <section className="mb-20 text-center">
                    {/* Decorative top element */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                        <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                    </div>

                    {/* Main headline with script font */}
                    <h1 className="font-[family-name:var(--font-playfair)] italic text-5xl md:text-6xl lg:text-7xl font-medium mb-6 tracking-tight text-[#f5f5f0] leading-tight">
                        Discover the World of
                        <br />
                        <span className="text-[#c9a227]">Streaming Content</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-[#b8b8a8] max-w-2xl mx-auto leading-relaxed mb-4 font-light">
                        Interactive Data Visualization Experience
                    </p>
                    
                    <p className="text-sm text-[#8a8a7a] max-w-xl mx-auto leading-relaxed mb-12">
                        Explore the evolution of streaming content across time, genres, and regions.
                        Uncover patterns and insights from the entertainment landscape.
                    </p>

                    {/* CTA Buttons - Muse Sketch Studio style */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <a 
                            href="#timeline"
                            className="btn-primary"
                        >
                            <span>Start Exploring</span>
                        </a>
                        <a 
                            href="#global"
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            <span>View Global Map</span>
                        </a>
                    </div>

                    {/* Animated Insights Ticker */}
                    <AnimatedInsightsTicker
                        summary={summaryData}
                        timeline={timelineData || []}
                        genres={genreData || []}
                        countries={countryData || []}
                    />

                    {/* Movie Search */}
                    <MovieSearch />

                    {/* Quick Stats - Retro cards */}
                    {summaryData && (
                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            <div className="group relative bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-xl p-5 hover:border-[#404040] transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#c9a227]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="text-3xl font-semibold text-[#f5f5f0] relative z-10">{summaryData.totalTitles.toLocaleString()}</p>
                                <p className="text-sm text-[#8a8a7a] mt-1 relative z-10">Total Titles</p>
                            </div>
                            <div className="group relative bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-xl p-5 hover:border-[#c9a227]/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#c9a227]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="text-3xl font-semibold text-[#c9a227] relative z-10">{summaryData.totalMovies.toLocaleString()}</p>
                                <p className="text-sm text-[#8a8a7a] mt-1 relative z-10">Movies</p>
                            </div>
                            <div className="group relative bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-xl p-5 hover:border-[#e07b4c]/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#e07b4c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="text-3xl font-semibold text-[#e07b4c] relative z-10">{summaryData.totalTVShows.toLocaleString()}</p>
                                <p className="text-sm text-[#8a8a7a] mt-1 relative z-10">TV Shows</p>
                            </div>
                            <div className="group relative bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-xl p-5 hover:border-[#7db88f]/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#7db88f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="text-3xl font-semibold text-[#7db88f] relative z-10">{summaryData.totalCountries}</p>
                                <p className="text-sm text-[#8a8a7a] mt-1 relative z-10">Countries</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Filters Section */}
                <section className="mb-14 card" id="filters">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-[family-name:var(--font-playfair)] italic text-[#f5f5f0]">Refine Your Search</h2>
                        {(filters.genres.length > 0 || filters.types.length > 0) && (
                            <span className="retro-badge">
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
                <section className="mb-14" id="timeline">
                    <div className="card">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-[family-name:var(--font-playfair)] italic text-[#f5f5f0] mb-1">
                                    Content Timeline
                                </h2>
                                <p className="text-sm text-[#8a8a7a]">
                                    Track catalog growth over time
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#c9a227]" />
                                    <span className="text-[#b8b8a8]">Movies</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#e07b4c]" />
                                    <span className="text-[#b8b8a8]">TV Shows</span>
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
                <section className="mb-14" id="insights">
                    <div className="mb-6">
                        <h2 className="text-xl font-[family-name:var(--font-playfair)] italic text-[#f5f5f0] mb-1">Key Insights</h2>
                        <p className="text-sm text-[#8a8a7a]">
                            Dynamic analysis based on current filters
                        </p>
                    </div>
                    <InsightCards insights={insightsData || []} loading={insightsLoading} />
                </section>

                {/* View 2: Genre & Quality Explorer */}
                <section className="mb-14" id="genres">
                    <div className="mb-6">
                        <h2 className="text-xl font-[family-name:var(--font-playfair)] italic text-[#f5f5f0] mb-1">
                            Genre Explorer
                        </h2>
                        <p className="text-sm text-[#8a8a7a]">
                            Click a genre bar to filter the trend chart
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Genre Bar Chart */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-[#f5f5f0]">Genre Distribution</h3>
                                {selectedGenre && (
                                    <button
                                        onClick={() => setSelectedGenre(null)}
                                        className="text-xs text-[#c9a227] hover:text-[#d4b13a] flex items-center gap-1"
                                    >
                                        <span className="bg-[#c9a227]/20 px-2 py-0.5 rounded">
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
                                <h3 className="font-medium text-[#f5f5f0]">Genre Trends Over Time</h3>
                                <p className="text-xs text-[#8a8a7a] mt-1">
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
                <section className="mb-14" id="global">
                    <div className="card">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-[family-name:var(--font-playfair)] italic text-[#f5f5f0] mb-1">
                                    Global Distribution
                                </h2>
                                <p className="text-sm text-[#8a8a7a]">
                                    Content production by country
                                </p>
                            </div>
                            {selectedCountry && (
                                <button
                                    onClick={() => setSelectedCountry(null)}
                                    className="text-xs text-[#c9a227] hover:text-[#d4b13a] flex items-center gap-1"
                                >
                                    <span className="bg-[#c9a227]/20 px-2 py-0.5 rounded">
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
                                <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-center gap-6 text-sm">
                                    <span className="text-[#b8b8a8]">
                                        <span className="text-[#f5f5f0] font-medium">{country.count.toLocaleString()}</span> titles
                                    </span>
                                    <span className="text-[#8a8a7a]">
                                        {country.movieCount} movies · {country.tvShowCount} TV shows
                                    </span>
                                </div>
                            );
                        })()}
                    </div>
                </section>
            </main>

            {/* Footer - Retro style */}
            <footer className="border-t border-[#2a2a2a] py-10 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4">
                        {/* Decorative element */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#2a2a2a]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#2a2a2a]" />
                        </div>
                        
                        <p className="text-center text-[#8a8a7a] text-sm">
                            Made by <span className="text-[#b8b8a8]">Daksh Khanna</span>
                        </p>
                        
                        <p className="text-center text-[#5a5a4a] text-xs">
                            © 2025 Streaming Landscape Explorer
                        </p>
                    </div>
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
