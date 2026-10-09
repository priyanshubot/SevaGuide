import React, { useState } from 'react';
import { OFFICES_DATA } from '../data/offices';
import { OfficeMap } from '../components/OfficeMap';

export const OfficeLocator: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState(OFFICES_DATA[0]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Find Government Office</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          {OFFICES_DATA.map((office) => (
            <div
              key={office.id}
              onClick={() => setSelectedOffice(office)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                selectedOffice.id === office.id
                  ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-600/20'
                  : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{office.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{office.address}</p>
            </div>
          ))}
        </div>
        <div className="md:col-span-2"><OfficeMap office={selectedOffice} /></div>
      </div>
    </div>
  );
};