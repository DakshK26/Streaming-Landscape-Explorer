import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Title } from '@/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
        const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
        const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
        const yearMin = parseInt(searchParams.get('yearMin') || '0') || undefined;
        const yearMax = parseInt(searchParams.get('yearMax') || '9999') || undefined;
        const countryMode = searchParams.get('countryMode') || 'all';
        const limit = parseInt(searchParams.get('limit') || '500');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Build where clause
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

        const [titles, totalCount] = await Promise.all([
            prisma.title.findMany({
                where: whereClause,
                select: {
                    id: true,
                    showId: true,
                    type: true,
                    title: true,
                    director: true,
                    cast: true,
                    dateAdded: true,
                    releaseYear: true,
                    rating: true,
                    duration: true,
                    description: true,
                    countries: {
                        select: {
                            country: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    genres: {
                        select: {
                            genre: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { releaseYear: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.title.count({ where: whereClause }),
        ]);

        interface TitleWithRelations {
            id: string;
            showId: string;
            type: string;
            title: string;
            director: string | null;
            cast: string | null;
            dateAdded: Date | null;
            releaseYear: number;
            rating: string | null;
            duration: string | null;
            description: string | null;
            countries: { country: { name: string } }[];
            genres: { genre: { name: string } }[];
        }

        const formattedTitles: Title[] = (titles as TitleWithRelations[]).map((t) => ({
            id: t.id,
            showId: t.showId,
            type: t.type as 'Movie' | 'TV Show',
            title: t.title,
            director: t.director,
            cast: t.cast,
            dateAdded: t.dateAdded?.toISOString() || null,
            releaseYear: t.releaseYear,
            rating: t.rating,
            duration: t.duration,
            description: t.description,
            countries: t.countries.map((c) => c.country.name),
            genres: t.genres.map((g) => g.genre.name),
        }));

        return NextResponse.json({
            titles: formattedTitles,
            total: totalCount,
            limit,
            offset,
        });
    } catch (error) {
        console.error('Error fetching titles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch titles' },
            { status: 500 }
        );
    }
}
