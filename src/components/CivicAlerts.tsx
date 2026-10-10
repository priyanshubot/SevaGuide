import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Info,
  ShieldAlert,
  Pause,
  Play,
} from 'lucide-react';

export interface CivicAlert {
  id: string;
  category: string;
  severity: 'Important' | 'Update' | 'Advisory';
  title: string;
  description: string;
  tag: string;
}

const DEMO_CIVIC_ALERTS: CivicAlert[] = [
  {
    id: 'alert-1',
    category: 'Aadhaar',
    severity: 'Advisory',
    title: 'UIDAI Document Update',
    description: 'Verify identity and address proofs periodically to ensure Aadhaar records remain current.',
    tag: 'Demo Data',
  },
  {
    id: 'alert-2',
    category: 'PAN Service',
    severity: 'Important',
    title: 'Spelling Match Verification',
    description: 'Confirm exact name spelling across POI documents before submitting PAN correction requests.',
    tag: 'Demo Data',
  },
  {
    id: 'alert-3',
    category: 'Passport Seva',
    severity: 'Update',
    title: 'Pre-Scheduled PSK Tokens',
    description: 'Regional PSK centers require pre-scheduled online appointments; walk-in slots are limited.',
    tag: 'Demo Data',
  },
];

export const CivicAlerts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);

  const total = DEMO_CIVIC_ALERTS.length;

  // Listen to browser prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Set up 5-second automatic rotation with manual reset and cleanup
  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPaused || isHovered || prefersReducedMotion) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, isHovered, prefersReducedMotion, currentIndex, nextSlide]);

  const togglePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const current = DEMO_CIVIC_ALERTS[currentIndex];

  const getSeverityBadge = (severity: CivicAlert['severity']) => {
    switch (severity) {
      case 'Important':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Important
          </span>
        );
      case 'Update':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Update
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
            <ShieldAlert className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            Advisory
          </span>
        );
    }
  };

  return (
    <section
      aria-label="Civic Alerts & Notices"
      className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Header with Title and Carousel Controls */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            <Bell className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Civic Alerts & Advisories
          </h2>
        </div>

        {/* Carousel Controls: Pause/Resume, Prev, Counter, Next */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePauseResume}
            aria-label={isPaused ? 'Resume automatic rotation' : 'Pause automatic rotation'}
            title={isPaused ? 'Resume automatic rotation' : 'Pause automatic rotation'}
            className={`p-1.5 rounded-lg border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
              isPaused
                ? 'border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous alert"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 px-1">
            {currentIndex + 1}/{total}
          </span>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next alert"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Content: Compact, intentional card without explanatory paragraphs */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
        <div className="flex items-center gap-2">
          {getSeverityBadge(current.severity)}
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
            {current.category}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          {current.title}
        </h3>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 pt-1">
        {DEMO_CIVIC_ALERTS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to alert slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-200 focus:outline-none cursor-pointer ${
              idx === currentIndex
                ? 'w-6 bg-blue-700 dark:bg-blue-500'
                : 'w-2 bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
