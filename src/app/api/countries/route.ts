import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { CountryData } from '@/types';

interface TitleResult {
    type: string;
}

interface TitleJoin {
    title: TitleResult;
}

interface CountryResult {
    name: string;
    code: string | null;
    titles: TitleJoin[];
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
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
        if (genres.length > 0) {
            titleFilter.genres = {
                some: {
                    genre: { name: { in: genres } },
                },
            };
        }

        // Build country filter based on mode
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countryRelationFilter: any = { title: titleFilter };
        if (countryMode === 'primary') {
            countryRelationFilter.isPrimary = true;
        }

        // Get all countries with their titles
        const countries = await prisma.country.findMany({
            select: {
                name: true,
                code: true,
                titles: {
                    where: countryRelationFilter,
                    select: {
                        title: {
                            select: {
                                type: true,
                            },
                        },
                    },
                },
            },
        });

        const countryStats: CountryData[] = (countries as CountryResult[]).map((country) => {
            const titles = country.titles.map((t) => t.title);
            const movieCount = titles.filter((t) => t.type === 'Movie').length;
            const tvShowCount = titles.filter((t) => t.type === 'TV Show').length;

            return {
                country: country.name,
                iso: country.code,
                count: titles.length,
                movieCount,
                tvShowCount,
            };
        });

        // Sort by count descending and filter out empty countries
        const sortedStats = countryStats
            .filter((c) => c.count > 0)
            .sort((a, b) => b.count - a.count);

        return NextResponse.json(sortedStats);
    } catch (error) {
        console.error('Error fetching countries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch country data' },
            { status: 500 }
        );
    }
}
