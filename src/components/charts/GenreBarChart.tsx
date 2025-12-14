'use client';

import { ResponsiveBar } from '@nivo/bar';
import type { GenreStats } from '@/types';

interface GenreBarChartProps {
    data: GenreStats[];
    loading?: boolean;
    selectedGenre: string | null;
    onGenreClick: (genre: string) => void;
}

export default function GenreBarChart({
    data,
    loading,
    selectedGenre,
    onGenreClick,
}: GenreBarChartProps) {
    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-[#8a8a7a]">Loading genre data...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="text-[#8a8a7a]">No genre data available</div>
            </div>
        );
    }

    // Take top 15 genres for visibility
    const topGenres = data.slice(0, 15);

    // Transform for Nivo with stacked bars for movies vs tv shows
    const chartData = topGenres.map((genre) => ({
        genre: genre.name.length > 20 ? genre.name.substring(0, 18) + '...' : genre.name,
        fullName: genre.name,
        Movies: genre.movieCount,
        'TV Shows': genre.tvShowCount,
        total: genre.count,
    }));

    return (
        <div className="h-[400px]">
            <ResponsiveBar
                data={chartData}
                keys={['Movies', 'TV Shows']}
                indexBy="genre"
                margin={{ top: 20, right: 130, bottom: 60, left: 140 }}
                padding={0.3}
                layout="horizontal"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={['#c9a227', '#e07b4c']}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 8,
                    tickRotation: 0,
                    legend: 'Number of Titles',
                    legendPosition: 'middle',
                    legendOffset: 45,
                    format: (value) => value >= 1000 ? `${(Number(value) / 1000).toFixed(1)}k` : String(value),
                    tickValues: 5,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                enableGridX={true}
                enableGridY={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#0f0f0f"
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 4,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 12,
                        itemTextColor: '#b8b8a8',
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
                onClick={(bar) => {
                    const fullName = (bar.data as { fullName: string }).fullName;
                    onGenreClick(fullName);
                }}
                tooltip={({ id, value, data: barData }) => (
                    <div
                        style={{
                            background: 'rgba(26, 26, 26, 0.95)',
                            padding: '12px 16px',
                            border: '1px solid rgba(42, 42, 42, 0.8)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <strong style={{ color: '#f5f5f0' }}>
                            {(barData as { fullName: string }).fullName}
                        </strong>
                        <div style={{ marginTop: '8px', color: id === 'Movies' ? '#c9a227' : '#e07b4c' }}>
                            {id}: <strong>{value}</strong>
                        </div>
                        <div style={{ color: '#b8b8a8', marginTop: '4px' }}>
                            Total: {(barData as { total: number }).total} titles
                        </div>
                        <div style={{ color: '#8a8a7a', marginTop: '8px', fontSize: '12px' }}>
                            Click to filter
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
                                stroke: '#333333',
                                strokeWidth: 1,
                            },
                        },
                        ticks: {
                            line: {
                                stroke: '#333333',
                                strokeWidth: 1,
                            },
                            text: {
                                fill: '#b8b8a8',
                            },
                        },
                        legend: {
                            text: {
                                fill: '#f5f5f0',
                                fontSize: 12,
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: '#2a2a2a',
                            strokeWidth: 1,
                        },
                    },
                }}
                motionConfig="gentle"
                role="application"
                ariaLabel="Genre distribution bar chart"
                barAriaLabel={(e) =>
                    `${e.id}: ${e.value} in genre ${e.indexValue}`
                }
            />
        </div>
    );
}
