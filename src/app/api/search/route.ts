import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Title } from '@/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim() || '';
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const titles = await prisma.title.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
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
            orderBy: [
                { releaseYear: 'desc' },
            ],
            take: limit,
        });

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

        return NextResponse.json({ results: formattedTitles });
    } catch (error) {
        console.error('Error searching titles:', error);
        return NextResponse.json(
            { error: 'Failed to search titles' },
            { status: 500 }
        );
    }
}
