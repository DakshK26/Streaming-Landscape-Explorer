// Map of specific genre names to their consolidated category
export const genreConsolidationMap: Record<string, string> = {
    // Drama consolidation
    'Dramas': 'Drama',
    'TV Dramas': 'Drama',

    // Comedy consolidation  
    'Comedies': 'Comedy',
    'TV Comedies': 'Comedy',

    // Action & Adventure consolidation
    'Action & Adventure': 'Action & Adventure',
    'TV Action & Adventure': 'Action & Adventure',

    // Thriller consolidation
    'Thrillers': 'Thriller',
    'TV Thrillers': 'Thriller',

    // Sci-Fi & Fantasy consolidation
    'Sci-Fi & Fantasy': 'Sci-Fi & Fantasy',
    'TV Sci-Fi & Fantasy': 'Sci-Fi & Fantasy',

    // Horror consolidation
    'Horror Movies': 'Horror',
    'TV Horror': 'Horror',

    // Documentary consolidation
    'Documentaries': 'Documentary',
    'Docuseries': 'Documentary',
    'Science & Nature TV': 'Documentary',

    // International consolidation
    'International Movies': 'International',
    'International TV Shows': 'International',
    'British TV Shows': 'International',
    'Spanish-Language TV Shows': 'International',
    'Korean TV Shows': 'International',

    // Romance consolidation
    'Romantic Movies': 'Romance',
    'Romantic TV Shows': 'Romance',

    // Kids & Family consolidation
    'Children & Family Movies': 'Kids & Family',
    "Kids' TV": 'Kids & Family',

    // Anime consolidation
    'Anime Features': 'Anime',
    'Anime Series': 'Anime',

    // Stand-Up & Talk Shows consolidation
    'Stand-Up Comedy': 'Stand-Up & Talk',
    'Stand-Up Comedy & Talk Shows': 'Stand-Up & Talk',

    // Crime consolidation
    'Crime TV Shows': 'Crime',
    'TV Mysteries': 'Crime',

    // Reality consolidation
    'Reality TV': 'Reality',

    // Teen content
    'Teen TV Shows': 'Teen',

    // Classic & Cult
    'Classic Movies': 'Classic & Cult',
    'Cult Movies': 'Classic & Cult',
    'Classic & Cult TV': 'Classic & Cult',

    // Independent
    'Independent Movies': 'Independent',

    // Music
    'Music & Musicals': 'Music & Musicals',

    // Sports
    'Sports Movies': 'Sports',

    // LGBTQ
    'LGBTQ Movies': 'LGBTQ',

    // Faith
    'Faith & Spirituality': 'Faith & Spirituality',
};

// Get the consolidated genre name, or return original if not in map
export function getConsolidatedGenre(genreName: string): string {
    return genreConsolidationMap[genreName] || genreName;
}

// Get all original genres that map to a consolidated genre
export function getOriginalGenres(consolidatedGenre: string): string[] {
    const originals: string[] = [];
    for (const [original, consolidated] of Object.entries(genreConsolidationMap)) {
        if (consolidated === consolidatedGenre) {
            originals.push(original);
        }
    }
    // If no mappings found, the genre maps to itself
    return originals.length > 0 ? originals : [consolidatedGenre];
}

// Consolidate an array of genre stats
export interface GenreStatInput {
    name: string;
    count: number;
    avgYear: number;
    movieCount: number;
    tvShowCount: number;
}

export function consolidateGenreStats(stats: GenreStatInput[]): GenreStatInput[] {
    const consolidated = new Map<string, GenreStatInput>();

    for (const stat of stats) {
        const consolidatedName = getConsolidatedGenre(stat.name);
        const existing = consolidated.get(consolidatedName);

        if (existing) {
            // Merge stats
            const totalCount = existing.count + stat.count;
            existing.count = totalCount;
            existing.movieCount += stat.movieCount;
            existing.tvShowCount += stat.tvShowCount;
            // Weighted average for avgYear
            existing.avgYear = Math.round(
                (existing.avgYear * (existing.count - stat.count) + stat.avgYear * stat.count) / totalCount
            );
        } else {
            consolidated.set(consolidatedName, {
                name: consolidatedName,
                count: stat.count,
                avgYear: stat.avgYear,
                movieCount: stat.movieCount,
                tvShowCount: stat.tvShowCount,
            });
        }
    }

    return Array.from(consolidated.values()).sort((a, b) => b.count - a.count);
}
