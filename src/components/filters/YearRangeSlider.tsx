'use client';

import { useEffect, useState } from 'react';
import { useFilters } from '@/context/FilterContext';

interface YearRangeSliderProps {
    minYear: number;
    maxYear: number;
}

export default function YearRangeSlider({ minYear, maxYear }: YearRangeSliderProps) {
    const { filters, updateFilter } = useFilters();
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize the filter with actual data range on first load
    useEffect(() => {
        if (!isInitialized && minYear && maxYear) {
            // Only set if using default 1900 value
            if (filters.yearRange[0] === 1900) {
                updateFilter('yearRange', [minYear, maxYear]);
            }
            setIsInitialized(true);
        }
    }, [minYear, maxYear, isInitialized, filters.yearRange, updateFilter]);

    const [rangeMin, rangeMax] = filters.yearRange[0] === 1900
        ? [minYear, maxYear]
        : filters.yearRange;

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value <= rangeMax) {
            updateFilter('yearRange', [value, rangeMax]);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= rangeMin) {
            updateFilter('yearRange', [rangeMin, value]);
        }
    };

    const percentage = (value: number) =>
        ((value - minYear) / (maxYear - minYear)) * 100;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#a1a1aa]">Year Range</h3>
                <span className="text-sm font-medium text-white tabular-nums">
                    {rangeMin} – {rangeMax}
                </span>
            </div>

            <div className="relative h-6 flex items-center">
                {/* Track background */}
                <div className="absolute w-full h-1.5 bg-[#27272a] rounded-full" />

                {/* Active range */}
                <div
                    className="absolute h-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] rounded-full"
                    style={{
                        left: `${percentage(rangeMin)}%`,
                        width: `${percentage(rangeMax) - percentage(rangeMin)}%`,
                    }}
                />

                {/* Min slider */}
                <input
                    type="range"
                    min={minYear}
                    max={maxYear}
                    value={rangeMin}
                    onChange={handleMinChange}
                    className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none cursor-pointer
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-[#8b5cf6]/30
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-[#8b5cf6]
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:pointer-events-auto
                        [&::-moz-range-thumb]:appearance-none
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:shadow-lg
                        [&::-moz-range-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:border-2
                        [&::-moz-range-thumb]:border-[#8b5cf6]"
                />

                {/* Max slider */}
                <input
                    type="range"
                    min={minYear}
                    max={maxYear}
                    value={rangeMax}
                    onChange={handleMaxChange}
                    className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none cursor-pointer
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-[#06b6d4]/30
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-[#06b6d4]
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:pointer-events-auto
                        [&::-moz-range-thumb]:appearance-none
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:shadow-lg
                        [&::-moz-range-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:border-2
                        [&::-moz-range-thumb]:border-[#06b6d4]"
                />
            </div>

            <div className="flex justify-between text-xs text-[#71717a]">
                <span>{minYear}</span>
                <span>{maxYear}</span>
            </div>
        </div>
    );
}
