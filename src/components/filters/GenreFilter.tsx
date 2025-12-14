'use client';

import { useState, useMemo } from 'react';
import { useFilters } from '@/context/FilterContext';
import FilterChip from './FilterChip';
import type { GenreStats } from '@/types';

interface GenreFilterProps {
    genres: GenreStats[];
    loading?: boolean;
    maxVisible?: number;
}

// Retro color palette for consolidated genres
const genreColors: Record<string, string> = {
    'Drama': '#c9a227',
    'Comedy': '#7db88f',
    'International': '#5ba3c0',
    'Action & Adventure': '#e07b4c',
    'Documentary': '#9b8ec4',
    'Kids & Family': '#8fb8a8',
    'Horror': '#d4786c',
    'Romance': '#c4a484',
    'Thriller': '#d4b13a',
    'Sci-Fi & Fantasy': '#5ba3c0',
    'Music & Musicals': '#9b8ec4',
    'Anime': '#e07b4c',
    'Classic & Cult': '#c9a227',
    'Stand-Up & Talk': '#7db88f',
    'LGBTQ': '#9b8ec4',
    'Sports': '#7db88f',
    'Independent': '#5ba3c0',
    'Crime': '#d4786c',
    'Reality': '#e07b4c',
    'Teen': '#9b8ec4',
    'Faith & Spirituality': '#c9a227',
};

export default function GenreFilter({ genres, loading, maxVisible = 8 }: GenreFilterProps) {
    const { filters, updateFilter } = useFilters();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleGenre = (genreName: string) => {
        const current = filters.genres;
        if (current.includes(genreName)) {
            updateFilter('genres', current.filter((g) => g !== genreName));
        } else {
            updateFilter('genres', [...current, genreName]);
        }
    };

    const filteredGenres = useMemo(() => {
        if (!searchQuery) return genres;
        return genres.filter(g =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [genres, searchQuery]);

    if (loading) {
        return (
            <div className="space-y-3">
                <div className="h-5 w-24 skeleton" />
                <div className="flex flex-wrap gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-9 w-28 skeleton rounded-full" />
                    ))}
                </div>
            </div>
        );
    }

    const visibleGenres = genres.slice(0, maxVisible);
    const remainingCount = genres.length - maxVisible;

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#b8b8a8]">Filter by Genre</h3>
                    {filters.genres.length > 0 && (
                        <button
                            onClick={() => updateFilter('genres', [])}
                            className="text-xs text-[#c9a227] hover:text-[#d4b13a] font-medium"
                        >
                            Clear ({filters.genres.length})
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {visibleGenres.map((genre) => (
                        <FilterChip
                            key={genre.name}
                            label={genre.name}
                            active={filters.genres.includes(genre.name)}
                            onClick={() => toggleGenre(genre.name)}
                            count={genre.count}
                            color={genreColors[genre.name]}
                        />
                    ))}
                    {remainingCount > 0 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="chip hover:border-[#c9a227] hover:text-[#c9a227]"
                        >
                            +{remainingCount} more
                        </button>
                    )}
                </div>
            </div>

            {/* Genre Modal - Retro Style */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <div
                        className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#2a2a2a]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-[family-name:var(--font-playfair)] italic text-[#f5f5f0]">All Genres</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[#8a8a7a] hover:text-[#f5f5f0] text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search genres..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-xl text-[#f5f5f0] placeholder-[#5a5a4a] focus:outline-none focus:border-[#c9a227]"
                                autoFocus
                            />
                        </div>

                        {/* Genre List */}
                        <div className="p-6 overflow-y-auto max-h-[50vh]">
                            <div className="flex flex-wrap gap-2">
                                {filteredGenres.map((genre) => (
                                    <FilterChip
                                        key={genre.name}
                                        label={genre.name}
                                        active={filters.genres.includes(genre.name)}
                                        onClick={() => toggleGenre(genre.name)}
                                        count={genre.count}
                                        color={genreColors[genre.name]}
                                    />
                                ))}
                            </div>
                            {filteredGenres.length === 0 && (
                                <p className="text-center text-[#8a8a7a] py-8">
                                    No genres found matching &ldquo;{searchQuery}&rdquo;
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#2a2a2a] flex justify-between items-center">
                            <span className="text-sm text-[#8a8a7a]">
                                {filters.genres.length} selected
                            </span>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn-primary"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export { genreColors };
