import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-9', showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 p-1.5 border border-cyan-300/40">
        {/* Stylized APK Android Store badge icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-slate-950">
          <path
            d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          <path
            d="M12 5L6 8.5V15.5L12 19L18 15.5V8.5L12 5Z"
            fill="#06b6d4"
          />
          <path
            d="M12 7.5L8.5 9.5V14.5L12 16.5L15.5 14.5V9.5L12 7.5Z"
            fill="#ffffff"
          />
          <circle cx="10.5" cy="11.5" r="0.9" fill="#0f172a" />
          <circle cx="13.5" cy="11.5" r="0.9" fill="#0f172a" />
          <path
            d="M10.8 13.8C11.1 14.1 11.5 14.3 12 14.3C12.5 14.3 12.9 14.1 13.2 13.8"
            stroke="#0f172a"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            Premium<span className="text-cyan-400">APK</span>
          </span>
          <span className="text-[10px] text-cyan-300/80 font-medium tracking-wider uppercase">
            Apps • Games • VIP
          </span>
        </div>
      )}
    </div>
  );
};
