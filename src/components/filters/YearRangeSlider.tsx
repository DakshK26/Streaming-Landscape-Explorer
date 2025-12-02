'use client';

import { useFilters } from '@/context/FilterContext';

interface YearRangeSliderProps {
  minYear: number;
  maxYear: number;
}

export default function YearRangeSlider({ minYear, maxYear }: YearRangeSliderProps) {
  const { filters, updateFilter } = useFilters();
  const [rangeMin, rangeMax] = filters.yearRange;

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
        <h3 className="text-sm font-medium text-[#a3a3a3]">Year Range</h3>
        <span className="text-sm text-[#e5e5e5]">
          {rangeMin} - {rangeMax}
        </span>
      </div>
      
      <div className="relative h-2 mt-6">
        {/* Track background */}
        <div className="absolute w-full h-2 bg-[#2a2a2a] rounded-full" />
        
        {/* Active range */}
        <div
          className="absolute h-2 bg-[#e50914] rounded-full"
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
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#e50914]
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#e50914]"
        />
        
        {/* Max slider */}
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={rangeMax}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#e50914]
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#e50914]"
        />
      </div>
      
      <div className="flex justify-between text-xs text-[#a3a3a3]">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}
