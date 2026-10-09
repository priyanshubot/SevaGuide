import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SERVICES_DATA } from '../data/services';
import { Application } from '../types';
import { ProcessSteps } from './ProcessSteps';
import {
  FileText,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  ShieldCheck
} from 'lucide-react';

export const UserApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      // Query ONLY real applications for the currently authenticated user
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Applications fetch warning:', error.message);
        setErrorMsg(error.message);
      } else if (data) {
        setApplications(
          data.map((item: any) => ({
            id: item.id,
            serviceId: item.service_id,
            serviceName: item.service_name,
            applicantName: item.applicant_name || user.user_metadata?.full_name || '',
            status: item.status,
            currentStepIndex: item.current_step_index ?? 0,
            lastUpdated: item.last_updated || 'Recently',
          }))
        );
      }
    } catch (err: any) {
      console.warn('Applications exception:', err);
      setErrorMsg(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleDeleteApplication = async (appId: string, serviceName: string) => {
    if (!window.confirm(`Are you sure you want to remove your ${serviceName} tracking record?`)) {
      return;
    }
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId);

      if (error) throw error;
      setApplications((prev) => prev.filter((a) => a.id !== appId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove application.');
    }
  };

  const renderStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Action Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            In Progress
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">My Applications</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              {applications.length} {applications.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track your ongoing civic service submissions</p>
        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Start Application</span>
        </Link>
      </div>

      {errorMsg && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            errorMsg.includes('schema cache') || errorMsg.includes('PGRST205')
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <AlertTriangle
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              errorMsg.includes('schema cache') || errorMsg.includes('PGRST205')
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}
          />
          <div className="space-y-1.5 flex-1">
            {errorMsg.includes('schema cache') || errorMsg.includes('PGRST205') ? (
              <>
                <div className="font-bold text-amber-950 text-sm">
                  Database Table Not Initialized: &apos;public.applications&apos;
                </div>
                <p className="leading-relaxed text-amber-900">
                  Supabase could not find table <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-semibold text-amber-950">public.applications</code> in the schema cache.
                  To resolve this, run the migration script provided in <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-semibold text-amber-950">supabase/schema.sql</code> in your <strong>Supabase Dashboard &gt; SQL Editor</strong>.
                </p>
                <div className="text-[11px] font-mono text-amber-800/80 pt-1 border-t border-amber-200/60">
                  PostgREST Error: {errorMsg}
                </div>
              </>
            ) : (
              <p>{errorMsg}</p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col justify-center items-center gap-2 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
          <span className="text-xs">Loading your applications...</span>
        </div>
      ) : applications.length === 0 ? (
        /* Useful Empty State */
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border border-blue-100 dark:border-blue-900">
            <FileText className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">No applications initiated yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You haven't tracked any service applications yet. Explore government services to verify documents, locate centers, and monitor your process.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <span>Explore Government Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const service = SERVICES_DATA.find((s) => s.id === app.serviceId);
            const totalSteps = service?.steps.length || 5;
            const progressText = `${app.currentStepIndex + 1} / ${totalSteps}`;

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{app.serviceName}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Ref: <span className="font-mono">{app.id}</span> • Step: <strong className="text-slate-700 dark:text-slate-300">{progressText}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(app.status)}
                    <button
                      onClick={() => handleDeleteApplication(app.id, app.serviceName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Remove tracking record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {service && (
                  <div className="pt-1">
                    <ProcessSteps steps={service.steps} currentStepIndex={app.currentStepIndex} />
                  </div>
                )}

                <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Updated {app.lastUpdated}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/verify/${app.serviceId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-transparent dark:border-zinc-800 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                      <span>Pre-check Docs</span>
                    </Link>
                    <Link
                      to={`/services/${app.serviceId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition shadow-sm"
                    >
                      <span>{app.status === 'Completed' ? 'View Details' : 'Continue'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
