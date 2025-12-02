'use client';

import React, { memo, useMemo, useState } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { CountryData } from '@/types';

// Using Natural Earth 110m world topology
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface ChoroplethMapProps {
    data: CountryData[];
    loading: boolean;
    onCountryClick?: (country: CountryData | null) => void;
    selectedCountry?: string | null;
}

interface TooltipState {
    show: boolean;
    x: number;
    y: number;
    content: {
        name: string;
        count: number;
    } | null;
}

function ChoroplethMap({
    data,
    loading,
    onCountryClick,
    selectedCountry,
}: ChoroplethMapProps) {
    const [tooltip, setTooltip] = useState<TooltipState>({
        show: false,
        x: 0,
        y: 0,
        content: null,
    });

    // Create lookup map from ISO code to data
    const dataByIso = useMemo(() => {
        const map = new Map<string, CountryData>();
        data.forEach((item) => {
            if (item.iso) {
                map.set(item.iso, item);
            }
        });
        return map;
    }, [data]);

    // Calculate max value for color scale
    const maxCount = useMemo(() => {
        if (data.length === 0) return 100;
        return Math.max(...data.map((d) => d.count));
    }, [data]);

    // Netflix-inspired color scale (dark to bright red)
    const colorScale = useMemo(() => {
        return scaleQuantize<string>()
            .domain([0, maxCount])
            .range([
                '#2a0f0f', // darkest
                '#4a1a1a',
                '#6b2525',
                '#8c3030',
                '#ad3b3b',
                '#ce4646',
                '#e50914', // Netflix red
                '#ff4444', // brightest
            ]);
    }, [maxCount]);

    const handleMouseEnter = (
        event: React.MouseEvent,
        geo: { properties: { name: string } },
        countryData: CountryData | undefined
    ) => {
        const { clientX, clientY } = event;
        setTooltip({
            show: true,
            x: clientX,
            y: clientY,
            content: {
                name: geo.properties.name,
                count: countryData?.count || 0,
            },
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ show: false, x: 0, y: 0, content: null });
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (tooltip.show) {
            setTooltip((prev) => ({
                ...prev,
                x: event.clientX,
                y: event.clientY,
            }));
        }
    };

    if (loading) {
        return (
            <div className="h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#a3a3a3]">Loading map data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[500px]" onMouseMove={handleMouseMove}>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 120,
                    center: [0, 30],
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <ZoomableGroup zoom={1} minZoom={1} maxZoom={6}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                // Try to find country data by ISO code
                                const isoA3 = geo.properties.ISO_A3 || geo.id;
                                const isoA2 = geo.properties.ISO_A2;
                                const countryData = dataByIso.get(isoA3) || dataByIso.get(isoA2);
                                const count = countryData?.count || 0;
                                const isSelected =
                                    selectedCountry &&
                                    (countryData?.country === selectedCountry ||
                                        countryData?.iso === selectedCountry);

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={(e) => handleMouseEnter(e, geo, countryData)}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => {
                                            if (onCountryClick && countryData) {
                                                onCountryClick(isSelected ? null : countryData);
                                            }
                                        }}
                                        style={{
                                            default: {
                                                fill: count > 0 ? colorScale(count) : '#1a1a1a',
                                                stroke: isSelected ? '#ffffff' : '#333333',
                                                strokeWidth: isSelected ? 2 : 0.5,
                                                outline: 'none',
                                                cursor: countryData ? 'pointer' : 'default',
                                            },
                                            hover: {
                                                fill: count > 0 ? '#ff6666' : '#2a2a2a',
                                                stroke: '#ffffff',
                                                strokeWidth: 1,
                                                outline: 'none',
                                                cursor: countryData ? 'pointer' : 'default',
                                            },
                                            pressed: {
                                                fill: '#e50914',
                                                stroke: '#ffffff',
                                                strokeWidth: 2,
                                                outline: 'none',
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {tooltip.show && tooltip.content && (
                <div
                    className="fixed z-50 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl pointer-events-none"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y - 40,
                    }}
                >
                    <p className="font-semibold text-[#e5e5e5]">{tooltip.content.name}</p>
                    <p className="text-sm text-[#a3a3a3]">
                        {tooltip.content.count > 0
                            ? `${tooltip.content.count.toLocaleString()} titles`
                            : 'No data'}
                    </p>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-[#1a1a1a]/90 border border-[#333] rounded-lg p-4">
                <p className="text-sm font-semibold text-[#e5e5e5] mb-2">Titles by Country</p>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-[#a3a3a3]">0</span>
                    <div className="flex">
                        {['#2a0f0f', '#4a1a1a', '#6b2525', '#8c3030', '#ad3b3b', '#ce4646', '#e50914', '#ff4444'].map(
                            (color, i) => (
                                <div
                                    key={i}
                                    className="w-5 h-4"
                                    style={{ backgroundColor: color }}
                                />
                            )
                        )}
                    </div>
                    <span className="text-xs text-[#a3a3a3]">{maxCount.toLocaleString()}</span>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-[#1a1a1a]/90 border border-[#333] rounded-lg px-3 py-2">
                <p className="text-xs text-[#a3a3a3]">
                    🔍 Scroll to zoom • Drag to pan • Click to filter
                </p>
            </div>
        </div>
    );
}

export default memo(ChoroplethMap);
