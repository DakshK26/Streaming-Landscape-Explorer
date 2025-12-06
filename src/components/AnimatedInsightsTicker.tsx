'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { SummaryData, TimelineDataPoint, GenreStats, CountryData } from '@/types';

interface AnimatedInsightsTickerProps {
    summary: SummaryData | null;
    timeline: TimelineDataPoint[];
    genres: GenreStats[];
    countries: CountryData[];
}

interface Insight {
    label: string;
    value: string;
}

export default function AnimatedInsightsTicker({
    summary,
    timeline,
    genres,
    countries,
}: AnimatedInsightsTickerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Generate insights from the data
    const insights = useMemo<Insight[]>(() => {
        const result: Insight[] = [];

        if (!summary) return result;

        // Top genre
        if (genres.length > 0) {
            result.push({
                label: 'Top Genre',
                value: genres[0].name,
            });
        }

        // Peak year
        if (timeline.length > 0) {
            const peakYear = timeline.reduce((max, item) =>
                (item.movies + item.tvShows) > (max.movies + max.tvShows) ? item : max
            );
            result.push({
                label: 'Peak Year',
                value: `${peakYear.year}`,
            });
        }

        // Top producing country
        if (countries.length > 0) {
            result.push({
                label: 'Top Country',
                value: countries[0].country,
            });
        }

        // Movie vs TV ratio
        if (summary.totalMovies && summary.totalTVShows) {
            const ratio = (summary.totalMovies / summary.totalTVShows).toFixed(1);
            result.push({
                label: 'Movie:TV Ratio',
                value: `${ratio}:1`,
            });
        }

        // Catalog span
        if (summary.yearRange) {
            const span = summary.yearRange[1] - summary.yearRange[0];
            result.push({
                label: 'Year Span',
                value: `${span} years`,
            });
        }

        return result;
    }, [summary, timeline, genres, countries]);

    // Navigate to specific insight
    const goToInsight = useCallback((index: number) => {
        setCurrentIndex(index);

        // Reset the auto-rotate timer
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % insights.length);
        }, 4000);
    }, [insights.length]);

    // Auto-rotate insights
    useEffect(() => {
        if (insights.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % insights.length);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [insights.length]);

    if (insights.length === 0) {
        return null;
    }

    const currentInsight = insights[currentIndex];

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            {/* Simple container */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4">
                <div className="flex items-center justify-between">
                    {/* Insight text */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            {currentInsight.label}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-sm font-medium text-white">
                            {currentInsight.value}
                        </span>
                    </div>

                    {/* Navigation dots */}
                    <div className="flex items-center gap-1.5">
                        {insights.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToInsight(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                    idx === currentIndex
                                        ? 'bg-zinc-400'
                                        : 'bg-zinc-700 hover:bg-zinc-600'
                                }`}
                                aria-label={`Go to insight ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
