import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronLeft, ChevronRight, AlertCircle, Info, ShieldAlert } from 'lucide-react';

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
  const timerRef = useRef<number | null>(null);

  const total = DEMO_CIVIC_ALERTS.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  const current = DEMO_CIVIC_ALERTS[currentIndex];

  const getSeverityBadge = (severity: CivicAlert['severity']) => {
    switch (severity) {
      case 'Important':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Important
          </span>
        );
      case 'Update':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
            <Info className="w-3 h-3 text-blue-600" />
            Update
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
            <ShieldAlert className="w-3 h-3 text-teal-600" />
            Advisory
          </span>
        );
    }
  };

  return (
    <section
      aria-label="Civic Alerts & Notices"
      className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Header with Title, Demo Tag, and Carousel Controls */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Civic Alerts & Advisories</h2>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                Demo Notices
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevSlide}
            aria-label="Previous alert"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 px-1">
            {currentIndex + 1}/{total}
          </span>
          <button
            onClick={nextSlide}
            aria-label="Next alert"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
        <div className="flex items-center gap-2">
          {getSeverityBadge(current.severity)}
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
            {current.category}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{current.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{current.description}</p>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 pt-1">
        {DEMO_CIVIC_ALERTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to alert slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-200 focus:outline-none ${
              idx === currentIndex ? 'w-6 bg-blue-700' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
