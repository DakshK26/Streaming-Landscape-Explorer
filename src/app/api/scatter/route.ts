import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ScatterDataPoint } from '@/types';

function parseDuration(duration: string | null, type: string): number | null {
  if (!duration) return null;
  
  if (type === 'Movie') {
    // Parse "90 min" format
    const match = duration.match(/(\d+)\s*min/i);
    if (match) return parseInt(match[1]);
  } else {
    // Parse "2 Seasons" format
    const match = duration.match(/(\d+)\s*Season/i);
    if (match) return parseInt(match[1]);
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const yearMin = parseInt(searchParams.get('yearMin') || '0') || undefined;
    const yearMax = parseInt(searchParams.get('yearMax') || '9999') || undefined;
    const countryMode = searchParams.get('countryMode') || 'all';
    const limit = parseInt(searchParams.get('limit') || '1000');

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

    const titles = await prisma.title.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        type: true,
        releaseYear: true,
        duration: true,
        countries: {
          where: countryMode === 'primary' ? { isPrimary: true } : {},
          take: 1,
          select: {
            country: {
              select: {
                name: true,
              },
            },
          },
        },
        genres: {
          take: 1,
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: limit,
    });

    interface TitleData {
      id: string;
      title: string;
      type: string;
      releaseYear: number;
      duration: string | null;
      countries: { country: { name: string } }[];
      genres: { genre: { name: string } }[];
    }

    const scatterData: ScatterDataPoint[] = (titles as TitleData[])
      .filter((t) => t.genres.length > 0)
      .map((t) => ({
        id: t.id,
        title: t.title,
        type: t.type as 'Movie' | 'TV Show',
        releaseYear: t.releaseYear,
        genre: t.genres[0]?.genre.name || 'Unknown',
        country: t.countries[0]?.country.name || 'Unknown',
        duration: parseDuration(t.duration, t.type),
      }));

    return NextResponse.json(scatterData);
  } catch (error) {
    console.error('Error fetching scatter data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scatter data' },
      { status: 500 }
    );
  }
}
