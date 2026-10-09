import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  SlidersHorizontal,
  Globe,
  LogIn,
  Clock,
  User,
  Menu,
  X,
  Bot,
  MapPin,
  FileText,
  RotateCcw,
  Minus,
  Plus,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BrandLogo } from './BrandLogo';
import { CivicCalendar } from './CivicCalendar';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  onOpenAssistant: () => void;
}

type ActivePanel = 'none' | 'calendar' | 'accessibility' | 'language';

// Magnification configuration constants
const MIN_MAGNIFICATION = 80;
const MAX_MAGNIFICATION = 150;
const STEP_MAGNIFICATION = 10;
const DEFAULT_MAGNIFICATION = 100;

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistant }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');

  // Accessibility state
  const [magnification, setMagnification] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sevaguide_magnification');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_MAGNIFICATION && parsed <= MAX_MAGNIFICATION) {
          return parsed;
        }
      }
      // Migration fallback from legacy sevaguide_font_size
      const legacy = localStorage.getItem('sevaguide_font_size');
      if (legacy === 'large') return 110;
      if (legacy === 'extra-large') return 125;
    } catch {
      // ignore
    }
    return DEFAULT_MAGNIFICATION;
  });
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, resolvedTheme, setTheme, toggleTheme, colorVisionMode, setColorVisionMode } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const applyMagnification = (zoomPercent: number) => {
    document.documentElement.style.fontSize = `${zoomPercent}%`;
    document.documentElement.style.setProperty('--app-magnification', `${zoomPercent}%`);
    document.documentElement.classList.remove('large-text', 'extra-large-text');
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

  // Load accessibility settings from localStorage on mount
  useEffect(() => {
    applyMagnification(magnification);

    const savedContrast = localStorage.getItem('sevaguide_high_contrast') === 'true';
    const savedMotion = localStorage.getItem('sevaguide_reduced_motion') === 'true';

    if (savedContrast) {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
    if (savedMotion) {
      setReducedMotion(true);
      document.documentElement.classList.add('reduce-motion');
    }
  }, []);

  const handleContrastToggle = () => {
    const next = !highContrast;
    setHighContrast(next);
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
    document.documentElement.classList.remove('large-text', 'extra-large-text', 'high-contrast', 'reduce-motion', 'cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia', 'cb-high-contrast');
    localStorage.removeItem('sevaguide_magnification');
    localStorage.removeItem('sevaguide_font_size');
    localStorage.removeItem('sevaguide_high_contrast');
    localStorage.removeItem('sevaguide_reduced_motion');
    localStorage.removeItem('sevaguide_color_vision_mode');
  };

  // Close dropdowns on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActivePanel('none');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel('none');
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

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((curr) => (curr === panel ? 'none' : panel));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-900 sticky top-0 z-40 shadow-xs border-t-2 border-t-blue-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Left: Original SevaGuide Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            aria-label="SevaGuide Home"
          >
            <BrandLogo size="md" lightText={false} />
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link
              to="/services"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/services')
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Services
            </Link>
            <Link
              to="/offices"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/offices')
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Office Locator
            </Link>
            {user ? (
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-lg transition ${
                  isActive('/profile')
                    ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                    : 'hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                My Applications
              </Link>
            ) : (
              <a
                href="/#how-it-works"
                className="px-3 py-1.5 rounded-lg transition hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                How It Works
              </a>
            )}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition border border-slate-200 dark:border-slate-700"
              title="Ask SevaGuide Civic Assistant"
            >
              <Bot className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>Ask AI</span>
            </button>
          </nav>

          {/* Right Controls: Calendar, Accessibility, Theme Toggle, Language, Login */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative" ref={panelRef}>
            {/* Theme Toggle Button (Light / Dark / System) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs"
              title={`Switch theme (Currently ${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`}
              aria-label={`Toggle theme (Current: ${resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode'})`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* 1. Calendar */}
            <button
              onClick={() => togglePanel('calendar')}
              className={`p-2 rounded-lg border text-slate-700 dark:text-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activePanel === 'calendar'
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300'
              }`}
              title="Citizen Service Calendar & Timings"
              aria-label="Citizen Service Calendar and Working Hours"
              aria-expanded={activePanel === 'calendar'}
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* 2. Accessibility */}
            <button
              onClick={() => togglePanel('accessibility')}
              className={`p-2 rounded-lg border text-slate-700 dark:text-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activePanel === 'accessibility'
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300'
              }`}
              title="Accessibility Options"
              aria-label="Accessibility Options (Magnification, Contrast & Theme)"
              aria-expanded={activePanel === 'accessibility'}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* 3. Language */}
            <button
              onClick={() => togglePanel('language')}
              className={`p-2 rounded-lg border text-slate-700 dark:text-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activePanel === 'language'
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300'
              }`}
              title="Language / भाषा"
              aria-label="Language Selector"
              aria-expanded={activePanel === 'language'}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* 4. Login / Profile Dropdown */}
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Login to SevaGuide"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* ---------------- DROPDOWN PANELS ---------------- */}

            {/* 1. CALENDAR PANEL */}
            {activePanel === 'calendar' && (
              <CivicCalendar onClose={() => setActivePanel('none')} />
            )}

            {/* 2. ACCESSIBILITY PANEL */}
            {activePanel === 'accessibility' && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-90 max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <span>Accessibility Options</span>
                  </h3>
                  <button
                    onClick={() => setActivePanel('none')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    aria-label="Close Accessibility Options"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-4 space-y-4 text-xs">
                  {/* Theme Mode Selector (Light / Dark / System) */}
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
                            ? 'bg-blue-700 text-white border-blue-700 shadow-2xs font-bold'
                            : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                        }`}
                        title="Switch to White / Light Mode"
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition ${
                          theme === 'dark'
                            ? 'bg-blue-700 text-white border-blue-700 shadow-2xs font-bold'
                            : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                        }`}
                        title="Switch to AMOLED Dark Mode"
                      >
                        <Moon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Dark</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme('system')}
                        className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition ${
                          theme === 'system'
                            ? 'bg-blue-700 text-white border-blue-700 shadow-2xs font-bold'
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
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-semibold text-slate-800 dark:text-slate-200">
                        Color Vision Accessibility
                      </label>
                      {colorVisionMode !== 'none' && (
                        <button
                          type="button"
                          onClick={() => setColorVisionMode('none')}
                          className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline px-1 py-0.5 rounded transition"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      Optimized palettes for color blindness
                    </p>
                    <div className="grid grid-cols-1 gap-1.5" role="radiogroup" aria-label="Color Vision Modes">
                      {[
                        { id: 'none' as const, label: 'Default Theme', desc: 'Standard colors' },
                        { id: 'protanopia' as const, label: 'Protanopia', desc: 'Red-blind friendly' },
                        { id: 'deuteranopia' as const, label: 'Deuteranopia', desc: 'Green-blind friendly' },
                        { id: 'tritanopia' as const, label: 'Tritanopia', desc: 'Blue-yellow friendly' },
                        { id: 'high-contrast' as const, label: 'High Contrast', desc: 'Max contrast' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setColorVisionMode(item.id)}
                          className={`w-full py-1.5 px-2.5 rounded-lg border text-left flex items-center justify-between font-medium transition ${
                            colorVisionMode === item.id
                              ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-400 font-bold'
                              : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                          role="radio"
                          aria-checked={colorVisionMode === item.id}
                        >
                          <div className="flex items-center gap-2">
                            <span>{item.label}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({item.desc})</span>
                          </div>
                          {colorVisionMode === item.id && <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Magnification */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <label id="magnification-label" className="block font-semibold text-slate-800 dark:text-slate-200">
                        Display Magnification
                      </label>
                      {magnification !== DEFAULT_MAGNIFICATION && (
                        <button
                          type="button"
                          onClick={handleResetMagnification}
                          className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline px-1.5 py-0.5 rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          title="Reset magnification to 100%"
                          aria-label="Reset magnification to 100%"
                        >
                          Reset (100%)
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                      Scale text and interface size (80% – 150%)
                    </p>

                    <div
                      className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2 rounded-xl"
                      role="group"
                      aria-labelledby="magnification-label"
                    >
                      {/* Decrease (-) Button */}
                      <button
                        type="button"
                        onClick={handleDecreaseMagnification}
                        disabled={magnification <= MIN_MAGNIFICATION}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 active:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        aria-label="Decrease magnification"
                        title="Decrease magnification (10%)"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      {/* Zoom Percentage Indicator */}
                      <div className="flex flex-col items-center justify-center flex-1 select-none">
                        <span
                          className="font-bold text-base text-slate-900 dark:text-white tracking-tight"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {magnification}%
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                          {magnification === DEFAULT_MAGNIFICATION
                            ? 'Default (100%)'
                            : magnification < DEFAULT_MAGNIFICATION
                            ? 'Reduced'
                            : 'Magnified'}
                        </span>
                      </div>

                      {/* Increase (+) Button */}
                      <button
                        type="button"
                        onClick={handleIncreaseMagnification}
                        disabled={magnification >= MAX_MAGNIFICATION}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 active:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        aria-label="Increase magnification"
                        title="Increase magnification (10%)"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 mt-1.5">
                      <span>Min: {MIN_MAGNIFICATION}%</span>
                      <span>Default: 100%</span>
                      <span>Max: {MAX_MAGNIFICATION}%</span>
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">High Contrast Mode</p>
                      <p className="text-[11px] text-slate-400">Increase contrast for readability</p>
                    </div>
                    <button
                      onClick={handleContrastToggle}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        highContrast ? 'bg-blue-700' : 'bg-slate-200 dark:bg-slate-700'
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

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Reduce Animations</p>
                      <p className="text-[11px] text-slate-400">Minimize movement on hover</p>
                    </div>
                    <button
                      onClick={handleMotionToggle}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        reducedMotion ? 'bg-blue-700' : 'bg-slate-200 dark:bg-slate-700'
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

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button
                    onClick={handleResetAccessibility}
                    className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Defaults</span>
                  </button>
                  <button
                    onClick={() => setActivePanel('none')}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3.5 py-1 rounded-lg text-xs transition shadow-2xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* 3. LANGUAGE SELECTOR PANEL */}
            {activePanel === 'language' && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <span>Select Language / भाषा चुनें</span>
                  </h3>
                  <button
                    onClick={() => setActivePanel('none')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    aria-label="Close Language Selector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  {/* English Option */}
                  <label
                    onClick={() => setSelectedLanguage('en')}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                      selectedLanguage === 'en'
                        ? 'bg-blue-50/70 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedLanguage === 'en' ? 'border-blue-700 bg-blue-700' : 'border-slate-400'
                      }`}>
                        {selectedLanguage === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-semibold">English</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Active
                    </span>
                  </label>

                  {/* Hindi Option */}
                  <label
                    onClick={() => setSelectedLanguage('hi')}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                      selectedLanguage === 'hi'
                        ? 'bg-blue-50/70 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedLanguage === 'hi' ? 'border-blue-700 bg-blue-700' : 'border-slate-400'
                      }`}>
                        {selectedLanguage === 'hi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-semibold">हिन्दी (Hindi)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                      Preview
                    </span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Note: Core statutory notices and official requirements are displayed in English. Regional language expansion is actively being rolled out across services.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-900 px-4 pt-3 pb-6 space-y-3 shadow-sm">
          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Theme</span>
            <div className="flex gap-1">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded ${theme === 'light' ? 'bg-blue-700 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                title="Light"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded ${theme === 'dark' ? 'bg-blue-700 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                title="Dark"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded ${theme === 'system' ? 'bg-blue-700 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                title="System"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
          >
            <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>Government Services</span>
          </Link>
          <Link
            to="/offices"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
          >
            <MapPin className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>Office Locator</span>
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <User className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/profile#documents"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Your Documents</span>
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <Clock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>My Applications</span>
              </Link>
              <Link
                to="/profile#settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-sm font-semibold"
              >
                <Bot className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Ask SevaGuide AI</span>
              </button>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <span>How It Works</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <Bot className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Ask SevaGuide AI</span>
              </button>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};