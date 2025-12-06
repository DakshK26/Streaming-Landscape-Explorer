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
    icon: string;
    label: string;
    value: string;
    color: string;
}

export default function AnimatedInsightsTicker({
    summary,
    timeline,
    genres,
    countries,
}: AnimatedInsightsTickerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progressKey, setProgressKey] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Generate insights from the data
    const insights = useMemo<Insight[]>(() => {
        const result: Insight[] = [];

        if (!summary) return result;

        // Top genre
        if (genres.length > 0) {
            result.push({
                icon: '🎭',
                label: 'Top Genre',
                value: genres[0].name,
                color: 'from-violet-500 to-purple-500',
            });
        }

        // Peak year
        if (timeline.length > 0) {
            const peakYear = timeline.reduce((max, item) =>
                (item.movies + item.tvShows) > (max.movies + max.tvShows) ? item : max
            );
            result.push({
                icon: '📈',
                label: 'Peak Production Year',
                value: `${peakYear.year} with ${(peakYear.movies + peakYear.tvShows).toLocaleString()} titles`,
                color: 'from-cyan-500 to-blue-500',
            });
        }

        // Top producing country
        if (countries.length > 0) {
            result.push({
                icon: '🌍',
                label: 'Top Producer',
                value: `${countries[0].country} (${countries[0].count.toLocaleString()} titles)`,
                color: 'from-emerald-500 to-teal-500',
            });
        }

        // Movie vs TV ratio
        if (summary.totalMovies && summary.totalTVShows) {
            const ratio = (summary.totalMovies / summary.totalTVShows).toFixed(1);
            result.push({
                icon: '🎬',
                label: 'Movie to TV Ratio',
                value: `${ratio}:1`,
                color: 'from-orange-500 to-amber-500',
            });
        }

        // Catalog span
        if (summary.yearRange) {
            const span = summary.yearRange[1] - summary.yearRange[0];
            result.push({
                icon: '📅',
                label: 'Catalog Spans',
                value: `${span} years (${summary.yearRange[0]} - ${summary.yearRange[1]})`,
                color: 'from-pink-500 to-rose-500',
            });
        }

        // Average titles per year (recent decade)
        if (timeline.length > 0) {
            const recentYears = timeline.filter(t => t.year >= 2010);
            if (recentYears.length > 0) {
                const avgPerYear = Math.round(
                    recentYears.reduce((sum, t) => sum + t.movies + t.tvShows, 0) / recentYears.length
                );
                result.push({
                    icon: '⚡',
                    label: 'Avg Titles/Year (2010s+)',
                    value: avgPerYear.toLocaleString(),
                    color: 'from-indigo-500 to-violet-500',
                });
            }
        }

        // International content percentage
        if (genres.length > 0) {
            const internationalGenre = genres.find(g =>
                g.name.toLowerCase().includes('international')
            );
            if (internationalGenre && summary.totalTitles) {
                const percentage = Math.round((internationalGenre.count / summary.totalTitles) * 100);
                result.push({
                    icon: '🌐',
                    label: 'International Content',
                    value: `${percentage}% of catalog`,
                    color: 'from-teal-500 to-cyan-500',
                });
            }
        }

        return result;
    }, [summary, timeline, genres, countries]);

    // Navigate to specific insight
    const goToInsight = useCallback((index: number) => {
        setCurrentIndex(index);
        setProgressKey(prev => prev + 1);

        // Reset the auto-rotate timer
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % insights.length);
            setProgressKey(prev => prev + 1);
        }, 5000);
    }, [insights.length]);

    // Auto-rotate insights with smooth transitions
    useEffect(() => {
        if (insights.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % insights.length);
            setProgressKey(prev => prev + 1);
        }, 5000);

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
        <div className="relative w-full max-w-2xl mx-auto mb-10">
            {/* Glowing background effect */}
            <div
                className={`absolute inset-0 bg-gradient-to-r ${currentInsight.color} opacity-20 blur-2xl rounded-full`}
                style={{ transition: 'background 0.8s ease-in-out' }}
            />

            {/* Main container */}
            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-1 overflow-hidden">
                {/* Progress bar - using key to restart animation */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800 rounded-t-2xl overflow-hidden">
                    <div
                        key={progressKey}
                        className={`h-full bg-gradient-to-r ${currentInsight.color}`}
                        style={{
                            animation: 'progress 5s linear forwards',
                            width: '0%',
                        }}
                    />
                </div>

                {/* Content with crossfade effect */}
                <div className="flex items-center justify-between p-4">
                    {/* Insight carousel */}
                    <div className="flex-1 relative h-12 overflow-hidden">
                        {insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className="absolute inset-0 flex items-center gap-4"
                                style={{
                                    opacity: idx === currentIndex ? 1 : 0,
                                    transform: idx === currentIndex ? 'translateY(0)' : 'translateY(10px)',
                                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                                    pointerEvents: idx === currentIndex ? 'auto' : 'none',
                                }}
                            >
                                {/* Icon with gradient background */}
                                <div
                                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center text-2xl shadow-lg`}
                                >
                                    {insight.icon}
                                </div>

                                {/* Text content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        {insight.label}
                                    </p>
                                    <p className="text-lg font-semibold text-white truncate">
                                        {insight.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation dots */}
                    <div className="flex items-center gap-1.5 ml-4">
                        {insights.map((insight, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToInsight(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? `bg-gradient-to-r ${insight.color} scale-125`
                                    : 'bg-zinc-700 hover:bg-zinc-600'
                                    }`}
                                aria-label={`Go to insight ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Decorative corner accents - pointer-events-none so they don't block clicks */}
                <div
                    className={`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${currentInsight.color} opacity-10 rounded-tl-2xl pointer-events-none`}
                    style={{ transition: 'background 0.5s ease-in-out' }}
                />
                <div
                    className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${currentInsight.color} opacity-10 rounded-br-2xl pointer-events-none`}
                    style={{ transition: 'background 0.5s ease-in-out' }}
                />
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-xs text-zinc-600 mt-3">
                Click dots to explore • Auto-rotates every 5s
            </p>
        </div>
    );
}
