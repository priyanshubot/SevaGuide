import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OFFICES_DATA } from '../data/offices';
import { Office } from '../types';
import { OfficeMap } from './OfficeMap';
import { MapPin, Clock, Compass, ArrowRight } from 'lucide-react';

export const NearbySevaKendras: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState<Office>(OFFICES_DATA[0]);
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationNote('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationNote(null);
    navigator.geolocation.getCurrentPosition(
      (_pos) => {
        setLocating(false);
        setLocationNote('Showing nearest facilitation centers relative to your location.');
      },
      (_err) => {
        setLocating(false);
        setLocationNote('Location access was not enabled; displaying regional facilitation centers.');
      },
      { timeout: 5000 }
    );
  };

  return (
    <section aria-label="Nearby Seva Kendras" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Nearby Seva Kendras
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Locate facilitation centers, opening hours, and distance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUseLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Optional: Detect nearest center using device location"
          >
            <Compass className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
            <span>{locating ? 'Detecting...' : 'Near Me'}</span>
          </button>
          <Link
            to="/offices"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline px-2 py-1.5"
          >
            <span>All Centers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {locationNote && (
        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 rounded-xl text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between">
          <span>{locationNote}</span>
          <button onClick={() => setLocationNote(null)} className="text-blue-600 dark:text-blue-400 font-bold ml-2">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Centers List */}
        <div className="space-y-3">
          {OFFICES_DATA.map((office) => {
            const isSelected = selectedOffice.id === office.id;
            return (
              <div
                key={office.id}
                onClick={() => setSelectedOffice(office)}
                className={`p-4 rounded-xl border cursor-pointer transition text-left space-y-2.5 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-600/20 shadow-sm'
                    : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedOffice(office);
                  }
                }}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{office.name}</h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      office.isOpen
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800'
                    }`}
                  >
                    {office.isOpen ? 'Open Today' : 'Closed'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-zinc-900 gap-2">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>{office.hours}</span>
                  </span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                    {office.distanceKm} km
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Embedded Map & Direction details */}
        <div className="lg:col-span-2">
          <OfficeMap office={selectedOffice} />
        </div>
      </div>
    </section>
  );
};
