'use client';

import { useFilters } from '@/context/FilterContext';

export default function Header() {
    const { summary, resetFilters } = useFilters();

    return (
        <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
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
                            <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                Streaming Landscape
                            </h1>
                            <p className="text-xs text-zinc-500">Explorer</p>
                        </div>
                    </div>

                    {/* Stats summary */}
                    {summary && (
                        <div className="hidden md:flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-xl font-bold text-zinc-100">
                                    {summary.totalTitles.toLocaleString()}
                                </div>
                                <div className="text-xs text-zinc-500">Total Titles</div>
                            </div>
                            <div className="h-8 w-px bg-zinc-800" />
                            <div className="text-center">
                                <div className="text-xl font-bold text-violet-400">
                                    {summary.totalMovies.toLocaleString()}
                                </div>
                                <div className="text-xs text-zinc-500">Movies</div>
                            </div>
                            <div className="h-8 w-px bg-zinc-800" />
                            <div className="text-center">
                                <div className="text-xl font-bold text-cyan-400">
                                    {summary.totalTVShows.toLocaleString()}
                                </div>
                                <div className="text-xs text-zinc-500">TV Shows</div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg border border-zinc-700/50 transition-all duration-200"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
