'use client';

import { ResponsiveLine } from '@nivo/line';
import type { ScatterDataPoint } from '@/types';
import { useMemo } from 'react';
import { getConsolidatedGenre } from '@/lib/genreConsolidation';

interface GenreTrendChartProps {
    data: ScatterDataPoint[];
    loading?: boolean;
    selectedGenre: string | null;
}

// Retro color palette for genre lines
const genreColors: Record<string, string> = {
    'Drama': '#c9a227',
    'Comedy': '#7db88f',
    'Action & Adventure': '#e07b4c',
    'International': '#5ba3c0',
    'Documentary': '#9b8ec4',
    'Thriller': '#d4786c',
    'Kids & Family': '#8fb8a8',
    'Romance': '#c4a484',
    'Horror': '#d4786c',
    'Crime': '#e07b4c',
    'Anime': '#e07b4c',
    'Sci-Fi & Fantasy': '#5ba3c0',
    'Independent': '#7db88f',
    'Reality': '#c9a227',
    'Music & Musicals': '#9b8ec4',
};

const defaultColor = '#8a8a7a';

export default function GenreTrendChart({
    data,
    loading,
    selectedGenre,
}: GenreTrendChartProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Consolidate genres
        const consolidatedData = data.map(d => ({
            ...d,
            genre: getConsolidatedGenre(d.genre),
        }));

        // Count titles per genre per year
        const genreYearCounts = new Map<string, Map<number, number>>();

        consolidatedData.forEach((d) => {
            if (!genreYearCounts.has(d.genre)) {
                genreYearCounts.set(d.genre, new Map());
            }
            const yearCounts = genreYearCounts.get(d.genre)!;
            yearCounts.set(d.releaseYear, (yearCounts.get(d.releaseYear) || 0) + 1);
        });

        // Get top genres by total count
        const genreTotals = [...genreYearCounts.entries()]
            .map(([genre, years]) => ({
                genre,
                total: [...years.values()].reduce((a, b) => a + b, 0),
            }))
            .sort((a, b) => b.total - a.total);

        // If a genre is selected, show only that one, otherwise top 6
        // The selectedGenre is already a consolidated name from the bar chart
        let topGenres = selectedGenre
            ? genreTotals.filter(g => g.genre.toLowerCase() === selectedGenre.toLowerCase()).slice(0, 1)
            : genreTotals.slice(0, 6);

        // If no exact match found, try to find partial match
        if (selectedGenre && topGenres.length === 0) {
            topGenres = genreTotals.filter(g =>
                g.genre.toLowerCase().includes(selectedGenre.toLowerCase()) ||
                selectedGenre.toLowerCase().includes(g.genre.toLowerCase())
            ).slice(0, 1);
        }

        // Get year range
        const years = consolidatedData.map(d => d.releaseYear);
        const minYear = Math.max(Math.min(...years), 2000); // Start from 2000 for clarity
        const maxYear = Math.max(...years);

        // Build line data
        return topGenres.map(({ genre }) => {
            const yearCounts = genreYearCounts.get(genre)!;
            const lineData: { x: number; y: number }[] = [];

            for (let year = minYear; year <= maxYear; year++) {
                lineData.push({
                    x: year,
                    y: yearCounts.get(year) || 0,
                });
            }

            return {
                id: genre,
                color: genreColors[genre] || defaultColor,
                data: lineData,
            };
        });
    }, [data, selectedGenre]);

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#8a8a7a] text-sm">Loading trend data...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0 || chartData.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="text-[#8a8a7a]">No trend data available</div>
            </div>
        );
    }

    return (
        <div className="h-[400px]">
            <ResponsiveLine
                data={chartData}
                margin={{ top: 20, right: 20, bottom: selectedGenre ? 60 : 90, left: 60 }}
                xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 12,
                    tickRotation: 0,
                    legend: 'Year',
                    legendPosition: 'middle',
                    legendOffset: selectedGenre ? 45 : 35,
                    tickValues: 5,
                    format: (value) => String(Math.round(Number(value))),
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 12,
                    tickRotation: 0,
                    legend: 'Titles Added',
                    legendPosition: 'middle',
                    legendOffset: -50,
                    tickValues: 5,
                }}
                colors={(d) => d.color || defaultColor}
                pointSize={0}
                enableArea={true}
                areaOpacity={0.1}
                lineWidth={2}
                useMesh={true}
                enableSlices="x"
                sliceTooltip={({ slice }) => (
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-2xl">
                        <p className="text-[#f5f5f0] font-medium mb-2">
                            {slice.points[0].data.x}
                        </p>
                        <div className="space-y-1.5">
                            {[...slice.points]
                                .sort((a, b) => (b.data.y as number) - (a.data.y as number))
                                .map((point) => {
                                    const seriesData = chartData.find(s => s.id === point.seriesId);
                                    return (
                                        <div key={point.id} className="flex items-center gap-2 text-xs">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: seriesData?.color || point.color }}
                                            />
                                            <span className="text-[#b8b8a8] flex-1">{point.seriesId}</span>
                                            <span className="text-[#f5f5f0] font-medium">{point.data.yFormatted}</span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}
                theme={{
                    background: 'transparent',
                    text: {
                        fontSize: 11,
                        fill: '#b8b8a8',
                    },
                    axis: {
                        domain: {
                            line: {
                                stroke: '#2a2a2a',
                                strokeWidth: 1,
                            },
                        },
                        ticks: {
                            line: {
                                stroke: 'transparent',
                            },
                            text: {
                                fill: '#8a8a7a',
                                fontSize: 11,
                            },
                        },
                        legend: {
                            text: {
                                fill: '#b8b8a8',
                                fontSize: 12,
                                fontWeight: 500,
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: '#2a2a2a',
                            strokeWidth: 1,
                            strokeDasharray: '4 4',
                        },
                    },
                    crosshair: {
                        line: {
                            stroke: '#c9a227',
                            strokeWidth: 1,
                            strokeOpacity: 0.5,
                        },
                    },
                }}
                legends={selectedGenre ? [] : [
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 75,
                        itemsSpacing: 8,
                        itemDirection: 'left-to-right',
                        itemWidth: 140,
                        itemHeight: 16,
                        itemOpacity: 0.75,
                        symbolSize: 8,
                        symbolShape: 'circle',
                        itemTextColor: '#8a8a7a',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1,
                                    itemTextColor: '#f5f5f0',
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
}
