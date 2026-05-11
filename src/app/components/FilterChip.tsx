interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, active = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-violet-400 to-indigo-400 text-white shadow-md shadow-violet-200'
          : 'bg-white text-slate-600 hover:bg-violet-50 border border-slate-200'
      }`}
    >
      {label}
    </button>
  );
}