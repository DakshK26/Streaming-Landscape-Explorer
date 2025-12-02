'use client';

import { useFilters } from '@/context/FilterContext';

export default function Header() {
    const { summary, resetFilters } = useFilters();

    return (
        <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e50914] to-[#b20710] flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[#e5e5e5]">
                                Streaming Landscape
                            </h1>
                            <p className="text-xs text-[#a3a3a3]">Explorer</p>
                        </div>
                    </div>

                    {/* Stats summary */}
                    {summary && (
                        <div className="hidden md:flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-xl font-bold text-[#e5e5e5]">
                                    {summary.totalTitles.toLocaleString()}
                                </div>
                                <div className="text-xs text-[#a3a3a3]">Total Titles</div>
                            </div>
                            <div className="h-8 w-px bg-[#2a2a2a]" />
                            <div className="text-center">
                                <div className="text-xl font-bold text-[#e50914]">
                                    {summary.totalMovies.toLocaleString()}
                                </div>
                                <div className="text-xs text-[#a3a3a3]">Movies</div>
                            </div>
                            <div className="h-8 w-px bg-[#2a2a2a]" />
                            <div className="text-center">
                                <div className="text-xl font-bold text-[#0ea5e9]">
                                    {summary.totalTVShows.toLocaleString()}
                                </div>
                                <div className="text-xs text-[#a3a3a3]">TV Shows</div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={resetFilters}
                            className="text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
