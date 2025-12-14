'use client';

import { ResponsiveLine } from '@nivo/line';
import type { TimelineDataPoint } from '@/types';

interface ChartSerie {
    id: string;
    color: string;
    data: { x: number; y: number }[];
}

interface TimelineChartProps {
    data: TimelineDataPoint[];
    loading?: boolean;
}

export default function TimelineChart({ data, loading }: TimelineChartProps) {
    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#8a8a7a] text-sm">Loading timeline...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="text-[#8a8a7a]">No data available for the selected filters</div>
            </div>
        );
    }

    // Transform data for Nivo - using retro colors
    const chartData: ChartSerie[] = [
        {
            id: 'Movies',
            color: '#c9a227',
            data: data.map((d) => ({ x: d.year, y: d.movies })),
        },
        {
            id: 'TV Shows',
            color: '#e07b4c',
            data: data.map((d) => ({ x: d.year, y: d.tvShows })),
        },
    ];

    return (
        <div className="h-[400px]">
            <ResponsiveLine
                data={chartData}
                margin={{ top: 20, right: 110, bottom: 60, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 0,
                    max: 'auto',
                    stacked: false,
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Year',
                    legendOffset: 50,
                    legendPosition: 'middle',
                    tickValues: data
                        .filter((_, i) => i % Math.ceil(data.length / 15) === 0)
                        .map((d) => d.year),
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of Titles',
                    legendOffset: -50,
                    legendPosition: 'middle',
                }}
                colors={['#c9a227', '#e07b4c']}
                lineWidth={3}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                enableSlices="x"
                sliceTooltip={({ slice }) => (
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-2xl">
                        <p className="font-semibold text-[#f5f5f0] mb-2">
                            Year: {slice.points[0].data.xFormatted}
                        </p>
                        <div className="space-y-1">
                            {slice.points.map((point) => (
                                <div
                                    key={point.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: point.seriesColor }}
                                    />
                                    <span className="text-[#b8b8a8]">
                                        {point.seriesId}: <span className="text-[#f5f5f0] font-medium">{point.data.yFormatted}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 4,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.85,
                        symbolSize: 10,
                        symbolShape: 'circle',
                        itemTextColor: '#8a8a7a',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#f5f5f0',
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
                theme={{
                    background: 'transparent',
                    text: {
                        fontSize: 11,
                        fill: '#8a8a7a',
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
            />
        </div>
    );
}
