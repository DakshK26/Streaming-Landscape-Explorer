/**
 * @jest-environment node
 */

import { GET as getSummary } from '@/app/api/summary/route';
import { GET as getTimeline } from '@/app/api/timeline/route';
import { GET as getGenres } from '@/app/api/genres/route';
import { GET as getCountries } from '@/app/api/countries/route';
import { GET as getTitles } from '@/app/api/titles/route';
import { GET as getScatter } from '@/app/api/scatter/route';
import { GET as getInsights } from '@/app/api/insights/route';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    title: {
      count: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    genre: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    country: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    titleGenre: {
      groupBy: jest.fn(),
    },
    titleCountry: {
      groupBy: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/summary', () => {
    it('should return summary data', async () => {
      // Mock the database responses
      (mockPrisma.title.count as jest.Mock)
        .mockResolvedValueOnce(1000) // total
        .mockResolvedValueOnce(600)  // movies
        .mockResolvedValueOnce(400); // tv shows
      
      (mockPrisma.genre.count as jest.Mock).mockResolvedValue(42);
      (mockPrisma.country.count as jest.Mock).mockResolvedValue(123);
      
      (mockPrisma.title.aggregate as jest.Mock).mockResolvedValue({
        _min: { releaseYear: 1925 },
        _max: { releaseYear: 2021 },
      });
      
      (mockPrisma.titleGenre.groupBy as jest.Mock).mockResolvedValue([
        { genreId: 'genre-1', _count: { genreId: 500 } },
      ]);
      
      (mockPrisma.genre.findUnique as jest.Mock).mockResolvedValue({
        id: 'genre-1',
        name: 'Drama',
      });
      
      (mockPrisma.titleCountry.groupBy as jest.Mock).mockResolvedValue([
        { countryId: 'country-1', _count: { countryId: 300 } },
      ]);
      
      (mockPrisma.country.findUnique as jest.Mock).mockResolvedValue({
        id: 'country-1',
        name: 'United States',
      });

      const response = await getSummary();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        totalTitles: 1000,
        totalMovies: 600,
        totalTVShows: 400,
        totalGenres: 42,
        totalCountries: 123,
        yearRange: [1925, 2021],
        topGenre: 'Drama',
        topCountry: 'United States',
      });
    });

    it('should handle errors gracefully', async () => {
      (mockPrisma.title.count as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await getSummary();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
    });
  });

  describe('GET /api/timeline', () => {
    it('should return timeline data', async () => {
      (mockPrisma.title.findMany as jest.Mock).mockResolvedValue([
        { releaseYear: 2020, type: 'Movie' },
        { releaseYear: 2020, type: 'Movie' },
        { releaseYear: 2020, type: 'TV Show' },
        { releaseYear: 2021, type: 'Movie' },
        { releaseYear: 2021, type: 'TV Show' },
        { releaseYear: 2021, type: 'TV Show' },
      ]);

      const request = new Request('http://localhost/api/timeline');
      const response = await getTimeline(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        { year: 2020, movies: 2, tvShows: 1, total: 3 },
        { year: 2021, movies: 1, tvShows: 2, total: 3 },
      ]);
    });

    it('should filter by genre', async () => {
      (mockPrisma.title.findMany as jest.Mock).mockResolvedValue([
        { releaseYear: 2020, type: 'Movie' },
      ]);

      const request = new Request('http://localhost/api/timeline?genres=Drama');
      const response = await getTimeline(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.title.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            genres: expect.any(Object),
          }),
        })
      );
    });
  });

  describe('GET /api/genres', () => {
    it('should return genre statistics', async () => {
      (mockPrisma.genre.findMany as jest.Mock).mockResolvedValue([
        {
          name: 'Drama',
          titles: [
            { title: { type: 'Movie', releaseYear: 2020 } },
            { title: { type: 'TV Show', releaseYear: 2021 } },
          ],
        },
        {
          name: 'Comedy',
          titles: [
            { title: { type: 'Movie', releaseYear: 2019 } },
          ],
        },
      ]);

      const request = new Request('http://localhost/api/genres');
      const response = await getGenres(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Drama');
      expect(data[0].count).toBe(2);
    });
  });

  describe('GET /api/countries', () => {
    it('should return country statistics', async () => {
      (mockPrisma.country.findMany as jest.Mock).mockResolvedValue([
        {
          name: 'United States',
          code: 'USA',
          titles: [
            { 
              title: { 
                type: 'Movie',
                genres: [{ genre: { name: 'Drama' } }],
              } 
            },
          ],
        },
      ]);

      const request = new Request('http://localhost/api/countries');
      const response = await getCountries(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('United States');
      expect(data[0].code).toBe('USA');
    });
  });

  describe('GET /api/titles', () => {
    it('should return paginated titles', async () => {
      (mockPrisma.title.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          showId: 's1',
          type: 'Movie',
          title: 'Test Movie',
          director: 'Director',
          cast: 'Actor 1, Actor 2',
          dateAdded: new Date('2021-01-01'),
          releaseYear: 2020,
          rating: 'PG-13',
          duration: '120 min',
          description: 'A test movie',
          countries: [{ country: { name: 'United States' } }],
          genres: [{ genre: { name: 'Drama' } }],
        },
      ]);
      (mockPrisma.title.count as jest.Mock).mockResolvedValue(1);

      const request = new Request('http://localhost/api/titles?limit=10&offset=0');
      const response = await getTitles(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.titles).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.titles[0].title).toBe('Test Movie');
    });
  });

  describe('GET /api/scatter', () => {
    it('should return scatter plot data', async () => {
      (mockPrisma.title.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          title: 'Test Movie',
          type: 'Movie',
          releaseYear: 2020,
          duration: '90 min',
          countries: [{ country: { name: 'United States' } }],
          genres: [{ genre: { name: 'Drama' } }],
        },
      ]);

      const request = new Request('http://localhost/api/scatter');
      const response = await getScatter(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].duration).toBe(90);
      expect(data[0].genre).toBe('Drama');
    });
  });

  describe('GET /api/insights', () => {
    it('should return dynamic insights', async () => {
      (mockPrisma.title.findMany as jest.Mock).mockResolvedValue([
        {
          type: 'Movie',
          releaseYear: 2020,
          genres: [{ genre: { name: 'Drama' } }],
          countries: [{ isPrimary: true, country: { name: 'United States' } }],
        },
        {
          type: 'TV Show',
          releaseYear: 2020,
          genres: [{ genre: { name: 'Drama' } }],
          countries: [{ isPrimary: true, country: { name: 'United States' } }],
        },
      ]);

      const request = new Request('http://localhost/api/insights');
      const response = await getInsights(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Check for expected insight types
      const insightIds = data.map((i: { id: string }) => i.id);
      expect(insightIds).toContain('total-count');
    });

    it('should handle empty results', async () => {
      (mockPrisma.title.findMany as jest.Mock).mockResolvedValue([]);

      const request = new Request('http://localhost/api/insights?genres=NonExistent');
      const response = await getInsights(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe('no-data');
    });
  });
});
