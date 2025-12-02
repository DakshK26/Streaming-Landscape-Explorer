'use client';

interface FilterChipProps {
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
    color?: string;
}

export default function FilterChip({
    label,
    active,
    onClick,
    count,
    color,
}: FilterChipProps) {
    return (
        <button
            onClick={onClick}
            className={`
        inline-flex items-center gap-2 px-3 py-1.5
        rounded-full text-sm font-medium
        transition-all duration-300
        ${active
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-violet-500/50 shadow-lg shadow-violet-500/20'
                    : 'bg-zinc-900/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800/70 hover:text-zinc-200 hover:border-zinc-600/50'
                }
        border cursor-pointer
      `}
            style={active && color ? { backgroundColor: color, borderColor: color } : undefined}
        >
            <span>{label}</span>
            {count !== undefined && (
                <span
                    className={`
            text-xs px-1.5 py-0.5 rounded-full
            ${active ? 'bg-white/20' : 'bg-zinc-800'}
          `}
                >
                    {count.toLocaleString()}
                </span>
            )}
        </button>
    );
}
