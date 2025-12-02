'use client';

import React, { memo, useMemo, useState } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';
import { scaleLog } from 'd3-scale';
import { CountryData } from '@/types';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map our ISO codes to the topology's numeric IDs or names
const isoToName: Record<string, string[]> = {
    'USA': ['United States of America', 'United States'],
    'GBR': ['United Kingdom'],
    'IND': ['India'],
    'CAN': ['Canada'],
    'FRA': ['France'],
    'JPN': ['Japan'],
    'ESP': ['Spain'],
    'KOR': ['South Korea', 'Korea, Republic of'],
    'MEX': ['Mexico'],
    'AUS': ['Australia'],
    'DEU': ['Germany'],
    'CHN': ['China'],
    'BRA': ['Brazil'],
    'ITA': ['Italy'],
    'TUR': ['Turkey'],
    'HKG': ['Hong Kong'],
    'EGY': ['Egypt'],
    'THA': ['Thailand'],
    'TWN': ['Taiwan'],
    'NGA': ['Nigeria'],
    'ARG': ['Argentina'],
    'IDN': ['Indonesia'],
    'PHL': ['Philippines'],
    'BEL': ['Belgium'],
    'NOR': ['Norway'],
    'POL': ['Poland'],
    'DNK': ['Denmark'],
    'SWE': ['Sweden'],
    'NLD': ['Netherlands'],
    'CHE': ['Switzerland'],
    'IRL': ['Ireland'],
    'NZL': ['New Zealand'],
    'ZAF': ['South Africa'],
    'RUS': ['Russia', 'Russian Federation'],
    'SGP': ['Singapore'],
    'MYS': ['Malaysia'],
    'ISR': ['Israel'],
    'PAK': ['Pakistan'],
    'COL': ['Colombia'],
    'CHL': ['Chile'],
    'PER': ['Peru'],
    'ARE': ['United Arab Emirates'],
    'SAU': ['Saudi Arabia'],
    'PRT': ['Portugal'],
    'GRC': ['Greece'],
    'CZE': ['Czech Republic', 'Czechia'],
    'AUT': ['Austria'],
    'ROU': ['Romania'],
    'HUN': ['Hungary'],
    'FIN': ['Finland'],
    'VNM': ['Vietnam', 'Viet Nam'],
    'UKR': ['Ukraine'],
    'KEN': ['Kenya'],
    'GHA': ['Ghana'],
    'MAR': ['Morocco'],
    'LBN': ['Lebanon'],
    'JOR': ['Jordan'],
    'KWT': ['Kuwait'],
    'QAT': ['Qatar'],
    'BGD': ['Bangladesh'],
    'LKA': ['Sri Lanka'],
    'NPL': ['Nepal'],
    'ISL': ['Iceland'],
    'LUX': ['Luxembourg'],
    'MLT': ['Malta'],
    'CYP': ['Cyprus'],
    'HRV': ['Croatia'],
    'SRB': ['Serbia'],
    'BGR': ['Bulgaria'],
    'SVK': ['Slovakia'],
    'SVN': ['Slovenia'],
    'EST': ['Estonia'],
    'LVA': ['Latvia'],
    'LTU': ['Lithuania'],
    'URY': ['Uruguay'],
    'VEN': ['Venezuela'],
    'ECU': ['Ecuador'],
    'BOL': ['Bolivia'],
    'PRY': ['Paraguay'],
    'CUB': ['Cuba'],
    'JAM': ['Jamaica'],
    'PRI': ['Puerto Rico'],
    'DOM': ['Dominican Republic'],
    'GTM': ['Guatemala'],
    'PAN': ['Panama'],
    'CRI': ['Costa Rica'],
};

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
        movies: number;
        tvShows: number;
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

    // Create lookup map from country name to data
    const dataByName = useMemo(() => {
        const map = new Map<string, CountryData>();
        
        // First, add all reverse mappings from isoToName
        Object.entries(isoToName).forEach(([iso, names]) => {
            const countryData = data.find(d => d.iso === iso);
            if (countryData) {
                names.forEach(name => {
                    map.set(name.toLowerCase(), countryData);
                });
            }
        });
        
        // Then add by country name directly from data
        data.forEach((item) => {
            // Add by country name (lowercase for matching)
            map.set(item.country.toLowerCase(), item);
            
            // Also add some common variations
            const variations: string[] = [];
            
            // Handle country name variations
            if (item.country === 'United States') {
                variations.push('united states of america');
            }
            if (item.country === 'United Kingdom') {
                variations.push('great britain', 'britain');
            }
            if (item.country === 'South Korea') {
                variations.push('korea, republic of', 'republic of korea', 'korea');
            }
            if (item.country === 'Russia') {
                variations.push('russian federation');
            }
            if (item.country === 'Czech Republic') {
                variations.push('czechia');
            }
            if (item.country === 'Vietnam') {
                variations.push('viet nam');
            }
            
            variations.forEach(v => map.set(v, item));
        });
        
        return map;
    }, [data]);

    // Calculate max value for color scale (use log scale for better distribution)
    const maxCount = useMemo(() => {
        if (data.length === 0) return 100;
        return Math.max(...data.map((d) => d.count));
    }, [data]);

    // Purple-cyan gradient color scale using log scale for better distribution
    const colorScale = useMemo(() => {
        return scaleLog<string>()
            .domain([1, maxCount])
            .range(['#1e1b4b', '#06b6d4'])
            .clamp(true);
    }, [maxCount]);

    const findCountryData = (geoName: string): CountryData | undefined => {
        const normalized = geoName.toLowerCase();
        return dataByName.get(normalized);
    };

    const handleMouseEnter = (
        event: React.MouseEvent,
        geoName: string,
        countryData: CountryData | undefined
    ) => {
        setTooltip({
            show: true,
            x: event.clientX,
            y: event.clientY,
            content: {
                name: geoName,
                count: countryData?.count || 0,
                movies: countryData?.movieCount || 0,
                tvShows: countryData?.tvShowCount || 0,
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
                    <div className="w-12 h-12 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#a1a1aa]">Loading map data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[500px] rounded-xl overflow-hidden bg-[#0c0c0f]" onMouseMove={handleMouseMove}>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 140,
                    center: [10, 20],
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <ZoomableGroup zoom={1} minZoom={1} maxZoom={8}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const geoName = geo.properties.name || '';
                                const countryData = findCountryData(geoName);
                                const count = countryData?.count || 0;
                                const isSelected = selectedCountry === countryData?.country;

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={(e) => handleMouseEnter(e, geoName, countryData)}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => {
                                            if (onCountryClick && countryData) {
                                                onCountryClick(isSelected ? null : countryData);
                                            }
                                        }}
                                        style={{
                                            default: {
                                                fill: count > 0 ? colorScale(count) : '#18181b',
                                                stroke: isSelected ? '#8b5cf6' : '#27272a',
                                                strokeWidth: isSelected ? 1.5 : 0.3,
                                                outline: 'none',
                                                cursor: countryData ? 'pointer' : 'default',
                                            },
                                            hover: {
                                                fill: count > 0 ? '#8b5cf6' : '#27272a',
                                                stroke: '#a78bfa',
                                                strokeWidth: 1,
                                                outline: 'none',
                                                cursor: countryData ? 'pointer' : 'default',
                                            },
                                            pressed: {
                                                fill: '#7c3aed',
                                                stroke: '#a78bfa',
                                                strokeWidth: 1.5,
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
                    className="fixed z-50 px-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl pointer-events-none"
                    style={{
                        left: tooltip.x + 15,
                        top: tooltip.y - 50,
                    }}
                >
                    <p className="font-semibold text-white mb-1">{tooltip.content.name}</p>
                    {tooltip.content.count > 0 ? (
                        <div className="text-sm space-y-0.5">
                            <p className="text-[#a1a1aa]">
                                <span className="text-[#8b5cf6] font-medium">{tooltip.content.count.toLocaleString()}</span> titles
                            </p>
                            <p className="text-[#71717a]">
                                {tooltip.content.movies} movies · {tooltip.content.tvShows} TV shows
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-[#71717a]">No data</p>
                    )}
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-[#18181b]/95 border border-[#27272a] rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs font-medium text-[#a1a1aa] mb-2">Content Volume</p>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#71717a]">1</span>
                    <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="w-6" style={{ background: '#1e1b4b' }} />
                        <div className="w-6" style={{ background: '#312e81' }} />
                        <div className="w-6" style={{ background: '#4338ca' }} />
                        <div className="w-6" style={{ background: '#6366f1' }} />
                        <div className="w-6" style={{ background: '#8b5cf6' }} />
                        <div className="w-6" style={{ background: '#06b6d4' }} />
                    </div>
                    <span className="text-[10px] text-[#71717a]">{maxCount.toLocaleString()}</span>
                </div>
            </div>

            {/* Controls hint */}
            <div className="absolute top-4 right-4 bg-[#18181b]/95 border border-[#27272a] rounded-lg px-3 py-2 backdrop-blur-sm">
                <p className="text-[10px] text-[#71717a]">
                    Scroll to zoom · Drag to pan
                </p>
            </div>
        </div>
    );
}

export default memo(ChoroplethMap);
