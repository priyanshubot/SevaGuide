import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import {
  FileText,
  ArrowRight,
  Clock,
  Banknote,
  AlertCircle,
  Files,
} from 'lucide-react';

export const ServiceCard: React.FC<{ service: Service; compact?: boolean }> = ({
  service,
  compact = false,
}) => {
  if (compact) {
    const fee = service.conciseFee || service.fee;
    const time = service.conciseProcessingTime || service.processingTime;

    return (
      <Link
        to={`/services/${service.id}`}
        className="service-card-pop group relative bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black text-left transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md"
        aria-label={`View details for ${service.name}`}
      >
        <div className="space-y-3">
          {/* Small Category Badge */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900 inline-block">
              {service.category}
            </span>
          </div>

          {/* Service Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors leading-snug">
            {service.name}
          </h3>
        </div>

        <div className="pt-4 mt-5 border-t border-slate-100 dark:border-zinc-900 space-y-4">
          {/* Optional concise fee and time metadata */}
          {(fee || time) && (
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
              {fee && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Banknote className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">
                    Fee: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{fee}</strong>
                  </span>
                </div>
              )}
              {time && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">
                    Time: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{time}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* One prominent full-width blue button */}
          <div className="w-full flex items-center justify-center bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-xs">
            <span>View Details</span>
          </div>
        </div>
      </Link>
    );
  }

  const hasConditional =
    service.hasConditionalDocs ||
    service.requiredDocuments.some((d) => d.isConditional);

  return (
    <Link
      to={`/services/${service.id}`}
      className="service-card-pop group relative bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black text-left transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md"
      aria-label={`View details and requirements for ${service.name}`}
    >
      <div className="space-y-3">
        {/* Category & Conditional Badge row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900">
            {service.category}
          </span>

          <div className="flex items-center gap-1.5">
            {hasConditional && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 px-2 py-0.5 rounded-md"
                title="This service has conditional requirements depending on applicant circumstances"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>Conditional</span>
              </span>
            )}
            <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Service Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors leading-snug">
          {service.name}
        </h3>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-900 space-y-4">
        {/* Metadata info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <Banknote className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">
              Fee: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{service.fee}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">
              Time: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{service.processingTime}</strong>
            </span>
          </div>
        </div>

        {/* Document Count Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <Files className="w-3.5 h-3.5" />
          <span>{service.requiredDocuments.length} document types specified</span>
        </div>

        {/* Primary Action Button */}
        <div className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-xs">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 service-card-icon" />
        </div>
      </div>
    </Link>
  );
};