'use client';

import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import type { ScatterDataPoint } from '@/types';

interface GenreScatterChartProps {
    data: ScatterDataPoint[];
    loading?: boolean;
    selectedGenre: string | null;
}

// Vibrant, distinct color palette for scatter plot
const scatterColors = [
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#ec4899', // pink
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#f97316', // orange
    '#84cc16', // lime
];

export default function GenreScatterChart({
    data,
    loading,
    selectedGenre,
}: GenreScatterChartProps) {
    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#71717a] text-sm">Loading scatter data...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="text-[#71717a]">No data available</div>
            </div>
        );
    }

    // Filter by selected genre if any
    const filteredData = selectedGenre
        ? data.filter((d) => d.genre === selectedGenre)
        : data;

    // Count genres and get top ones
    const genreCounts = new Map<string, number>();
    filteredData.forEach((d) => {
        genreCounts.set(d.genre, (genreCounts.get(d.genre) || 0) + 1);
    });

    const topGenres = [...genreCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, selectedGenre ? 1 : 8)
        .map(([genre]) => genre);

    // Transform data for Nivo scatter plot
    const chartData = topGenres.map((genre, index) => ({
        id: genre,
        data: filteredData
            .filter((d) => d.genre === genre && d.duration !== null)
            .slice(0, 150)
            .map((d) => ({
                x: d.releaseYear,
                y: d.duration as number,
                title: d.title,
                type: d.type,
                country: d.country,
            })),
        color: scatterColors[index % scatterColors.length],
    }));

    const validChartData = chartData.filter((series) => series.data.length > 0);

    if (validChartData.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="text-[#71717a]">No data with duration information</div>
            </div>
        );
    }

    const movieCount = filteredData.filter((d) => d.type === 'Movie').length;
    const tvCount = filteredData.filter((d) => d.type === 'TV Show').length;
    const yAxisLabel = movieCount > tvCount ? 'Duration (min)' : 'Seasons';

    return (
        <div className="h-[400px]">
            <ResponsiveScatterPlot
                data={validChartData}
                margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
                xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 12,
                    tickRotation: 0,
                    legend: 'Release Year',
                    legendPosition: 'middle',
                    legendOffset: 45,
                    format: (value) => String(Math.round(Number(value))),
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 12,
                    tickRotation: 0,
                    legend: yAxisLabel,
                    legendPosition: 'middle',
                    legendOffset: -55,
                }}
                colors={(node) => {
                    const series = validChartData.find(s => s.id === node.serieId);
                    return series?.color || '#8b5cf6';
                }}
                nodeSize={10}
                useMesh={true}
                tooltip={({ node }) => {
                    const pointData = node.data as {
                        x: number;
                        y: number;
                        title: string;
                        type: string;
                        country: string;
                    };
                    return (
                        <div className="bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 shadow-2xl max-w-xs">
                            <p className="font-semibold text-white text-sm mb-2 line-clamp-2">
                                {pointData.title}
                            </p>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <span 
                                        className="w-2.5 h-2.5 rounded-full" 
                                        style={{ backgroundColor: node.color }}
                                    />
                                    <span className="text-[#a1a1aa]">{node.serieId}</span>
                                </div>
                                <p className="text-[#71717a]">
                                    {pointData.x} · {pointData.y}{pointData.type === 'Movie' ? ' min' : ' seasons'}
                                </p>
                                <p className="text-[#71717a]">{pointData.country}</p>
                            </div>
                        </div>
                    );
                }}
                theme={{
                    background: 'transparent',
                    text: {
                        fontSize: 11,
                        fill: '#a1a1aa',
                    },
                    axis: {
                        domain: {
                            line: {
                                stroke: '#27272a',
                                strokeWidth: 1,
                            },
                        },
                        ticks: {
                            line: {
                                stroke: 'transparent',
                            },
                            text: {
                                fill: '#71717a',
                                fontSize: 11,
                            },
                        },
                        legend: {
                            text: {
                                fill: '#a1a1aa',
                                fontSize: 12,
                                fontWeight: 500,
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: '#27272a',
                            strokeWidth: 1,
                            strokeDasharray: '4 4',
                        },
                    },
                }}
            />
        </div>
    );
}
