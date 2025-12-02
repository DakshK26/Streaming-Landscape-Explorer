'use client';

import { useFilters } from '@/context/FilterContext';
import FilterChip from './FilterChip';
import type { GenreStats } from '@/types';

interface GenreFilterProps {
  genres: GenreStats[];
  loading?: boolean;
  maxVisible?: number;
}

// Color palette for genres
const genreColors: Record<string, string> = {
  'Action & Adventure': '#e50914',
  'Dramas': '#0ea5e9',
  'Comedies': '#22c55e',
  'Documentaries': '#a855f7',
  'Horror Movies': '#f97316',
  'Romantic Movies': '#ec4899',
  'Thrillers': '#eab308',
  'Children & Family Movies': '#14b8a6',
  'International Movies': '#6366f1',
  'Sci-Fi & Fantasy': '#8b5cf6',
  'Music & Musicals': '#f43f5e',
  'Anime Features': '#06b6d4',
  'Classic Movies': '#84cc16',
  'Stand-Up Comedy': '#f59e0b',
  'LGBTQ Movies': '#d946ef',
  'Sports Movies': '#10b981',
  'Independent Movies': '#3b82f6',
  'TV Shows': '#0ea5e9',
  'Crime TV Shows': '#ef4444',
  'Kids\' TV': '#22d3d1',
  'British TV Shows': '#7c3aed',
  'International TV Shows': '#6366f1',
  'Romantic TV Shows': '#ec4899',
  'TV Dramas': '#0ea5e9',
  'TV Comedies': '#22c55e',
  'Reality TV': '#f97316',
  'TV Action & Adventure': '#e50914',
  'Docuseries': '#a855f7',
  'TV Mysteries': '#eab308',
  'TV Sci-Fi & Fantasy': '#8b5cf6',
  'Anime Series': '#06b6d4',
  'TV Horror': '#f97316',
  'TV Thrillers': '#eab308',
  'Korean TV Shows': '#ec4899',
  'Spanish-Language TV Shows': '#f43f5e',
  'Science & Nature TV': '#22c55e',
  'Teen TV Shows': '#a855f7',
  'Classic & Cult TV': '#84cc16',
};

export default function GenreFilter({ genres, loading, maxVisible = 15 }: GenreFilterProps) {
  const { filters, updateFilter } = useFilters();

  const toggleGenre = (genreName: string) => {
    const current = filters.genres;
    if (current.includes(genreName)) {
      updateFilter('genres', current.filter((g) => g !== genreName));
    } else {
      updateFilter('genres', [...current, genreName]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 bg-[#1a1a1a] rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  const visibleGenres = genres.slice(0, maxVisible);
  const hasMore = genres.length > maxVisible;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#a3a3a3]">Filter by Genre</h3>
        {filters.genres.length > 0 && (
          <button
            onClick={() => updateFilter('genres', [])}
            className="text-xs text-[#e50914] hover:underline"
          >
            Clear all
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
        {hasMore && (
          <span className="text-xs text-[#a3a3a3] self-center">
            +{genres.length - maxVisible} more
          </span>
        )}
      </div>
    </div>
  );
}

export { genreColors };
