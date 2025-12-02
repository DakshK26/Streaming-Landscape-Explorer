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
        <div className="animate-pulse text-[#a3a3a3]">Loading timeline data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-[#a3a3a3]">No data available for the selected filters</div>
      </div>
    );
  }

  // Transform data for Nivo
  const chartData: ChartSerie[] = [
    {
      id: 'Movies',
      color: '#e50914',
      data: data.map((d) => ({ x: d.year, y: d.movies })),
    },
    {
      id: 'TV Shows',
      color: '#0ea5e9',
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
        colors={['#e50914', '#0ea5e9']}
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
          <div
            style={{
              background: '#1a1a1a',
              padding: '12px 16px',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            <strong style={{ color: '#e5e5e5' }}>
              Year: {slice.points[0].data.xFormatted}
            </strong>
            <div style={{ marginTop: '8px' }}>
              {slice.points.map((point) => (
                <div
                  key={point.id}
                  style={{
                    color: point.seriesColor,
                    padding: '3px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: point.seriesColor,
                      borderRadius: '50%',
                    }}
                  />
                  <span>
                    {point.seriesId}: <strong>{point.data.yFormatted}</strong>
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
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            itemTextColor: '#a3a3a3',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#e5e5e5',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        theme={{
          background: 'transparent',
          text: {
            fontSize: 12,
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
                fontSize: 13,
              },
            },
          },
          grid: {
            line: {
              stroke: '#1a1a1a',
              strokeWidth: 1,
            },
          },
          crosshair: {
            line: {
              stroke: '#e50914',
              strokeWidth: 1,
              strokeOpacity: 0.5,
            },
          },
        }}
      />
    </div>
  );
}
