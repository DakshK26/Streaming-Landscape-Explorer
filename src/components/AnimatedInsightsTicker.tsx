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
    borderColor: string;
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

    // Generate insights from the data - with retro color palette
    const insights = useMemo<Insight[]>(() => {
        const result: Insight[] = [];

        if (!summary) return result;

        // Top genre
        if (genres.length > 0) {
            result.push({
                icon: '🎭',
                label: 'Top Genre',
                value: genres[0].name,
                color: 'from-[#c9a227] to-[#b8922a]',
                borderColor: 'border-[#c9a227]/30',
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
                color: 'from-[#e07b4c] to-[#d06a3c]',
                borderColor: 'border-[#e07b4c]/30',
            });
        }

        // Top producing country
        if (countries.length > 0) {
            result.push({
                icon: '🌍',
                label: 'Top Producer',
                value: `${countries[0].country} (${countries[0].count.toLocaleString()} titles)`,
                color: 'from-[#7db88f] to-[#6aa87f]',
                borderColor: 'border-[#7db88f]/30',
            });
        }

        // Movie vs TV ratio
        if (summary.totalMovies && summary.totalTVShows) {
            const ratio = (summary.totalMovies / summary.totalTVShows).toFixed(1);
            result.push({
                icon: '🎬',
                label: 'Movie to TV Ratio',
                value: `${ratio}:1`,
                color: 'from-[#d4786c] to-[#c4685c]',
                borderColor: 'border-[#d4786c]/30',
            });
        }

        // Catalog span
        if (summary.yearRange) {
            const span = summary.yearRange[1] - summary.yearRange[0];
            result.push({
                icon: '📅',
                label: 'Catalog Spans',
                value: `${span} years (${summary.yearRange[0]} - ${summary.yearRange[1]})`,
                color: 'from-[#9b8ec4] to-[#8b7eb4]',
                borderColor: 'border-[#9b8ec4]/30',
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
                    color: 'from-[#5ba3c0] to-[#4b93b0]',
                    borderColor: 'border-[#5ba3c0]/30',
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
                    color: 'from-[#c4a484] to-[#b49474]',
                    borderColor: 'border-[#c4a484]/30',
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
            {/* Subtle glow effect */}
            <div
                className={`absolute inset-0 bg-gradient-to-r ${currentInsight.color} opacity-10 blur-3xl rounded-full`}
                style={{ transition: 'background 0.8s ease-in-out' }}
            />

            {/* Main container - retro style */}
            <div className={`relative bg-[#1a1a1a]/90 backdrop-blur-xl border ${currentInsight.borderColor} rounded-xl p-1 overflow-hidden transition-all duration-500`}>
                {/* Progress bar - using key to restart animation */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#252525] rounded-t-xl overflow-hidden">
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
                                    className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center text-2xl shadow-lg`}
                                >
                                    {insight.icon}
                                </div>

                                {/* Text content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-[#8a8a7a] uppercase tracking-wider">
                                        {insight.label}
                                    </p>
                                    <p className="text-lg font-medium text-[#f5f5f0] truncate">
                                        {insight.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation dots */}
                    <div className="flex items-center gap-2 ml-4">
                        {insights.map((insight, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToInsight(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? `bg-gradient-to-r ${insight.color} scale-125`
                                    : 'bg-[#404040] hover:bg-[#5a5a5a]'
                                    }`}
                                aria-label={`Go to insight ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-xs text-[#5a5a4a] mt-3">
                Click dots to explore • Auto-rotates every 5s
            </p>
        </div>
    );
}
