import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  User,
  Mail,
  LogOut,
  Edit3,
  Check,
  Loader2,
  X,
  Shield,
  Key,
  Calendar
} from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  const { user, profile, signOut, updateProfileName } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Password reset state
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetNotice, setPasswordResetNotice] = useState<string | null>(null);

  // Sync state if profile changes
  React.useEffect(() => {
    if (profile?.full_name) {
      setNameInput(profile.full_name);
    }
  }, [profile?.full_name]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Citizen User';
  const displayEmail = profile?.email || user?.email || '';

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setEditError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setEditError(null);
    const { error } = await updateProfileName(nameInput.trim());
    setSaving(false);

    if (error) {
      setEditError(error.message || 'Failed to save profile changes.');
    } else {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setIsEditing(false);
      }, 1200);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setResettingPassword(true);
    setPasswordResetNotice(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setPasswordResetNotice('Password reset link has been dispatched to your email address.');
    } catch (err: any) {
      setPasswordResetNotice(`Error sending password reset: ${err.message}`);
    } finally {
      setResettingPassword(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white font-extrabold text-xl flex items-center justify-center shadow-inner tracking-wider shrink-0 border border-blue-800">
            {getInitials(displayName)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Verified Citizen
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayEmail}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Member since {memberSince}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Edit Profile & Logout */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isEditing && (
            <button
              onClick={() => {
                setNameInput(displayName);
                setIsEditing(true);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Edit Profile</span>
            </button>
          )}

          <button
            onClick={handleResetPassword}
            disabled={resettingPassword}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Send password reset link to your email"
          >
            {resettingPassword ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Key className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            )}
            <span>Reset Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {passwordResetNotice && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between">
          <span>{passwordResetNotice}</span>
          <button onClick={() => setPasswordResetNotice(null)} className="text-blue-600 dark:text-blue-400 font-bold ml-2">×</button>
        </div>
      )}

      {/* Edit Name Form Drawer */}
      {isEditing && (
        <form onSubmit={handleSave} className="pt-4 border-t border-slate-100 dark:border-zinc-900 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Update Profile Name</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {editError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{editError}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                disabled={saving}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved ✓</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Your name is synced with your Supabase authenticated citizen profile.
          </p>
        </form>
      )}
    </div>
  );
};
