'use client';

import { useFilters } from '@/context/FilterContext';

export default function Header() {
    const { summary, resetFilters, filters } = useFilters();

    const hasActiveFilters = filters.genres.length > 0 || filters.types.length > 0;

    return (
        <header className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Retro Style */}
                    <div className="flex items-center gap-3">
                        {/* Decorative icon */}
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a227] to-[#e07b4c] opacity-20 blur-sm absolute inset-0" />
                            <svg 
                                className="w-8 h-8 text-[#c9a227] relative z-10" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.5"
                            >
                                <path d="M7 4v16M17 4v16M3 8h4M3 12h18M3 16h4M17 8h4M17 16h4M7 8h10v8H7z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-xl tracking-tight">
                            <span className="font-[family-name:var(--font-playfair)] italic text-[#c9a227]">
                                Streaming
                            </span>
                            <span className="text-[#b8b8a8] font-light ml-1.5">Landscape</span>
                        </h1>
                    </div>

                    {/* Center navigation links - retro style */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#timeline" className="text-[#b8b8a8] hover:text-[#f5f5f0] text-sm tracking-wide transition-colors">
                            Timeline
                        </a>
                        <a href="#insights" className="text-[#b8b8a8] hover:text-[#f5f5f0] text-sm tracking-wide transition-colors">
                            Insights
                        </a>
                        <a href="#genres" className="text-[#b8b8a8] hover:text-[#f5f5f0] text-sm tracking-wide transition-colors">
                            Genres
                        </a>
                        <a href="#global" className="text-[#b8b8a8] hover:text-[#f5f5f0] text-sm tracking-wide transition-colors">
                            Global
                        </a>
                    </nav>

                    {/* Stats and Actions */}
                    <div className="flex items-center gap-4">
                        {/* Mini stats - hidden on mobile */}
                        {summary && (
                            <div className="hidden lg:flex items-center gap-3 mr-2">
                                <div className="text-right">
                                    <span className="text-lg font-semibold text-[#c9a227]">
                                        {summary.totalTitles.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-[#8a8a7a] ml-1.5">titles</span>
                                </div>
                            </div>
                        )}

                        {/* GitHub Source Button */}
                        <a
                            href="https://github.com/DakshK26/Streaming-Landscape-Explorer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#b8b8a8] hover:text-[#f5f5f0] bg-transparent border border-[#404040] hover:border-[#8a8a7a] rounded-lg transition-all duration-200"
                            aria-label="View source on GitHub"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span className="hidden sm:inline">Source</span>
                        </a>

                        {/* Reset button */}
                        <button
                            onClick={resetFilters}
                            className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
                                hasActiveFilters
                                    ? 'text-[#0f0f0f] bg-gradient-to-r from-[#c9a227] to-[#d4b13a] border-transparent shadow-lg shadow-[#c9a227]/20 hover:shadow-[#c9a227]/30'
                                    : 'text-[#b8b8a8] hover:text-[#f5f5f0] bg-transparent border-[#404040] hover:border-[#8a8a7a]'
                            }`}
                        >
                            {hasActiveFilters ? 'Clear Filters' : 'Reset Filters'}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
