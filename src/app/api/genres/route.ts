import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { GenreStats } from '@/types';
import { consolidateGenreStats } from '@/lib/genreConsolidation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
        const yearMin = parseInt(searchParams.get('yearMin') || '0') || undefined;
        const yearMax = parseInt(searchParams.get('yearMax') || '9999') || undefined;
        const countryMode = searchParams.get('countryMode') || 'all';

        // Build base filter for titles
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const titleFilter: any = {};

        if (yearMin) {
            titleFilter.releaseYear = { ...titleFilter.releaseYear, gte: yearMin };
        }
        if (yearMax) {
            titleFilter.releaseYear = { ...titleFilter.releaseYear, lte: yearMax };
        }
        if (countries.length > 0) {
            titleFilter.countries = {
                some: {
                    country: { name: { in: countries } },
                    ...(countryMode === 'primary' ? { isPrimary: true } : {}),
                },
            };
        }

        // Get all genres
        const genres = await prisma.genre.findMany({
            select: {
                name: true,
                titles: {
                    where: { title: titleFilter },
                    select: {
                        title: {
                            select: {
                                type: true,
                                releaseYear: true,
                            },
                        },
                    },
                },
            },
        });

        interface TitleData {
            type: string;
            releaseYear: number;
        }

        interface GenreData {
            name: string;
            titles: { title: TitleData }[];
        }

        const genreStats: GenreStats[] = (genres as GenreData[]).map((genre) => {
            const titles = genre.titles.map((t) => t.title);
            const movieCount = titles.filter((t) => t.type === 'Movie').length;
            const tvShowCount = titles.filter((t) => t.type === 'TV Show').length;
            const avgYear = titles.length > 0
                ? Math.round(titles.reduce((sum: number, t) => sum + t.releaseYear, 0) / titles.length)
                : 0;

            return {
                name: genre.name,
                count: titles.length,
                avgYear,
                movieCount,
                tvShowCount,
            };
        });

        // Sort by count descending and filter out empty genres
        const sortedStats = genreStats
            .filter((g) => g.count > 0)
            .sort((a, b) => b.count - a.count);

        // Consolidate genres (merge TV/Movie variants)
        const consolidatedStats = consolidateGenreStats(sortedStats);

        return NextResponse.json(consolidatedStats);
    } catch (error) {
        console.error('Error fetching genres:', error);
        return NextResponse.json(
            { error: 'Failed to fetch genre data' },
            { status: 500 }
        );
    }
}
