import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { FileText, ArrowRight, Clock, Banknote } from 'lucide-react';

export const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  return (
    <Link
      to={`/services/${service.id}`}
      className="service-card-pop group relative bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black text-left block transition-colors"
      aria-label={`View requirements for ${service.name}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900">
            {service.category}
          </span>
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
          {service.name}
        </h3>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-zinc-900 mb-5">
          <div className="flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Fee: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{service.fee}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Time: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{service.processingTime}</strong></span>
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-sm">
          <span>View Requirements</span>
          <ArrowRight className="w-4 h-4 service-card-icon" />
        </div>
      </div>
    </Link>
  );
};