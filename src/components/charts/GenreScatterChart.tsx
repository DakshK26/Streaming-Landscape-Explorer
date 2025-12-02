'use client';

import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import type { ScatterDataPoint } from '@/types';
import { genreColors } from '@/components/filters/GenreFilter';

interface GenreScatterChartProps {
    data: ScatterDataPoint[];
    loading?: boolean;
    selectedGenre: string | null;
}

// Get unique genres and assign colors
function getGenreColor(genre: string): string {
    return genreColors[genre] || '#6366f1';
}

export default function GenreScatterChart({
    data,
    loading,
    selectedGenre,
}: GenreScatterChartProps) {
    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-[#a3a3a3]">Loading scatter data...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="text-[#a3a3a3]">No data available for scatter plot</div>
            </div>
        );
    }

    // Filter by selected genre if any
    const filteredData = selectedGenre
        ? data.filter((d) => d.genre === selectedGenre)
        : data;

    // Group data by genre for coloring
    const genres = [...new Set(filteredData.map((d) => d.genre))];

    // Limit genres to avoid clutter (top 10 by count)
    const genreCounts = new Map<string, number>();
    filteredData.forEach((d) => {
        genreCounts.set(d.genre, (genreCounts.get(d.genre) || 0) + 1);
    });

    const topGenres = [...genreCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, selectedGenre ? 1 : 10)
        .map(([genre]) => genre);

    // Transform data for Nivo scatter plot
    // X-axis: release year, Y-axis: duration (for movies) or number of seasons (for TV shows)
    const chartData = topGenres.map((genre) => ({
        id: genre,
        data: filteredData
            .filter((d) => d.genre === genre && d.duration !== null)
            .slice(0, 200) // Limit points per genre for performance
            .map((d) => ({
                x: d.releaseYear,
                y: d.duration as number,
                title: d.title,
                type: d.type,
                country: d.country,
            })),
    }));

    // Filter out empty series
    const validChartData = chartData.filter((series) => series.data.length > 0);

    if (validChartData.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="text-[#a3a3a3]">No data with duration information available</div>
            </div>
        );
    }

    // Determine if we're showing movies or tv shows primarily
    const movieCount = filteredData.filter((d) => d.type === 'Movie').length;
    const tvCount = filteredData.filter((d) => d.type === 'TV Show').length;
    const yAxisLabel = movieCount > tvCount ? 'Duration (minutes)' : 'Number of Seasons';

    return (
        <div className="h-[400px]">
            <ResponsiveScatterPlot
                data={validChartData}
                margin={{ top: 20, right: 140, bottom: 60, left: 70 }}
                xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                blendMode="multiply"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Release Year',
                    legendPosition: 'middle',
                    legendOffset: 45,
                    format: (value) => String(Math.round(Number(value))),
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yAxisLabel,
                    legendPosition: 'middle',
                    legendOffset: -55,
                }}
                colors={(node) => getGenreColor(node.serieId as string)}
                nodeSize={8}
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
                        <div
                            style={{
                                background: '#1a1a1a',
                                padding: '12px 16px',
                                border: '1px solid #2a2a2a',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                                maxWidth: '300px',
                            }}
                        >
                            <strong style={{ color: '#e5e5e5' }}>{pointData.title}</strong>
                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#a3a3a3' }}>
                                <div>
                                    <span style={{ color: node.color }}>●</span> {node.serieId}
                                </div>
                                <div>Year: {pointData.x}</div>
                                <div>
                                    {pointData.type === 'Movie' ? 'Duration' : 'Seasons'}: {pointData.y}
                                    {pointData.type === 'Movie' ? ' min' : ''}
                                </div>
                                <div>Country: {pointData.country}</div>
                                <div>Type: {pointData.type}</div>
                            </div>
                        </div>
                    );
                }}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 130,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 16,
                        itemsSpacing: 4,
                        itemDirection: 'left-to-right',
                        symbolSize: 10,
                        symbolShape: 'circle',
                        itemTextColor: '#a3a3a3',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#e5e5e5',
                                },
                            },
                        ],
                    },
                ]}
                theme={{
                    background: 'transparent',
                    text: {
                        fontSize: 11,
                        fill: '#a3a3a3',
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
                                stroke: '#2a2a2a',
                                strokeWidth: 1,
                            },
                            text: {
                                fill: '#a3a3a3',
                            },
                        },
                        legend: {
                            text: {
                                fill: '#e5e5e5',
                                fontSize: 12,
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: '#1a1a1a',
                            strokeWidth: 1,
                        },
                    },
                }}
            />
        </div>
    );
}
