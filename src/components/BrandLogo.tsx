import React from 'react';

interface BrandLogoProps {
  lightText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  lightText = false,
  size = 'md',
  showSubtitle = false,
}) => {
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';
  const subTextSize = size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Custom SevaGuide Civic Mark */}
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
        <img
          src="/logo.png"
          alt="SevaGuide Logo"
          className={`${
            size === 'lg'
              ? 'w-11 h-11'
              : size === 'sm'
              ? 'w-7 h-7'
              : 'w-9 h-9'
          } object-contain rounded-xl bg-white shadow-2xs border border-slate-200/80 dark:border-zinc-800 p-0.5`}
        />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold ${textSize} tracking-tight ${
            lightText
              ? 'text-white'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          Seva<span className="text-emerald-600 dark:text-emerald-400">Guide</span>
        </span>
        {showSubtitle && (
          <span
            className={`font-medium ${subTextSize} tracking-wider uppercase mt-0.5 ${
              lightText
                ? 'text-slate-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Civic Services
          </span>
        )}
      </div>
    </div>
  );
};
