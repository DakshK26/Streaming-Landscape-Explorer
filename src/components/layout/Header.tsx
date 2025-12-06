'use client';

import { useFilters } from '@/context/FilterContext';

export default function Header() {
    const { resetFilters } = useFilters();

    return (
        <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="text-lg font-semibold text-white">
                            Streaming Landscape
                        </span>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={resetFilters}
                        className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-md border border-zinc-800 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </header>
    );
}
