import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareWarning,
  Bot,
  CalendarDays,
  Share2,
  Palette,
  X,
  Check,
  Star,
  Send,
  Sun,
  Moon,
  Monitor,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CivicCalendar } from './CivicCalendar';

interface FloatingQuickAccessToolbarProps {
  onOpenAssistant: () => void;
}

type ActivePanel = 'none' | 'feedback' | 'calendar' | 'accessibility';

// Accessibility magnification bounds
const MIN_MAGNIFICATION = 80;
const MAX_MAGNIFICATION = 150;
const STEP_MAGNIFICATION = 10;
const DEFAULT_MAGNIFICATION = 100;

export const FloatingQuickAccessToolbar: React.FC<FloatingQuickAccessToolbarProps> = ({
  onOpenAssistant
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [shareToast, setShareToast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---------------- Feedback State ----------------
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackCategory, setFeedbackCategory] = useState<string>('General');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // ---------------- Accessibility State ----------------
  const { theme, setTheme, colorVisionMode, setColorVisionMode } = useTheme();
  const [magnification, setMagnification] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sevaguide_magnification');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_MAGNIFICATION && parsed <= MAX_MAGNIFICATION) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_MAGNIFICATION;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sevaguide_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sevaguide_reduced_motion') === 'true';
    } catch {
      return false;
    }
  });

  // Apply magnification to DOM
  const applyMagnification = (zoomPercent: number) => {
    document.documentElement.style.fontSize = `${zoomPercent}%`;
    document.documentElement.style.setProperty('--app-magnification', `${zoomPercent}%`);
    localStorage.setItem('sevaguide_magnification', String(zoomPercent));
  };

  const handleIncreaseMagnification = () => {
    setMagnification((prev) => {
      const next = Math.min(MAX_MAGNIFICATION, prev + STEP_MAGNIFICATION);
      applyMagnification(next);
      return next;
    });
  };

  const handleDecreaseMagnification = () => {
    setMagnification((prev) => {
      const next = Math.max(MIN_MAGNIFICATION, prev - STEP_MAGNIFICATION);
      applyMagnification(next);
      return next;
    });
  };

  const handleResetMagnification = () => {
    setMagnification(DEFAULT_MAGNIFICATION);
    applyMagnification(DEFAULT_MAGNIFICATION);
  };

  const handleContrastToggle = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      setColorVisionMode('high-contrast');
    } else if (colorVisionMode === 'high-contrast') {
      setColorVisionMode('none');
    }
    document.documentElement.classList.toggle('high-contrast', next);
    localStorage.setItem('sevaguide_high_contrast', String(next));
  };

  const handleMotionToggle = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    document.documentElement.classList.toggle('reduce-motion', next);
    localStorage.setItem('sevaguide_reduced_motion', String(next));
  };

  const handleResetAccessibility = () => {
    handleResetMagnification();
    setHighContrast(false);
    setReducedMotion(false);
    setColorVisionMode('none');
    document.documentElement.classList.remove('high-contrast', 'reduce-motion', 'cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia', 'cb-high-contrast');
    localStorage.removeItem('sevaguide_magnification');
    localStorage.removeItem('sevaguide_high_contrast');
    localStorage.removeItem('sevaguide_reduced_motion');
    localStorage.removeItem('sevaguide_color_vision_mode');
  };

  // Close panels when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePanel('none');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePanel('none');
      }
    };

    if (activePanel !== 'none') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePanel]);

  // Handle Share Action
  const handleShare = async () => {
    setActivePanel('none');
    const shareData = {
      title: document.title || 'SevaGuide - Citizen Service Portal',
      text: 'Explore official government services and citizen guidelines on SevaGuide.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    // Fallback: Copy URL to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    } catch {
      // Fallback prompt for older browsers
      window.prompt('Copy link to clipboard:', window.location.href);
    }
  };

  // Handle Feedback Submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackRating(0);
      setFeedbackText('');
      setActivePanel('none');
    }, 2200);
  };

  // Action definition array
  const toolbarActions = [
    {
      id: 'feedback' as const,
      label: 'Feedback',
      icon: MessageSquareWarning,
      onClick: () => setActivePanel((prev) => (prev === 'feedback' ? 'none' : 'feedback'))
    },
    {
      id: 'assistant' as const,
      label: 'Ask AI Assistant',
      icon: Bot,
      onClick: () => {
        setActivePanel('none');
        onOpenAssistant();
      }
    },
    {
      id: 'calendar' as const,
      label: 'Civic Calendar',
      icon: CalendarDays,
      onClick: () => setActivePanel((prev) => (prev === 'calendar' ? 'none' : 'calendar'))
    },
    {
      id: 'share' as const,
      label: 'Share Page',
      icon: Share2,
      onClick: handleShare
    },
    {
      id: 'accessibility' as const,
      label: 'Accessibility & Theme',
      icon: Palette,
      onClick: () => setActivePanel((prev) => (prev === 'accessibility' ? 'none' : 'accessibility'))
    }
  ];

  return (
    <div
      ref={containerRef}
      className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end select-none"
      aria-label="Quick Access Toolbar"
    >
      {/* ---------------- FLOATING TOOLBAR BUTTONS ---------------- */}
      <div className="bg-zinc-950/90 dark:bg-black/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-zinc-800/80 shadow-2xl flex flex-col gap-2 ring-1 ring-white/5">
        {toolbarActions.map((action) => {
          const Icon = action.icon;
          const isActive = activePanel === action.id;

          return (
            <div key={action.id} className="relative group flex items-center">
              {/* Tooltip on the left */}
              <div
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-150 ease-out z-50 hidden sm:block"
                role="tooltip"
              >
                <div className="bg-zinc-900 text-zinc-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-700/90 shadow-xl whitespace-nowrap flex items-center gap-1.5">
                  <span>{action.label}</span>
                </div>
                {/* Tooltip arrow */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-zinc-900" />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={action.onClick}
                className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
                }`}
                aria-label={action.label}
                aria-expanded={isActive}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-110'}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ---------------- SHARE CONFIRMATION TOAST ---------------- */}
      {shareToast && (
        <div
          className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-900/95 text-emerald-400 border border-emerald-500/40 px-3.5 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200 whitespace-nowrap z-50 backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* ---------------- PANELS (FLYOUT FROM RIGHT) ---------------- */}

      {/* 1. FEEDBACK PANEL */}
      {activePanel === 'feedback' && (
        <div
          className="absolute right-14 sm:right-18 top-1/2 -translate-y-1/2 w-80 sm:w-96 max-w-[calc(100vw-4.5rem)] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-right-3 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Provide Feedback"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">SevaGuide Feedback</h3>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel('none')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition"
              aria-label="Close Feedback Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {feedbackSubmitted ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Thank You!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px]">
                Your feedback helps us make government service guidelines better for everyone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="pt-4 space-y-4 text-xs">
              {/* Category Pills */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Feedback Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['General', 'Bug Report', 'Suggestion', 'Accessibility'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeedbackCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg border font-medium transition ${
                        feedbackCategory === cat
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Rate your experience
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 rounded hover:scale-110 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= feedbackRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Your Comments
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share details about your experience or issues..."
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActivePanel('none')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!feedbackText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold px-4 py-1.5 rounded-lg transition shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 2. CIVIC CALENDAR PANEL */}
      {activePanel === 'calendar' && (
        <div className="fixed right-14 sm:right-18 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-right-3 duration-200">
          <CivicCalendar onClose={() => setActivePanel('none')} />
        </div>
      )}

      {/* 3. ACCESSIBILITY PANEL */}
      {activePanel === 'accessibility' && (
        <div
          className="absolute right-14 sm:right-18 top-1/2 -translate-y-1/2 w-80 sm:w-90 max-w-[calc(100vw-4.5rem)] max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-right-3 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility and Appearance Controls"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Accessibility & Theme</span>
            </h3>
            <button
              type="button"
              onClick={() => setActivePanel('none')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition"
              aria-label="Close Accessibility Controls"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4 text-xs">
            {/* Theme Mode Selector */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition ${
                    theme === 'light'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Switch to Light Mode"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Switch to Dark Mode"
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition ${
                    theme === 'system'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Sync with System Theme"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Color Vision / Color Blindness Mode */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-semibold text-slate-800 dark:text-slate-200">
                  Color Vision Accessibility
                </label>
                {colorVisionMode !== 'none' && (
                  <button
                    type="button"
                    onClick={() => setColorVisionMode('none')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-1 py-0.5 rounded transition"
                  >
                    Reset Palette
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                Select a palette optimized for color-vision deficiencies
              </p>

              <div className="space-y-1.5" role="radiogroup" aria-label="Color Vision Palettes">
                {[
                  {
                    id: 'none' as const,
                    label: 'Default Theme',
                    desc: 'Standard color contrast',
                    swatches: ['bg-blue-600', 'bg-emerald-500', 'bg-amber-500']
                  },
                  {
                    id: 'protanopia' as const,
                    label: 'Protanopia-Friendly',
                    desc: 'Reduced red sensitivity (gold / royal blue)',
                    swatches: ['bg-yellow-500', 'bg-blue-600', 'bg-cyan-500']
                  },
                  {
                    id: 'deuteranopia' as const,
                    label: 'Deuteranopia-Friendly',
                    desc: 'Reduced green sensitivity (yellow / cobalt blue)',
                    swatches: ['bg-amber-400', 'bg-indigo-600', 'bg-teal-500']
                  },
                  {
                    id: 'tritanopia' as const,
                    label: 'Tritanopia-Friendly',
                    desc: 'Reduced blue-yellow discrimination (red / teal)',
                    swatches: ['bg-rose-600', 'bg-teal-600', 'bg-slate-500']
                  },
                  {
                    id: 'high-contrast' as const,
                    label: 'High Contrast Mode',
                    desc: 'Maximum black & white contrast',
                    swatches: ['bg-black dark:bg-white', 'bg-yellow-400', 'bg-blue-500']
                  }
                ].map((palette) => {
                  const isSelected = colorVisionMode === palette.id;

                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setColorVisionMode(palette.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-100 font-semibold shadow-2xs'
                          : 'bg-slate-50 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="flex items-center -space-x-1 shrink-0">
                          {palette.swatches.map((swatch, idx) => (
                            <span
                              key={idx}
                              className={`w-3.5 h-3.5 rounded-full border border-white dark:border-zinc-900 shadow-2xs ${swatch}`}
                            />
                          ))}
                        </div>

                        <div className="truncate">
                          <p className="text-xs font-semibold leading-tight">{palette.label}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{palette.desc}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Magnification */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-1.5">
                <label id="quick-toolbar-magnification-label" className="block font-semibold text-slate-800 dark:text-slate-200">
                  Display Magnification
                </label>
                {magnification !== DEFAULT_MAGNIFICATION && (
                  <button
                    type="button"
                    onClick={handleResetMagnification}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-1 py-0.5 rounded transition"
                  >
                    Reset (100%)
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                Scale text and interface size (80% – 150%)
              </p>

              <div
                className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 p-2 rounded-xl"
                role="group"
                aria-labelledby="quick-toolbar-magnification-label"
              >
                <button
                  type="button"
                  onClick={handleDecreaseMagnification}
                  disabled={magnification <= MIN_MAGNIFICATION}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
                  aria-label="Decrease magnification"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="flex flex-col items-center justify-center flex-1 select-none">
                  <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                    {magnification}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {magnification === DEFAULT_MAGNIFICATION
                      ? 'Default'
                      : magnification < DEFAULT_MAGNIFICATION
                      ? 'Reduced'
                      : 'Magnified'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncreaseMagnification}
                  disabled={magnification >= MAX_MAGNIFICATION}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
                  aria-label="Increase magnification"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">High Contrast Mode</p>
                <p className="text-[11px] text-slate-400">Increase contrast for readability</p>
              </div>
              <button
                type="button"
                onClick={handleContrastToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  highContrast ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
                role="switch"
                aria-checked={highContrast}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Reduce Animations</p>
                <p className="text-[11px] text-slate-400">Minimize movement on hover</p>
              </div>
              <button
                type="button"
                onClick={handleMotionToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reducedMotion ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
                role="switch"
                aria-checked={reducedMotion}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <button
              type="button"
              onClick={handleResetAccessibility}
              className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel('none')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1 rounded-lg text-xs transition shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
