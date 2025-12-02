import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { SummaryData } from '@/types';

export async function GET() {
    try {
        // Get total counts
        const [totalTitles, totalMovies, totalTVShows, totalGenres, totalCountries] = await Promise.all([
            prisma.title.count(),
            prisma.title.count({ where: { type: 'Movie' } }),
            prisma.title.count({ where: { type: 'TV Show' } }),
            prisma.genre.count(),
            prisma.country.count(),
        ]);

        // Get year range
        const yearStats = await prisma.title.aggregate({
            _min: { releaseYear: true },
            _max: { releaseYear: true },
        });

        // Get top genre
        const topGenreResult = await prisma.titleGenre.groupBy({
            by: ['genreId'],
            _count: { genreId: true },
            orderBy: { _count: { genreId: 'desc' } },
            take: 1,
        });

        let topGenre = 'N/A';
        if (topGenreResult.length > 0) {
            const genre = await prisma.genre.findUnique({
                where: { id: topGenreResult[0].genreId },
            });
            topGenre = genre?.name || 'N/A';
        }

        // Get top country
        const topCountryResult = await prisma.titleCountry.groupBy({
            by: ['countryId'],
            _count: { countryId: true },
            orderBy: { _count: { countryId: 'desc' } },
            take: 1,
        });

        let topCountry = 'N/A';
        if (topCountryResult.length > 0) {
            const country = await prisma.country.findUnique({
                where: { id: topCountryResult[0].countryId },
            });
            topCountry = country?.name || 'N/A';
        }

        const summary: SummaryData = {
            totalTitles,
            totalMovies,
            totalTVShows,
            totalGenres,
            totalCountries,
            yearRange: [
                yearStats._min.releaseYear || 1900,
                yearStats._max.releaseYear || new Date().getFullYear(),
            ],
            topGenre,
            topCountry,
        };

        return NextResponse.json(summary);
    } catch (error) {
        console.error('Error fetching summary:', error);
        return NextResponse.json(
            { error: 'Failed to fetch summary data' },
            { status: 500 }
        );
    }
}
