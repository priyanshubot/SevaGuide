import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { UserDocuments } from '../components/UserDocuments';
import { UserApplications } from '../components/UserApplications';
import { FamilyDocuments } from './FamilyDocuments';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Monitor,
  Sliders,
  CheckCircle2,
  FileText,
  Users,
  Clock
} from 'lucide-react';

type ProfileTab = 'documents' | 'family' | 'applications' | 'settings';

export const Profile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const getInitialTab = (): ProfileTab => {
    const hash = location.hash.replace('#', '');
    if (hash === 'family') return 'family';
    if (hash === 'applications') return 'applications';
    if (hash === 'settings') return 'settings';
    return 'documents';
  };

  const [activeTab, setActiveTab] = useState<ProfileTab>(getInitialTab);

  // Sync activeTab when URL hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'family' || hash === 'applications' || hash === 'settings' || hash === 'documents') {
      setActiveTab(hash as ProfileTab);
    }
  }, [location.hash]);

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    navigate(`/profile#${tab}`, { replace: true });
  };

  const tabs: Array<{
    id: ProfileTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }> = [
    {
      id: 'documents',
      label: 'Personal Documents',
      icon: FileText,
      description: 'Your verified identity and civil records'
    },
    {
      id: 'family',
      label: 'Family Documents',
      icon: Users,
      description: 'Household members & family records'
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: Clock,
      description: 'Track ongoing public scheme filings'
    },
    {
      id: 'settings',
      label: 'Account & Settings',
      icon: Sliders,
      description: 'Theme and account preferences'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-150">
      <div>
        <ProfileHeader />
      </div>

      {/* Account Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-px">
        <nav
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          role="tablist"
          aria-label="Account Sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.id === 'family' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                    }`}
                  >
                    Household
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      {/* 1. Personal Documents */}
      {activeTab === 'documents' && (
        <div
          id="documents"
          role="tabpanel"
          aria-labelledby="tab-documents"
          className="animate-in fade-in duration-200"
        >
          <UserDocuments />
        </div>
      )}

      {/* 2. Family Documents (Embedded) */}
      {activeTab === 'family' && (
        <div
          id="family"
          role="tabpanel"
          aria-labelledby="tab-family"
          className="animate-in fade-in duration-200"
        >
          <FamilyDocuments embedded={true} />
        </div>
      )}

      {/* 3. My Applications */}
      {activeTab === 'applications' && (
        <div
          id="applications"
          role="tabpanel"
          aria-labelledby="tab-applications"
          className="animate-in fade-in duration-200"
        >
          <UserApplications />
        </div>
      )}

      {/* 4. Account Settings & Appearance Preferences */}
      {activeTab === 'settings' && (
        <div
          id="settings"
          role="tabpanel"
          aria-labelledby="tab-settings"
          className="animate-in fade-in duration-200"
        >
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 transition-colors">
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
                <strong className="text-blue-700 dark:text-blue-400 capitalize">
                  {resolvedTheme === 'dark' ? 'AMOLED Dark' : 'White Light'}
                </strong>
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
      )}
    </div>
  );
};

export default Profile;

