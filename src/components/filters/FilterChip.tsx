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
        transition-all duration-200
        ${
          active
            ? 'bg-[#e50914] text-white border-[#e50914]'
            : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#2a2a2a] hover:bg-[#2a2a2a] hover:text-[#e5e5e5]'
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
            ${active ? 'bg-white/20' : 'bg-[#2a2a2a]'}
          `}
        >
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}
