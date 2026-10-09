import React from 'react';
import { Office } from '../types';
import { Navigation } from 'lucide-react';
import { getMapEmbedUrl, getDirectionsUrl } from '../services/maps';

export const OfficeMap: React.FC<{ office: Office }> = ({ office }) => {
  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
      <div className="p-4 bg-blue-900 dark:bg-zinc-950 text-white flex justify-between items-center border-b border-blue-950 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-sm">{office.name}</h4>
          <p className="text-xs text-slate-300 dark:text-slate-400">{office.distanceKm} km away</p>
        </div>
        <a href={getDirectionsUrl(office)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
          <Navigation className="w-3.5 h-3.5" /> Directions
        </a>
      </div>
      <div className="h-64 w-full bg-slate-100 dark:bg-zinc-900">
        <iframe title={office.name} src={getMapEmbedUrl(office)} className="w-full h-full border-0" loading="lazy" />
      </div>
    </div>
  );
};