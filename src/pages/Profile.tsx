import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { UserDocuments } from '../components/UserDocuments';
import { UserApplications } from '../components/UserApplications';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Sliders, CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const location = useLocation();
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      <div>
        <ProfileHeader />
      </div>

      {/* Account Settings & Appearance Preferences */}
      <div id="settings" className="scroll-mt-20">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Settings & Appearance</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose your interface theme. Switch back to clean white or pitch-black AMOLED dark anytime.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 hidden sm:inline-flex items-center gap-1.5">
              <span>Current:</span>
              <strong className="text-blue-700 dark:text-blue-400 capitalize">{resolvedTheme === 'dark' ? 'AMOLED Dark' : 'White Light'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* White / Light Theme Card */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                theme === 'light'
                  ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Sun className="w-4 h-4" />
                </div>
                {theme === 'light' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">White / Light Mode</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Classic clean citizen portal styling</div>
              </div>
            </button>

            {/* AMOLED Pure Dark Theme Card */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                theme === 'dark'
                  ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-zinc-900 text-blue-400 border border-zinc-700">
                  <Moon className="w-4 h-4" />
                </div>
                {theme === 'dark' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">AMOLED Dark Mode</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pitch-black #000000 for OLED screens</div>
              </div>
            </button>

            {/* System Match Card */}
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                theme === 'system'
                  ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700">
                  <Monitor className="w-4 h-4" />
                </div>
                {theme === 'system' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">System Preference</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Follows your OS appearance setting</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div id="documents" className="border-t border-slate-200/80 dark:border-zinc-900 pt-8 scroll-mt-20">
        <UserDocuments />
      </div>

      <div id="applications" className="border-t border-slate-200/80 dark:border-zinc-900 pt-8 scroll-mt-20">
        <UserApplications />
      </div>
    </div>
  );
};

export default Profile;

