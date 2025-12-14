'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Title } from '@/types';

interface SearchResult {
    results: Title[];
}

export default function MovieSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Title[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle escape key to close modal
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setSelectedTitle(null);
                setIsOpen(false);
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Search function with debounce
    const searchTitles = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
            const data: SearchResult = await res.json();
            setResults(data.results || []);
            setIsOpen(true);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            searchTitles(query);
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, searchTitles]);

    const handleSelectTitle = (title: Title) => {
        setSelectedTitle(title);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            {/* Search Bar - Retro Style */}
            <div ref={searchRef} className="relative w-full max-w-xl mx-auto mb-10">
                <div className="relative">
                    {/* Search Icon */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a7a]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Input - Retro Style */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => results.length > 0 && setIsOpen(true)}
                        placeholder="Search for a movie or TV show..."
                        className="w-full bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#2a2a2a] rounded-xl py-4 pl-12 pr-12 text-[#f5f5f0] placeholder-[#5a5a4a] focus:outline-none focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/20 transition-all duration-300"
                    />

                    {/* Loading Spinner or Clear Button */}
                    {isLoading ? (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-[#c9a227]/30 border-t-[#c9a227] rounded-full animate-spin" />
                        </div>
                    ) : query && (
                        <button
                            onClick={() => {
                                setQuery('');
                                setResults([]);
                                setIsOpen(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a5a4a] hover:text-[#f5f5f0] transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown Results - Retro Style */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                        {results.length === 0 ? (
                            <div className="p-6 text-center text-[#8a8a7a]">
                                No results found for &ldquo;{query}&rdquo;
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {results.map((title) => (
                                    <button
                                        key={title.id}
                                        onClick={() => handleSelectTitle(title)}
                                        className="w-full px-4 py-3 flex items-center gap-4 hover:bg-[#252525] transition-colors text-left border-b border-[#252525] last:border-0"
                                    >
                                        {/* Type Badge */}
                                        <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${title.type === 'Movie'
                                                ? 'bg-[#c9a227]/20 text-[#c9a227]'
                                                : 'bg-[#e07b4c]/20 text-[#e07b4c]'
                                            }`}>
                                            {title.type === 'Movie' ? '🎬' : '📺'}
                                        </div>

                                        {/* Title Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#f5f5f0] font-medium truncate">{title.title}</p>
                                            <p className="text-xs text-[#8a8a7a] truncate">
                                                {title.releaseYear} • {title.genres.slice(0, 2).join(', ')}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex-shrink-0 text-[#5a5a4a]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Details Modal - Retro Style */}
            {selectedTitle && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedTitle(null)}
                >
                    <div
                        className="relative w-full max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with gradient - retro colors */}
                        <div className={`relative h-32 ${selectedTitle.type === 'Movie'
                                ? 'bg-gradient-to-br from-[#c9a227] via-[#b8922a] to-[#a8821a]'
                                : 'bg-gradient-to-br from-[#e07b4c] via-[#d06a3c] to-[#c05a2c]'
                            }`}>
                            {/* Decorative pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.3),transparent_50%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.2),transparent_40%)]" />
                            </div>

                            {/* Type badge */}
                            <div className="absolute top-4 left-6 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                {selectedTitle.type === 'Movie' ? '🎬 Movie' : '📺 TV Show'}
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => setSelectedTitle(null)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full text-white/80 hover:text-white transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            {/* Year badge */}
                            <div className="absolute bottom-4 right-6 text-4xl font-bold text-black/20">
                                {selectedTitle.releaseYear}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Title */}
                            <h2 className="text-2xl font-[family-name:var(--font-playfair)] italic text-[#f5f5f0] mb-4">{selectedTitle.title}</h2>

                            {/* Meta info row */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {selectedTitle.rating && (
                                    <span className="px-3 py-1 bg-[#252525] border border-[#333333] rounded-full text-sm text-[#b8b8a8]">
                                        {selectedTitle.rating}
                                    </span>
                                )}
                                {selectedTitle.duration && (
                                    <span className="px-3 py-1 bg-[#252525] border border-[#333333] rounded-full text-sm text-[#b8b8a8]">
                                        ⏱ {selectedTitle.duration}
                                    </span>
                                )}
                                {selectedTitle.countries.length > 0 && (
                                    <span className="px-3 py-1 bg-[#252525] border border-[#333333] rounded-full text-sm text-[#b8b8a8]">
                                        📍 {selectedTitle.countries[0]}
                                    </span>
                                )}
                            </div>

                            {/* Genres */}
                            {selectedTitle.genres.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-medium text-[#8a8a7a] uppercase tracking-wider mb-2">Genres</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTitle.genres.map((genre) => (
                                            <span
                                                key={genre}
                                                className={`px-3 py-1 rounded-full text-sm ${selectedTitle.type === 'Movie'
                                                        ? 'bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/30'
                                                        : 'bg-[#e07b4c]/15 text-[#e07b4c] border border-[#e07b4c]/30'
                                                    }`}
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {selectedTitle.description && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-medium text-[#8a8a7a] uppercase tracking-wider mb-2">Description</h3>
                                    <p className="text-[#b8b8a8] leading-relaxed">{selectedTitle.description}</p>
                                </div>
                            )}

                            {/* Director */}
                            {selectedTitle.director && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-medium text-[#8a8a7a] uppercase tracking-wider mb-1">Director</h3>
                                    <p className="text-[#f5f5f0]">{selectedTitle.director}</p>
                                </div>
                            )}

                            {/* Cast */}
                            {selectedTitle.cast && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-medium text-[#8a8a7a] uppercase tracking-wider mb-1">Cast</h3>
                                    <p className="text-[#b8b8a8] text-sm">{selectedTitle.cast}</p>
                                </div>
                            )}

                            {/* Date Added */}
                            {selectedTitle.dateAdded && (
                                <div className="pt-4 border-t border-[#2a2a2a] mt-6">
                                    <p className="text-xs text-[#8a8a7a]">
                                        Added to Netflix: {new Date(selectedTitle.dateAdded).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
