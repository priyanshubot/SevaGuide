import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  FileText,
  Users,
  Clock,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileDropdown: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Citizen User';
  const displayEmail = profile?.email || user?.email || '';

  // Get user initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimeout();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    clearCloseTimeout();
    // 180ms grace window so pointer transition between trigger and menu is smooth
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearCloseTimeout();
    setIsOpen((prev) => !prev);
  };

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      clearCloseTimeout();
    };
  }, [isOpen]);

  // Close dropdown on location change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Trigger Button */}
        <button
        onClick={handleToggleClick}
        type="button"
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
          isOpen || location.pathname === '/profile'
            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User Account Menu"
      >
        <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
          {getInitials(displayName)}
        </div>
        <span className="hidden sm:inline max-w-[110px] truncate">{displayName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-blue-700 dark:text-blue-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 focus:outline-none"
        >
          {/* User identity summary */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950 -mt-2 rounded-t-xl mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
                {getInitials(displayName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                  <span>{displayName}</span>
                  <span title="Verified Citizen">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-label="Verified Citizen" />
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {displayEmail || 'Verified Citizen'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              to="/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition"
            >
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/profile#documents"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition"
            >
              <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Your Documents</span>
            </Link>

            <Link
              to="/family-documents"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition"
            >
              <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Family Document Management</span>
            </Link>

            <Link
              to="/applications"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition"
            >
              <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>My Applications</span>
            </Link>

            <Link
              to="/profile#settings"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition"
            >
              <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Account Settings</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            role="menuitem"
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
          >
            <LogOut className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
