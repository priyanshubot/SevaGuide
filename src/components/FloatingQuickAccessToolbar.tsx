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
  GripVertical
} from 'lucide-react';
import { useTheme, ColorVisionMode } from '../context/ThemeContext';
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

  // ---------------- Dragging & Positioning State ----------------
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('sevaguide_toolbar_position');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.x === 'number' &&
          typeof parsed.y === 'number' &&
          !isNaN(parsed.x) &&
          !isNaN(parsed.y)
        ) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(8, window.innerWidth - 68),
        y: Math.max(16, Math.floor((window.innerHeight - 300) / 2))
      };
    }
    return { x: 16, y: 150 };
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  // Clamp position to viewport bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => {
        const toolbarWidth = 56;
        const toolbarHeight = 310;
        const clampedX = Math.min(Math.max(8, prev.x), window.innerWidth - toolbarWidth - 8);
        const clampedY = Math.min(Math.max(8, prev.y), window.innerHeight - toolbarHeight - 8);
        return { x: clampedX, y: clampedY };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer event handlers for dragging the toolbar
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { ...pos };

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMovedRef.current = true;
    }

    const toolbarWidth = 56;
    const toolbarHeight = 310;

    const newX = Math.min(
      Math.max(8, initialPosRef.current.x + dx),
      window.innerWidth - toolbarWidth - 8
    );
    const newY = Math.min(
      Math.max(8, initialPosRef.current.y + dy),
      window.innerHeight - toolbarHeight - 8
    );

    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      localStorage.setItem('sevaguide_toolbar_position', JSON.stringify(pos));
    }
  };

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
      return (
        colorVisionMode === 'high-contrast' ||
        localStorage.getItem('sevaguide_high_contrast') === 'true'
      );
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
    document.documentElement.classList.remove(
      'high-contrast',
      'reduce-motion',
      'cb-protanopia',
      'cb-deuteranopia',
      'cb-tritanopia',
      'cb-high-contrast'
    );
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
      label: 'Color Vision Accessibility',
      icon: Palette,
      onClick: () => setActivePanel((prev) => (prev === 'accessibility' ? 'none' : 'accessibility'))
    }
  ];

  // Dynamic Toolbar Palette Styles (Task 3)
  const getToolbarStyles = (mode: ColorVisionMode) => {
    switch (mode) {
      case 'protanopia':
        return {
          container: 'bg-slate-950/95 border-yellow-500/80 text-yellow-100 shadow-yellow-500/20',
          btnDefault: 'bg-slate-900/90 border-yellow-600/50 hover:bg-slate-800 text-yellow-200 hover:text-white',
          btnActive: 'bg-yellow-500 border-yellow-300 text-slate-950 font-bold shadow-yellow-500/40',
          focusRing: 'focus-visible:ring-yellow-400'
        };
      case 'deuteranopia':
        return {
          container: 'bg-indigo-950/95 border-indigo-500/80 text-indigo-100 shadow-indigo-500/20',
          btnDefault: 'bg-indigo-900/90 border-indigo-600/50 hover:bg-indigo-800 text-indigo-200 hover:text-white',
          btnActive: 'bg-indigo-600 border-indigo-300 text-white font-bold shadow-indigo-600/40',
          focusRing: 'focus-visible:ring-indigo-400'
        };
      case 'tritanopia':
        return {
          container: 'bg-teal-950/95 border-teal-500/80 text-teal-100 shadow-teal-500/20',
          btnDefault: 'bg-teal-900/90 border-teal-600/50 hover:bg-teal-800 text-teal-200 hover:text-white',
          btnActive: 'bg-teal-600 border-teal-300 text-white font-bold shadow-teal-600/40',
          focusRing: 'focus-visible:ring-teal-400'
        };
      case 'high-contrast':
        return {
          container: 'bg-black border-2 border-white text-white shadow-2xl',
          btnDefault: 'bg-black border-2 border-white text-white hover:bg-zinc-800',
          btnActive: 'bg-white text-black border-2 border-white font-bold shadow-lg',
          focusRing: 'focus-visible:ring-4 focus-visible:ring-yellow-400'
        };
      default:
        return {
          container: 'bg-zinc-950/90 dark:bg-black/95 border-zinc-800/80 text-zinc-300 shadow-2xl',
          btnDefault: 'bg-zinc-900/90 border-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white',
          btnActive: 'bg-blue-600 border-blue-400 text-white shadow-blue-600/30',
          focusRing: 'focus-visible:ring-blue-500'
        };
    }
  };

  const toolbarTheme = getToolbarStyles(colorVisionMode);
  const isRightHalf = typeof window !== 'undefined' ? pos.x > window.innerWidth / 2 : true;

  return (
    <div
      ref={containerRef}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }}
      className="fixed z-40 flex flex-col items-center select-none touch-none"
      aria-label="Floating Quick Access Toolbar"
    >
      {/* ---------------- FLOATING TOOLBAR CONTAINER ---------------- */}
      <div
        className={`backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border shadow-2xl flex flex-col gap-2 ring-1 ring-white/5 ${toolbarTheme.container}`}
      >
        {/* DRAG HANDLE (Task 2) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full flex items-center justify-center py-1 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-white rounded-lg transition"
          aria-label="Reposition toolbar"
          title="Drag to reposition toolbar"
        >
          <GripVertical className="w-4 h-4 opacity-70 hover:opacity-100" />
        </div>

        {/* TOOLBAR BUTTONS */}
        {toolbarActions.map((action) => {
          const Icon = action.icon;
          const isActive = activePanel === action.id;

          return (
            <div key={action.id} className="relative group flex items-center">
              {/* Tooltip (Opens Left or Right based on toolbar position) */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-150 ease-out z-50 hidden sm:block ${
                  isRightHalf ? 'right-full mr-3 translate-x-1 group-hover:translate-x-0' : 'left-full ml-3 -translate-x-1 group-hover:translate-x-0'
                }`}
                role="tooltip"
              >
                <div className="bg-zinc-900 text-zinc-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-700/90 shadow-xl whitespace-nowrap">
                  <span>{action.label}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (!hasMovedRef.current) {
                    action.onClick();
                  }
                }}
                className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${toolbarTheme.focusRing} ${
                  isActive ? toolbarTheme.btnActive : toolbarTheme.btnDefault
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
          className={`absolute top-1/2 -translate-y-1/2 bg-zinc-900/95 text-emerald-400 border border-emerald-500/40 px-3.5 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 whitespace-nowrap z-50 backdrop-blur-md ${
            isRightHalf ? 'right-full mr-4' : 'left-full ml-4'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* ---------------- FLYOUT PANELS (Task 4 Simplified UI) ---------------- */}

      {/* 1. FEEDBACK PANEL */}
      {activePanel === 'feedback' && (
        <div
          className={`absolute top-0 w-80 sm:w-96 max-w-[calc(100vw-4.5rem)] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in duration-200 ${
            isRightHalf ? 'right-full mr-4' : 'left-full ml-4'
          }`}
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
        <div
          className={`absolute top-0 z-50 animate-in fade-in duration-200 ${
            isRightHalf ? 'right-full mr-4' : 'left-full ml-4'
          }`}
        >
          <CivicCalendar onClose={() => setActivePanel('none')} />
        </div>
      )}

      {/* 3. SIMPLIFIED COLOR VISION ACCESSIBILITY PANEL (Task 4) */}
      {activePanel === 'accessibility' && (
        <div
          className={`absolute top-0 w-80 sm:w-88 max-w-[calc(100vw-4.5rem)] max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in duration-200 ${
            isRightHalf ? 'right-full mr-4' : 'left-full ml-4'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Color Vision Accessibility Controls"
        >
          {/* HEADING (Task 4.A: Subtitle sentence removed!) */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Color Vision Accessibility</span>
            </h3>
            <button
              type="button"
              onClick={() => setActivePanel('none')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition"
              aria-label="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-3.5 text-xs">
            {/* COLOR PALETTE OPTIONS (Task 4.B: Subtitles underneath option names REMOVED!) */}
            <div className="space-y-1.5" role="radiogroup" aria-label="Color Vision Palettes">
              {[
                {
                  id: 'none' as const,
                  label: 'Default Theme',
                  swatches: ['bg-blue-600', 'bg-emerald-500', 'bg-amber-500']
                },
                {
                  id: 'protanopia' as const,
                  label: 'Protanopia-Friendly',
                  swatches: ['bg-yellow-500', 'bg-blue-600', 'bg-cyan-500']
                },
                {
                  id: 'deuteranopia' as const,
                  label: 'Deuteranopia-Friendly',
                  swatches: ['bg-amber-400', 'bg-indigo-600', 'bg-teal-500']
                },
                {
                  id: 'tritanopia' as const,
                  label: 'Tritanopia-Friendly',
                  swatches: ['bg-rose-600', 'bg-teal-600', 'bg-slate-500']
                },
                {
                  id: 'high-contrast' as const,
                  label: 'High Contrast Mode',
                  swatches: ['bg-black dark:bg-white', 'bg-yellow-400', 'bg-blue-500']
                }
              ].map((palette) => {
                const isSelected = colorVisionMode === palette.id;

                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => {
                      setColorVisionMode(palette.id);
                      if (palette.id === 'high-contrast') {
                        setHighContrast(true);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-100 font-semibold shadow-2xs'
                        : 'bg-slate-50 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Swatches */}
                      <div className="flex items-center -space-x-1 shrink-0">
                        {palette.swatches.map((swatch, idx) => (
                          <span
                            key={idx}
                            className={`w-3.5 h-3.5 rounded-full border border-white dark:border-zinc-900 shadow-2xs ${swatch}`}
                          />
                        ))}
                      </div>
                      {/* Palette Name ONLY (Subtitles removed per Task 4.B) */}
                      <span className="text-xs font-semibold truncate">{palette.label}</span>
                    </div>

                    {/* Checkmark Indicator */}
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* DISPLAY MAGNIFICATION (Task 4.C: Explanatory subtitle removed!) */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <label id="quick-toolbar-magnification-label" className="block font-semibold text-slate-800 dark:text-slate-200">
                  Display Magnification
                </label>
                {magnification !== DEFAULT_MAGNIFICATION && (
                  <button
                    type="button"
                    onClick={handleResetMagnification}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-1 py-0.5 rounded transition"
                  >
                    Reset
                  </button>
                )}
              </div>

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

            {/* HIGH CONTRAST MODE TOGGLE (Task 4.D: Subtitle removed!) */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">High Contrast Mode</span>
              <button
                type="button"
                onClick={handleContrastToggle}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  highContrast ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
                role="switch"
                aria-checked={highContrast}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* REDUCE ANIMATIONS TOGGLE (Task 4.E: Subtitle removed!) */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Reduce Animations</span>
              <button
                type="button"
                onClick={handleMotionToggle}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reducedMotion ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
                role="switch"
                aria-checked={reducedMotion}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* COLOR THEME SELECTOR (Light / Dark / System) */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800">
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-1 px-2 rounded-lg border flex items-center justify-center gap-1 font-medium transition ${
                    theme === 'light'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-1 px-2 rounded-lg border flex items-center justify-center gap-1 font-medium transition ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-3 h-3 text-blue-400" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`py-1 px-2 rounded-lg border flex items-center justify-center gap-1 font-medium transition ${
                    theme === 'system'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>System</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <button
              type="button"
              onClick={handleResetAccessibility}
              className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel('none')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-lg text-xs transition shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
