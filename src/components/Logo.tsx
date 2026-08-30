export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#ff3b3b" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>
        <path d="M4 4 L20 16 L4 28 Z" fill="url(#logo-gradient)" />
        <path d="M14 4 L30 16 L14 28" stroke="url(#logo-gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-white">
        GRID<span className="text-red-500">.</span>
      </span>
    </span>
  );
}
