'use client';

import type { Insight } from '@/types';

interface InsightCardsProps {
    insights: Insight[];
    loading?: boolean;
}

const iconMap = {
    info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    trend: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    highlight: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    ),
};

const colorMap = {
    info: 'from-violet-500 to-violet-600',
    trend: 'from-emerald-500 to-emerald-600',
    highlight: 'from-cyan-500 to-cyan-600',
};

const bgColorMap = {
    info: 'bg-violet-500/10 border-violet-500/20',
    trend: 'bg-emerald-500/10 border-emerald-500/20',
    highlight: 'bg-cyan-500/10 border-cyan-500/20',
};

const textColorMap = {
    info: 'text-violet-400',
    trend: 'text-emerald-400',
    highlight: 'text-cyan-400',
};

export default function InsightCards({ insights, loading }: InsightCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-32 bg-zinc-900/50 rounded-xl border border-zinc-800/50 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!insights || insights.length === 0) {
        return (
            <div className="text-center py-8 text-zinc-500">
                No insights available for the current selection
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight) => (
                <div
                    key={insight.id}
                    className={`
            relative overflow-hidden rounded-xl border p-4 backdrop-blur-sm
            ${bgColorMap[insight.type]}
            transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
          `}
                >
                    {/* Icon */}
                    <div
                        className={`
              inline-flex items-center justify-center w-10 h-10 rounded-lg
              bg-gradient-to-br ${colorMap[insight.type]}
              text-white mb-3 shadow-lg
            `}
                    >
                        {iconMap[insight.type]}
                    </div>

                    {/* Content */}
                    <h3 className={`font-semibold ${textColorMap[insight.type]} mb-1`}>
                        {insight.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        {insight.description}
                    </p>

                    {/* Value badge */}
                    {insight.value !== undefined && (
                        <div className="mt-3">
                            <span
                                className={`
                  inline-block px-3 py-1 rounded-full text-xs font-medium
                  bg-gradient-to-r ${colorMap[insight.type]} text-white shadow-sm
                `}
                            >
                                {typeof insight.value === 'number'
                                    ? insight.value.toLocaleString()
                                    : insight.value}
                            </span>
                        </div>
                    )}

                    {/* Decorative gradient */}
                    <div
                        className={`
              absolute top-0 right-0 w-24 h-24 opacity-10
              bg-gradient-to-br ${colorMap[insight.type]}
              rounded-full -translate-y-1/2 translate-x-1/2
            `}
                    />
                </div>
            ))}
        </div>
    );
}
