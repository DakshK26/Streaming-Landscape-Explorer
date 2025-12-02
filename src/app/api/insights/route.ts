import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Insight } from '@/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
        const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
        const yearMin = parseInt(searchParams.get('yearMin') || '0') || undefined;
        const yearMax = parseInt(searchParams.get('yearMax') || '9999') || undefined;
        const countryMode = searchParams.get('countryMode') || 'all';

        // Build where clause for filtering
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = {};

        if (yearMin) {
            whereClause.releaseYear = { ...whereClause.releaseYear, gte: yearMin };
        }
        if (yearMax) {
            whereClause.releaseYear = { ...whereClause.releaseYear, lte: yearMax };
        }
        if (genres.length > 0) {
            whereClause.genres = {
                some: {
                    genre: { name: { in: genres } },
                },
            };
        }
        if (countries.length > 0) {
            whereClause.countries = {
                some: {
                    country: { name: { in: countries } },
                    ...(countryMode === 'primary' ? { isPrimary: true } : {}),
                },
            };
        }

        const insights: Insight[] = [];

        // Get filtered titles for analysis
        const titles = await prisma.title.findMany({
            where: whereClause,
            select: {
                type: true,
                releaseYear: true,
                genres: {
                    select: {
                        genre: { select: { name: true } },
                    },
                },
                countries: {
                    select: {
                        isPrimary: true,
                        country: { select: { name: true } },
                    },
                },
            },
        });

        interface TitleData {
            type: string;
            releaseYear: number;
            genres: { genre: { name: string } }[];
            countries: { isPrimary: boolean; country: { name: string } }[];
        }

        const typedTitles = titles as TitleData[];
        const totalCount = typedTitles.length;

        if (totalCount === 0) {
            insights.push({
                id: 'no-data',
                type: 'info',
                title: 'No Data',
                description: 'No titles match the current filters. Try adjusting your selection.',
            });
            return NextResponse.json(insights);
        }

        // Insight 1: Total count
        const movieCount = typedTitles.filter((t) => t.type === 'Movie').length;
        const tvShowCount = typedTitles.filter((t) => t.type === 'TV Show').length;

        insights.push({
            id: 'total-count',
            type: 'info',
            title: 'Content Overview',
            description: `Showing ${totalCount.toLocaleString()} titles: ${movieCount.toLocaleString()} movies and ${tvShowCount.toLocaleString()} TV shows.`,
            value: totalCount,
        });

        // Insight 2: Most common genre in current selection
        const genreCounts = new Map<string, number>();
        typedTitles.forEach((t) => {
            t.genres.forEach((g) => {
                genreCounts.set(g.genre.name, (genreCounts.get(g.genre.name) || 0) + 1);
            });
        });

        const sortedGenres = Array.from(genreCounts.entries()).sort((a, b) => b[1] - a[1]);
        if (sortedGenres.length > 0) {
            const [topGenre, topGenreCount] = sortedGenres[0];
            const percentage = Math.round((topGenreCount / totalCount) * 100);
            insights.push({
                id: 'top-genre',
                type: 'highlight',
                title: 'Dominant Genre',
                description: `${topGenre} is the most common genre, appearing in ${percentage}% of the selected titles.`,
                value: topGenre,
            });
        }

        // Insight 3: Year trend
        const yearCounts = new Map<number, number>();
        typedTitles.forEach((t) => {
            yearCounts.set(t.releaseYear, (yearCounts.get(t.releaseYear) || 0) + 1);
        });

        const sortedYears = Array.from(yearCounts.entries()).sort((a, b) => b[1] - a[1]);
        if (sortedYears.length > 0) {
            const [peakYear, peakCount] = sortedYears[0];
            insights.push({
                id: 'peak-year',
                type: 'trend',
                title: 'Peak Year',
                description: `${peakYear} had the highest content output with ${peakCount.toLocaleString()} titles.`,
                value: peakYear,
            });
        }

        // Insight 4: Geographic spread
        const countryCounts = new Map<string, number>();
        typedTitles.forEach((t) => {
            const relevantCountries = countryMode === 'primary'
                ? t.countries.filter((c) => c.isPrimary)
                : t.countries;
            relevantCountries.forEach((c) => {
                countryCounts.set(c.country.name, (countryCounts.get(c.country.name) || 0) + 1);
            });
        });

        const sortedCountries = Array.from(countryCounts.entries()).sort((a, b) => b[1] - a[1]);
        if (sortedCountries.length > 0) {
            const [topCountry, topCountryCount] = sortedCountries[0];
            const countryPercentage = Math.round((topCountryCount / totalCount) * 100);
            insights.push({
                id: 'top-country',
                type: 'highlight',
                title: 'Leading Producer',
                description: `${topCountry} leads with ${countryPercentage}% of the selected content.`,
                value: topCountry,
            });
        }

        // Insight 5: Content type ratio
        const movieRatio = Math.round((movieCount / totalCount) * 100);
        const dominantType = movieCount > tvShowCount ? 'Movies' : 'TV Shows';
        insights.push({
            id: 'type-ratio',
            type: 'info',
            title: 'Content Mix',
            description: `${dominantType} dominate the selection at ${dominantType === 'Movies' ? movieRatio : 100 - movieRatio}% of total content.`,
            value: `${movieRatio}% Movies`,
        });

        // Insight 6: Recent trend (if we have enough years)
        const recentYears = Array.from(yearCounts.entries())
            .filter(([year]) => year >= 2015)
            .sort((a, b) => a[0] - b[0]);

        if (recentYears.length >= 3) {
            const recentTotal = recentYears.reduce((sum, [, count]) => sum + count, 0);
            const recentPercentage = Math.round((recentTotal / totalCount) * 100);

            insights.push({
                id: 'recent-trend',
                type: 'trend',
                title: 'Recent Growth',
                description: `${recentPercentage}% of the selected content was released since 2015, showing ${recentPercentage > 50 ? 'significant modern growth' : 'a mix of classic and modern titles'}.`,
                value: recentPercentage,
            });
        }

        return NextResponse.json(insights);
    } catch (error) {
        console.error('Error generating insights:', error);
        return NextResponse.json(
            { error: 'Failed to generate insights' },
            { status: 500 }
        );
    }
}
