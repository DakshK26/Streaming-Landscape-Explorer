import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { GenreStats } from '@/types';
import { getOriginalGenres, getConsolidatedGenre } from '@/lib/genreConsolidation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const selectedGenres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
        const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
        const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
        const yearMin = parseInt(searchParams.get('yearMin') || '0') || undefined;
        const yearMax = parseInt(searchParams.get('yearMax') || '9999') || undefined;
        const countryMode = searchParams.get('countryMode') || 'all';

        const expandedGenres = selectedGenres.flatMap(g => getOriginalGenres(g));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = {};

        if (yearMin) {
            whereClause.releaseYear = { ...whereClause.releaseYear, gte: yearMin };
        }
        if (yearMax) {
            whereClause.releaseYear = { ...whereClause.releaseYear, lte: yearMax };
        }
        if (types.length > 0) {
            whereClause.type = { in: types };
        }
        if (expandedGenres.length > 0) {
            whereClause.genres = {
                some: {
                    genre: { name: { in: expandedGenres } },
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

        // Query titles with their genres so we can count each title once per
        // consolidated genre (avoids double-counting when a title has multiple
        // raw genres in the same group, e.g. "International Movies" + "Korean TV Shows")
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
            },
        });

        interface TitleRow {
            type: string;
            releaseYear: number;
            genres: { genre: { name: string } }[];
        }

        const genreMap = new Map<string, { count: number; movieCount: number; tvShowCount: number; yearSum: number }>();

        for (const title of titles as TitleRow[]) {
            // Deduplicate: a title with "International Movies" + "Korean TV Shows"
            // should count only once for the "International" consolidated genre
            const consolidated = new Set<string>();
            for (const g of title.genres) {
                consolidated.add(getConsolidatedGenre(g.genre.name));
            }

            for (const genre of consolidated) {
                const stats = genreMap.get(genre) || { count: 0, movieCount: 0, tvShowCount: 0, yearSum: 0 };
                stats.count++;
                if (title.type === 'Movie') stats.movieCount++;
                else stats.tvShowCount++;
                stats.yearSum += title.releaseYear;
                genreMap.set(genre, stats);
            }
        }

        const genreStats: GenreStats[] = Array.from(genreMap.entries())
            .map(([name, stats]) => ({
                name,
                count: stats.count,
                avgYear: stats.count > 0 ? Math.round(stats.yearSum / stats.count) : 0,
                movieCount: stats.movieCount,
                tvShowCount: stats.tvShowCount,
            }))
            .filter(g => g.count > 0)
            .sort((a, b) => b.count - a.count);

        return NextResponse.json(genreStats);
    } catch (error) {
        console.error('Error fetching genres:', error);
        return NextResponse.json(
            { error: 'Failed to fetch genre data' },
            { status: 500 }
        );
    }
}
