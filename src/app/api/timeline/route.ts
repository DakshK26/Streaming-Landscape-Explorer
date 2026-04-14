import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getOriginalGenres } from '@/lib/genreConsolidation';
import type { TimelineDataPoint } from '@/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
        const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
        const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
        const yearMin = parseInt(searchParams.get('yearMin') || '0') || undefined;
        const yearMax = parseInt(searchParams.get('yearMax') || '9999') || undefined;
        const countryMode = searchParams.get('countryMode') || 'all';

        const expandedGenres = genres.flatMap(g => getOriginalGenres(g));

        // Build where clause for filtering
        const whereClause: Record<string, unknown> = {};

        if (yearMin) {
            whereClause.releaseYear = { ...(whereClause.releaseYear as object), gte: yearMin };
        }
        if (yearMax) {
            whereClause.releaseYear = { ...(whereClause.releaseYear as object), lte: yearMax };
        }
        if (types.length > 0) {
            whereClause.type = { in: types };
        }
        if (expandedGenres.length > 0) {
            whereClause.genres = {
                some: {
                    genre: {
                        name: { in: expandedGenres }
                    }
                }
            };
        }

        if (countries.length > 0) {
            whereClause.countries = {
                some: {
                    country: {
                        name: { in: countries }
                    },
                    ...(countryMode === 'primary' ? { isPrimary: true } : {})
                }
            };
        }

        // Get all titles with filters
        const titles = await prisma.title.findMany({
            where: whereClause,
            select: {
                releaseYear: true,
                type: true,
            },
        });

        // Aggregate by year
        const yearMap = new Map<number, { movies: number; tvShows: number }>();

        for (const title of titles) {
            const year = title.releaseYear;
            if (!yearMap.has(year)) {
                yearMap.set(year, { movies: 0, tvShows: 0 });
            }
            const entry = yearMap.get(year)!;
            if (title.type === 'Movie') {
                entry.movies++;
            } else {
                entry.tvShows++;
            }
        }

        // Convert to array and sort by year
        const timeline: TimelineDataPoint[] = Array.from(yearMap.entries())
            .map(([year, counts]) => ({
                year,
                movies: counts.movies,
                tvShows: counts.tvShows,
                total: counts.movies + counts.tvShows,
            }))
            .sort((a, b) => a.year - b.year);

        return NextResponse.json(timeline);
    } catch (error) {
        console.error('Error fetching timeline:', error);
        return NextResponse.json(
            { error: 'Failed to fetch timeline data' },
            { status: 500 }
        );
    }
}
