import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';
import { getCountryCode } from '../src/lib/countryCodeMap';

const prisma = new PrismaClient();

interface NetflixRow {
    show_id: string;
    type: string;
    title: string;
    director: string;
    cast: string;
    country: string;
    date_added: string;
    release_year: string;
    rating: string;
    duration: string;
    listed_in: string;
    description: string;
}

function parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.trim() === '') return null;

    // Netflix format: "September 25, 2021"
    const date = new Date(dateStr.trim());
    if (isNaN(date.getTime())) return null;
    return date;
}

function splitAndClean(value: string): string[] {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

async function main() {
    console.log('🎬 Starting Netflix data seed...');

    // Check if CSV exists
    const csvPath = path.join(process.cwd(), 'data', 'netflix_titles.csv');
    if (!fs.existsSync(csvPath)) {
        console.error('❌ CSV file not found at:', csvPath);
        console.log('\n📥 Please download the Netflix dataset from Kaggle:');
        console.log('   https://www.kaggle.com/datasets/shivamb/netflix-shows');
        console.log('\n📁 Then place the netflix_titles.csv file in the /data folder');
        process.exit(1);
    }

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.titleGenre.deleteMany();
    await prisma.titleCountry.deleteMany();
    await prisma.title.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.country.deleteMany();

    // Read and parse CSV
    console.log('📖 Reading CSV file...');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const parsed = Papa.parse<NetflixRow>(csvContent, {
        header: true,
        skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
        console.warn('⚠️ CSV parsing warnings:', parsed.errors.slice(0, 5));
    }

    const rows = parsed.data;
    console.log(`📊 Found ${rows.length} titles to process`);

    // Collect unique genres and countries
    const genreSet = new Set<string>();
    const countrySet = new Set<string>();

    for (const row of rows) {
        splitAndClean(row.listed_in).forEach(g => genreSet.add(g));
        splitAndClean(row.country).forEach(c => countrySet.add(c));
    }

    // Create genres
    console.log(`🎭 Creating ${genreSet.size} genres...`);
    const genreMap = new Map<string, string>();
    for (const name of genreSet) {
        const genre = await prisma.genre.create({
            data: { name },
        });
        genreMap.set(name, genre.id);
    }

    // Create countries with ISO codes
    console.log(`🌍 Creating ${countrySet.size} countries...`);
    const countryMap = new Map<string, string>();
    for (const name of countrySet) {
        const code = getCountryCode(name);
        const country = await prisma.country.create({
            data: { name, code },
        });
        countryMap.set(name, country.id);
    }

    // Create titles with relationships
    console.log('📽️ Creating titles...');
    let successCount = 0;
    let errorCount = 0;

    for (const row of rows) {
        try {
            const countries = splitAndClean(row.country);
            const genres = splitAndClean(row.listed_in);

            const title = await prisma.title.create({
                data: {
                    showId: row.show_id,
                    type: row.type,
                    title: row.title,
                    director: row.director || null,
                    cast: row.cast || null,
                    dateAdded: parseDate(row.date_added),
                    releaseYear: parseInt(row.release_year) || 0,
                    rating: row.rating || null,
                    duration: row.duration || null,
                    description: row.description || null,
                    countries: {
                        create: countries.map((name, index) => ({
                            countryId: countryMap.get(name)!,
                            isPrimary: index === 0,
                        })),
                    },
                    genres: {
                        create: genres.map(name => ({
                            genreId: genreMap.get(name)!,
                        })),
                    },
                },
            });

            successCount++;
            if (successCount % 500 === 0) {
                console.log(`   Processed ${successCount} titles...`);
            }
        } catch (error) {
            errorCount++;
            if (errorCount <= 5) {
                console.error(`   Error processing "${row.title}":`, error);
            }
        }
    }

    console.log('\n✅ Seed completed!');
    console.log(`   Titles created: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Genres: ${genreSet.size}`);
    console.log(`   Countries: ${countrySet.size}`);
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
