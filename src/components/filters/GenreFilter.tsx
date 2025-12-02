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

// Refined color palette for genres
const genreColors: Record<string, string> = {
    'International Movies': '#8b5cf6',
    'Dramas': '#06b6d4',
    'Comedies': '#10b981',
    'Action & Adventure': '#f59e0b',
    'Documentaries': '#ec4899',
    'Children & Family Movies': '#14b8a6',
    'Horror Movies': '#ef4444',
    'Romantic Movies': '#f472b6',
    'Thrillers': '#eab308',
    'Sci-Fi & Fantasy': '#6366f1',
    'Music & Musicals': '#a855f7',
    'Anime Features': '#22d3ee',
    'Classic Movies': '#84cc16',
    'Stand-Up Comedy': '#fb923c',
    'LGBTQ Movies': '#d946ef',
    'Sports Movies': '#34d399',
    'Independent Movies': '#60a5fa',
    'Crime TV Shows': '#ef4444',
    'International TV Shows': '#8b5cf6',
    'TV Dramas': '#06b6d4',
    'TV Comedies': '#10b981',
    'Kids\' TV': '#14b8a6',
    'Docuseries': '#ec4899',
    'Reality TV': '#fb923c',
    'Romantic TV Shows': '#f472b6',
    'TV Action & Adventure': '#f59e0b',
    'Anime Series': '#22d3ee',
    'TV Mysteries': '#a78bfa',
    'TV Thrillers': '#eab308',
    'British TV Shows': '#60a5fa',
    'Korean TV Shows': '#f472b6',
    'Spanish-Language TV Shows': '#fb7185',
    'TV Horror': '#ef4444',
    'TV Sci-Fi & Fantasy': '#6366f1',
    'Science & Nature TV': '#34d399',
    'Teen TV Shows': '#c084fc',
    'Classic & Cult TV': '#84cc16',
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
                    <h3 className="text-sm font-medium text-[#a1a1aa]">Filter by Genre</h3>
                    {filters.genres.length > 0 && (
                        <button
                            onClick={() => updateFilter('genres', [])}
                            className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] font-medium"
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
                            className="chip hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                        >
                            +{remainingCount} more
                        </button>
                    )}
                </div>
            </div>

            {/* Genre Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <div
                        className="relative bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#27272a]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">All Genres</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[#71717a] hover:text-white text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search genres..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 bg-[#27272a] border border-[#3f3f46] rounded-xl text-white placeholder-[#71717a] focus:outline-none focus:border-[#8b5cf6]"
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
                                <p className="text-center text-[#71717a] py-8">
                                    No genres found matching "{searchQuery}"
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#27272a] flex justify-between items-center">
                            <span className="text-sm text-[#71717a]">
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
