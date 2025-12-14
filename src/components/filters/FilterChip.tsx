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
                    ? 'text-[#0f0f0f] shadow-lg'
                    : 'bg-[#1a1a1a]/50 text-[#b8b8a8] border-[#2a2a2a] hover:bg-[#252525]/70 hover:text-[#f5f5f0] hover:border-[#404040]'
                }
        border cursor-pointer
      `}
            style={active && color 
                ? { 
                    backgroundColor: color, 
                    borderColor: color,
                    boxShadow: `0 4px 12px ${color}33`
                } 
                : active 
                    ? { 
                        backgroundColor: '#c9a227', 
                        borderColor: '#c9a227',
                        boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)'
                    }
                    : undefined
            }
        >
            <span>{label}</span>
            {count !== undefined && (
                <span
                    className={`
            text-xs px-1.5 py-0.5 rounded-full
            ${active ? 'bg-black/20' : 'bg-[#252525]'}
          `}
                >
                    {count.toLocaleString()}
                </span>
            )}
        </button>
    );
}
