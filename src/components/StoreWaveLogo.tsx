import React from 'react';

interface StoreWaveLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showBadge?: boolean;
}

export const StoreWaveLogo: React.FC<StoreWaveLogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'dark',
  className = '',
  showBadge = true
}) => {
  // Dimension presets
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  }[size];

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[size];

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs'
  }[size];

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subtextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Wave + Shopping Bag SVG Logo Mark */}
      <div className={`relative ${iconDimensions} shrink-0 group`}>
        {/* Ambient subtle glow backplane */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 opacity-60 blur-xs group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Core Logo Container */}
        <div className="relative w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-1 flex items-center justify-center border border-emerald-400/30 shadow-lg overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="storewave-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>

              <linearGradient id="storewave-wave-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>

              <filter id="storewave-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Bag Handle */}
            <path
              d="M38 32 C38 20, 62 20, 62 32"
              stroke="url(#storewave-teal-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Shopping Bag Modern Body */}
            <rect
              x="22"
              y="32"
              width="56"
              height="50"
              rx="12"
              fill="#0F172A"
              stroke="url(#storewave-teal-grad)"
              strokeWidth="4"
            />

            {/* Dynamic Wave 1 (Upper Wave crest) */}
            <path
              d="M26 52 Q 38 43, 50 52 T 74 52"
              stroke="url(#storewave-wave-grad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Dynamic Wave 2 (Lower Wave surge) */}
            <path
              d="M26 64 Q 38 55, 50 64 T 74 64"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Electric Spark / Pulse Star in Top Right of Bag */}
            <circle cx="68" cy="40" r="3.5" fill="#FBBF24" filter="url(#storewave-glow)" />
            <path
              d="M68 35 L68 45 M63 40 L73 40"
              stroke="#FEF08A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Typography Brandmark */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black ${titleSizes} tracking-tight ${textColor}`}>
              Store
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Wave
              </span>
            </span>
            {showBadge && (
              <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                LK
              </span>
            )}
          </div>
          <span className={`font-semibold ${subtitleSizes} ${subtextColor} tracking-tight mt-0.5`}>
            Cloud E-Commerce
          </span>
        </div>
      )}
    </div>
  );
};
