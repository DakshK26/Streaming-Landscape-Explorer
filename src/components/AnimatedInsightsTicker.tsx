'use client';

import { useState, useEffect, useMemo, useRef, useCallback, type ReactNode } from 'react';
import type { SummaryData, TimelineDataPoint, GenreStats, CountryData } from '@/types';

interface AnimatedInsightsTickerProps {
    summary: SummaryData | null;
    timeline: TimelineDataPoint[];
    genres: GenreStats[];
    countries: CountryData[];
}

interface Insight {
    icon: ReactNode;
    label: string;
    value: string;
    color: string;
    borderColor: string;
}

const iconClass = "w-5 h-5 text-[#0f0f0f]";

const icons = {
    genre: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16M4 20V4l8 4 8-4v16" />
        </svg>
    ),
    trendUp: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    ),
    globe: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    clapperboard: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
            <path d="m6.2 5.3 3.1 3.9" />
            <path d="m12.4 3.4 3.1 4" />
            <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        </svg>
    ),
    calendar: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
        </svg>
    ),
    bolt: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    ),
    languages: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 8 6 6" />
            <path d="m4 14 6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" />
            <path d="M14 18h6" />
        </svg>
    ),
};

export default function AnimatedInsightsTicker({
    summary,
    timeline,
    genres,
    countries,
}: AnimatedInsightsTickerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progressKey, setProgressKey] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const insights = useMemo<Insight[]>(() => {
        const result: Insight[] = [];

        if (!summary) return result;

        if (genres.length > 0) {
            result.push({
                icon: icons.genre,
                label: 'Top Genre',
                value: genres[0].name,
                color: 'from-[#c9a227] to-[#b8922a]',
                borderColor: 'border-[#c9a227]/30',
            });
        }

        if (timeline.length > 0) {
            const peakYear = timeline.reduce((max, item) =>
                (item.movies + item.tvShows) > (max.movies + max.tvShows) ? item : max
            );
            result.push({
                icon: icons.trendUp,
                label: 'Peak Production Year',
                value: `${peakYear.year} with ${(peakYear.movies + peakYear.tvShows).toLocaleString()} titles`,
                color: 'from-[#e07b4c] to-[#d06a3c]',
                borderColor: 'border-[#e07b4c]/30',
            });
        }

        if (countries.length > 0) {
            result.push({
                icon: icons.globe,
                label: 'Top Producer',
                value: `${countries[0].country} (${countries[0].count.toLocaleString()} titles)`,
                color: 'from-[#7db88f] to-[#6aa87f]',
                borderColor: 'border-[#7db88f]/30',
            });
        }

        if (summary.totalMovies && summary.totalTVShows) {
            const ratio = (summary.totalMovies / summary.totalTVShows).toFixed(1);
            result.push({
                icon: icons.clapperboard,
                label: 'Movie to TV Ratio',
                value: `${ratio}:1`,
                color: 'from-[#d4786c] to-[#c4685c]',
                borderColor: 'border-[#d4786c]/30',
            });
        }

        if (summary.yearRange) {
            const span = summary.yearRange[1] - summary.yearRange[0];
            result.push({
                icon: icons.calendar,
                label: 'Catalog Spans',
                value: `${span} years (${summary.yearRange[0]} - ${summary.yearRange[1]})`,
                color: 'from-[#9b8ec4] to-[#8b7eb4]',
                borderColor: 'border-[#9b8ec4]/30',
            });
        }

        if (timeline.length > 0) {
            const recentYears = timeline.filter(t => t.year >= 2010);
            if (recentYears.length > 0) {
                const avgPerYear = Math.round(
                    recentYears.reduce((sum, t) => sum + t.movies + t.tvShows, 0) / recentYears.length
                );
                result.push({
                    icon: icons.bolt,
                    label: 'Avg Titles/Year (2010s+)',
                    value: avgPerYear.toLocaleString(),
                    color: 'from-[#5ba3c0] to-[#4b93b0]',
                    borderColor: 'border-[#5ba3c0]/30',
                });
            }
        }

        if (genres.length > 0) {
            const internationalGenre = genres.find(g =>
                g.name.toLowerCase().includes('international')
            );
            if (internationalGenre && summary.totalTitles) {
                const percentage = Math.round((internationalGenre.count / summary.totalTitles) * 100);
                result.push({
                    icon: icons.languages,
                    label: 'International Content',
                    value: `${percentage}% of catalog`,
                    color: 'from-[#c4a484] to-[#b49474]',
                    borderColor: 'border-[#c4a484]/30',
                });
            }
        }

        return result;
    }, [summary, timeline, genres, countries]);

    const goToInsight = useCallback((index: number) => {
        setCurrentIndex(index);
        setProgressKey(prev => prev + 1);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % insights.length);
            setProgressKey(prev => prev + 1);
        }, 5000);
    }, [insights.length]);

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

    const safeIndex = currentIndex % insights.length;
    const currentInsight = insights[safeIndex];

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-10">
            <div
                className={`absolute inset-0 bg-gradient-to-r ${currentInsight.color} opacity-10 blur-3xl rounded-full`}
                style={{ transition: 'background 0.8s ease-in-out' }}
            />

            <div className={`relative bg-[#1a1a1a]/90 backdrop-blur-xl border ${currentInsight.borderColor} rounded-xl p-1 overflow-hidden transition-all duration-500`}>
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

                <div className="flex items-center justify-between p-4">
                    <div className="flex-1 relative h-12 overflow-hidden">
                        {insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className="absolute inset-0 flex items-center gap-4"
                                style={{
                                    opacity: idx === safeIndex ? 1 : 0,
                                    transform: idx === safeIndex ? 'translateY(0)' : 'translateY(10px)',
                                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                                    pointerEvents: idx === safeIndex ? 'auto' : 'none',
                                }}
                            >
                                <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center shadow-lg`}
                                >
                                    {insight.icon}
                                </div>

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

                    <div className="flex items-center gap-2 ml-4">
                        {insights.map((insight, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToInsight(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === safeIndex
                                    ? `bg-gradient-to-r ${insight.color} scale-125`
                                    : 'bg-[#404040] hover:bg-[#5a5a5a]'
                                    }`}
                                aria-label={`Go to insight ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-[#5a5a4a] mt-3">
                Click dots to explore • Auto-rotates every 5s
            </p>
        </div>
    );
}
