// Common types used across the application

export interface Title {
    id: string;
    showId: string;
    type: 'Movie' | 'TV Show';
    title: string;
    director: string | null;
    cast: string | null;
    dateAdded: string | null;
    releaseYear: number;
    rating: string | null;
    duration: string | null;
    description: string | null;
    countries: string[];
    genres: string[];
}

export interface Genre {
    id: string;
    name: string;
    count: number;
}

export interface Country {
    id: string;
    name: string;
    code: string | null;
    count: number;
}

export interface TimelineDataPoint {
    year: number;
    movies: number;
    tvShows: number;
    total: number;
}

export interface GenreStats {
    name: string;
    count: number;
    avgYear: number;
    movieCount: number;
    tvShowCount: number;
}

export interface CountryStats {
    name: string;
    code: string | null;
    count: number;
    movieCount: number;
    tvShowCount: number;
    topGenres: string[];
}

export interface CountryData {
    country: string;
    iso: string | null;
    count: number;
    movieCount: number;
    tvShowCount: number;
}

export interface ScatterDataPoint {
    id: string;
    title: string;
    type: 'Movie' | 'TV Show';
    releaseYear: number;
    genre: string;
    country: string;
    duration: number | null; // in minutes for movies, seasons for TV shows
}

export interface Insight {
    id: string;
    type: 'info' | 'trend' | 'highlight';
    title: string;
    description: string;
    value?: string | number;
}

export interface FilterState {
    genres: string[];
    countries: string[];
    types: ('Movie' | 'TV Show')[];
    yearRange: [number, number];
    countryMode: 'all' | 'primary';
}

export interface SummaryData {
    totalTitles: number;
    totalMovies: number;
    totalTVShows: number;
    totalGenres: number;
    totalCountries: number;
    yearRange: [number, number];
    topGenre: string;
    topCountry: string;
}
